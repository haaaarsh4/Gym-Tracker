"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventApi } from "@fullcalendar/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarCard } from "@/app/components/calendarCard";

interface Workout {
  id: string;
  title: string;
  date: string;
  notes?: string;
}

export default function Calendar() {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const calendarRef = useRef<any>(null);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch("/api/getworkout");
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data: Workout[] = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Scroll to current time when view changes or component mounts
  useEffect(() => {
    const scrollToCurrentTime = () => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const currentView = calendarApi.view.type;
        
        // Only scroll in week and day views
        if (currentView === 'timeGridWeek' || currentView === 'timeGridDay') {
          setTimeout(() => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            
            // Calculate the scroll position to center current time
            const scrollTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
            calendarApi.scrollToTime(scrollTime);
          }, 100);
        }
      }
    };

    scrollToCurrentTime();
  }, [workouts]);

  const formatWorkouts = () =>
    workouts.map((workout) => ({
      id: workout.id,
      title: workout.title || "Untitled Workout",
      start: new Date(workout.date).toISOString(),
      description: workout.notes || "No additional notes",
      extendedProps: { ...workout }
    }));

  const handleEventClick = (selected: EventClickArg) => {
    const workout = workouts.find(w => w.id === selected.event.id);
    if (workout) {
      setSelectedWorkout(workout);
      setIsDialogOpen(true);
    }
  };

  const handleEventsSet = (events: EventApi[]) => {
    if (JSON.stringify(events) !== JSON.stringify(currentEvents)) {
      setCurrentEvents(events);
    }
  };

  const handleViewChange = () => {
    // Scroll to current time when view changes
    setTimeout(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const currentView = calendarApi.view.type;
        
        if (currentView === 'timeGridWeek' || currentView === 'timeGridDay') {
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const scrollTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
          calendarApi.scrollToTime(scrollTime);
        }
      }
    }, 100);
  };

  return (
    <>
      <div className="flex w-full h-[calc(100vh-8rem)] justify-start items-start gap-8 p-2 sm:p-4 overflow-hidden">
        <div className="w-full h-full calendar-container overflow-hidden">
          <style jsx global>{`
            /* Base calendar styling */
            .calendar-container {
              overflow: hidden !important;
            }
            
            .calendar-container .fc {
              font-size: 14px;
            }
            
            /* MONTH VIEW - No scroll */
            .calendar-container .fc-dayGridMonth-view .fc-scroller {
              overflow: hidden !important;
            }
            
            .calendar-container .fc-dayGridMonth-view .fc-scroller-liquid-absolute {
              overflow: hidden !important;
            }
            
            /* WEEK & DAY VIEW - Allow vertical scroll */
            .calendar-container .fc-timeGridWeek-view .fc-scroller,
            .calendar-container .fc-timeGridDay-view .fc-scroller {
              overflow-y: auto !important;
              overflow-x: hidden !important;
            }
            
            .calendar-container .fc-timeGridWeek-view .fc-scroller-liquid-absolute,
            .calendar-container .fc-timeGridDay-view .fc-scroller-liquid-absolute {
              overflow-y: auto !important;
              overflow-x: hidden !important;
            }
            
            /* Custom scrollbar for time grid views */
            .calendar-container .fc-timeGridWeek-view .fc-scroller::-webkit-scrollbar,
            .calendar-container .fc-timeGridDay-view .fc-scroller::-webkit-scrollbar {
              width: 8px;
            }
            
            .calendar-container .fc-timeGridWeek-view .fc-scroller::-webkit-scrollbar-track,
            .calendar-container .fc-timeGridDay-view .fc-scroller::-webkit-scrollbar-track {
              background: #1e293b;
              border-radius: 4px;
            }
            
            .calendar-container .fc-timeGridWeek-view .fc-scroller::-webkit-scrollbar-thumb,
            .calendar-container .fc-timeGridDay-view .fc-scroller::-webkit-scrollbar-thumb {
              background: #475569;
              border-radius: 4px;
            }
            
            .calendar-container .fc-timeGridWeek-view .fc-scroller::-webkit-scrollbar-thumb:hover,
            .calendar-container .fc-timeGridDay-view .fc-scroller::-webkit-scrollbar-thumb:hover {
              background: #64748b;
            }
            
            /* Toolbar responsive */
            .calendar-container .fc-toolbar-title {
              font-size: 1.25rem !important;
            }
            
            .calendar-container .fc-button {
              padding: 0.4rem 0.8rem !important;
              font-size: 0.875rem !important;
            }
            
            /* Event styling - readable sizes */
            .calendar-container .fc-event-title {
              font-size: 0.75rem !important;
              font-weight: 600 !important;
              line-height: 1.2 !important;
              white-space: normal !important;
              overflow-wrap: break-word !important;
              padding: 2px 4px !important;
            }
            
            .calendar-container .fc-daygrid-event {
              white-space: normal !important;
              padding: 4px 6px !important;
              margin: 1px 2px !important;
              cursor: pointer !important;
            }
            
            .calendar-container .fc-daygrid-event:hover {
              opacity: 0.8;
            }
            
            /* Day header in MONTH view - match week/day style */
            .calendar-container .fc-dayGridMonth-view .fc-col-header-cell {
              padding: 0.5rem 0.25rem !important;
              background: transparent !important;
              border-bottom: 1px solid #e2e8f0 !important;
              border-right: 1px solid #e2e8f0 !important;
            }
            
            .calendar-container .fc-dayGridMonth-view .fc-col-header-cell-cushion {
              color: #64748b !important;
              font-weight: 600 !important;
              font-size: 0.75rem !important;
              text-transform: uppercase !important;
              letter-spacing: 0.025em !important;
            }
            
            .calendar-container .fc-dayGridMonth-view .fc-day-today .fc-col-header-cell-cushion {
              color: #3788d8 !important;
            }
            
            .calendar-container .fc-dayGridMonth-view .fc-day-today .fc-col-header-cell {
              background: #eff6ff !important;
            }
            
            /* Make cells taller for readability */
            .calendar-container .fc-daygrid-day {
              min-height: 100px !important;
            }
            
            /* Full height calendar */
            .calendar-container .fc {
              height: 100% !important;
            }
            
            .calendar-container .fc-view-harness {
              height: 100% !important;
            }
            
            /* Popover styling */
            .calendar-container .fc-popover {
              background: white !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 0.75rem !important;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
              max-width: 300px !important;
            }
            
            .calendar-container .fc-popover-header {
              background: #f8fafc !important;
              padding: 0.75rem 1rem !important;
              border-bottom: 1px solid #e2e8f0 !important;
            }
            
            .calendar-container .fc-popover-title {
              color: #1e293b !important;
              font-weight: 600 !important;
              font-size: 0.875rem !important;
            }
            
            .calendar-container .fc-popover-close {
              background: transparent !important;
              color: #64748b !important;
              padding: 0.25rem !important;
              width: 2rem !important;
              height: 2rem !important;
              border-radius: 0.375rem !important;
            }
            
            .calendar-container .fc-popover-close:hover {
              background: #e2e8f0 !important;
              color: #1e293b !important;
            }
            
            .calendar-container .fc-popover-body {
              padding: 0.5rem !important;
              max-height: 300px !important;
              overflow-y: auto !important;
            }
            
            .calendar-container .fc-popover .fc-daygrid-event {
              padding: 0.5rem 0.75rem !important;
              border-radius: 0.5rem !important;
              margin: 0.25rem 0 !important;
            }
            
            /* ============================================
               WEEK AND DAY VIEW IMPROVEMENTS
               ============================================ */
            
            /* Time grid structure */
            .calendar-container .fc-timegrid-slot {
              height: 3.5rem !important;
              border-bottom: 1px solid #f1f5f9 !important;
            }
            
            .calendar-container .fc-timegrid-slot-label {
              color: #64748b !important;
              font-size: 0.75rem !important;
              font-weight: 500 !important;
              padding: 0 0.5rem !important;
              border-right: 1px solid #e2e8f0 !important;
            }
            
            .calendar-container .fc-timegrid-col {
              border-right: 1px solid #e2e8f0 !important;
            }
            
            .calendar-container .fc-timegrid-axis {
              border-right: 1px solid #e2e8f0 !important;
            }
            
            .calendar-container .fc-timegrid-divider {
              border-bottom: 1px solid #e2e8f0 !important;
            }
            
            /* Day header in week/day view */
            .calendar-container .fc-timegrid .fc-col-header-cell {
              padding: 0.5rem 0.25rem !important;
              background: transparent !important;
              border-bottom: 1px solid #e2e8f0 !important;
              border-right: 1px solid #e2e8f0 !important;
            }
            
            .calendar-container .fc-timegrid .fc-col-header-cell-cushion {
              color: #64748b !important;
              font-weight: 600 !important;
              font-size: 0.75rem !important;
              text-transform: uppercase !important;
              letter-spacing: 0.025em !important;
            }
            
            .calendar-container .fc-day-today .fc-col-header-cell-cushion {
              color: #3788d8 !important;
            }
            
            .calendar-container .fc-day-today .fc-col-header-cell {
              background: #eff6ff !important;
            }
            
            /* All day section */
            .calendar-container .fc-timegrid-axis-cushion {
              color: #64748b !important;
              font-size: 0.7rem !important;
              font-weight: 500 !important;
            }
            
            .calendar-container .fc-daygrid-day-top {
              padding: 0.25rem !important;
            }
            
            /* Time grid events */
            .calendar-container .fc-timegrid-event {
              border-radius: 0.375rem !important;
              border: none !important;
              background: #3788d8 !important;
              padding: 0.5rem 0.625rem !important;
              margin: 2px 4px !important;
              box-shadow: none !important;
              cursor: pointer !important;
            }
            
            .calendar-container .fc-timegrid-event-harness {
              left: 0 !important;
              right: 0 !important;
              margin: 0 4px !important;
            }
            
            .calendar-container .fc-timegrid-event .fc-event-main {
              display: block !important;
              padding: 0 !important;
            }
            
            .calendar-container .fc-timegrid-event .fc-event-time {
              display: block !important;
              font-size: 0.7rem !important;
              font-weight: 500 !important;
              color: rgba(255, 255, 255, 0.85) !important;
              margin-bottom: 0.125rem !important;
            }
            
            .calendar-container .fc-timegrid-event .fc-event-title-container {
              display: block !important;
            }
            
            .calendar-container .fc-timegrid-event .fc-event-title {
              display: block !important;
              font-size: 0.75rem !important;
              font-weight: 600 !important;
              color: white !important;
              line-height: 1.3 !important;
              white-space: normal !important;
              overflow-wrap: break-word !important;
            }
            
            .calendar-container .fc-timegrid-event:hover {
              opacity: 0.8;
            }
            
            /* Now indicator */
            .calendar-container .fc-timegrid-now-indicator-line {
              border-color: #ef4444 !important;
              border-width: 2px !important;
            }
            
            .calendar-container .fc-timegrid-now-indicator-arrow {
              border-color: #ef4444 !important;
            }
            
            /* Mobile adjustments */
            @media (max-width: 640px) {
              .calendar-container .fc-toolbar-title {
                font-size: 1rem !important;
              }
              
              .calendar-container .fc-button {
                padding: 0.3rem 0.5rem !important;
                font-size: 0.75rem !important;
              }
              
              .calendar-container .fc-event-title {
                font-size: 0.7rem !important;
              }
              
              .calendar-container .fc-daygrid-day {
                min-height: 70px !important;
              }
              
              .calendar-container .fc-timegrid-slot {
                height: 2.5rem !important;
              }
              
              .calendar-container .fc-timegrid-slot-label {
                font-size: 0.7rem !important;
                padding: 0 0.5rem !important;
              }
              
              .calendar-container .fc-toolbar {
                flex-direction: column !important;
                gap: 0.5rem !important;
                margin-bottom: 0.5rem !important;
              }
              
              .calendar-container .fc-toolbar-chunk {
                display: flex;
                justify-content: center;
              }
            }
            
            /* Extra small screens */
            @media (max-width: 480px) {
              .calendar-container .fc-daygrid-day {
                min-height: 60px !important;
              }
              
              .calendar-container .fc-event-title {
                font-size: 0.65rem !important;
              }
              
              .calendar-container .fc-timegrid-slot {
                height: 2rem !important;
              }
            }
            
            /* ============================================
               DARK MODE
               ============================================ */
            
            .dark .calendar-container .fc-popover {
              background: #1e293b !important;
              border-color: #334155 !important;
            }
            
            .dark .calendar-container .fc-popover-header {
              background: #0f172a !important;
              border-color: #334155 !important;
            }
            
            .dark .calendar-container .fc-popover-title {
              color: #f1f5f9 !important;
            }
            
            .dark .calendar-container .fc-popover-close {
              color: #94a3b8 !important;
            }
            
            .dark .calendar-container .fc-popover-close:hover {
              background: #334155 !important;
              color: #f1f5f9 !important;
            }
            
            .dark .calendar-container .fc-popover-body {
              background: #1e293b !important;
            }
            
            /* Dark mode for month view headers */
            .dark .calendar-container .fc-dayGridMonth-view .fc-col-header-cell {
              background: transparent !important;
              border-bottom-color: #334155 !important;
              border-right-color: #334155 !important;
            }
            
            .dark .calendar-container .fc-dayGridMonth-view .fc-col-header-cell-cushion {
              color: #94a3b8 !important;
            }
            
            .dark .calendar-container .fc-dayGridMonth-view .fc-day-today .fc-col-header-cell-cushion {
              color: #3788d8 !important;
            }
            
            .dark .calendar-container .fc-dayGridMonth-view .fc-day-today .fc-col-header-cell {
              background: #1e3a5f !important;
            }
            
            .dark .calendar-container .fc-timegrid-slot {
              border-bottom-color: #1e293b !important;
            }
            
            .dark .calendar-container .fc-timegrid-slot-label {
              color: #94a3b8 !important;
              border-right-color: #334155 !important;
            }
            
            .dark .calendar-container .fc-timegrid-col {
              border-right-color: #334155 !important;
            }
            
            .dark .calendar-container .fc-timegrid-axis {
              border-right-color: #334155 !important;
            }
            
            .dark .calendar-container .fc-timegrid-divider {
              border-bottom-color: #334155 !important;
            }
            
            .dark .calendar-container .fc-timegrid .fc-col-header-cell {
              background: transparent !important;
              border-bottom-color: #334155 !important;
              border-right-color: #334155 !important;
            }
            
            .dark .calendar-container .fc-timegrid .fc-col-header-cell-cushion {
              color: #94a3b8 !important;
            }
            
            .dark .calendar-container .fc-day-today .fc-col-header-cell-cushion {
              color: #3788d8 !important;
            }
            
            .dark .calendar-container .fc-day-today .fc-col-header-cell {
              background: #1e3a5f !important;
            }
            
            .dark .calendar-container .fc-timegrid-axis-cushion {
              color: #94a3b8 !important;
            }
            
            .dark .calendar-container .fc-scrollgrid {
              border-color: #334155 !important;
            }
            
            .dark .calendar-container .fc-scrollgrid td,
            .dark .calendar-container .fc-scrollgrid th {
              border-color: #334155 !important;
            }
            
            /* Dark mode scrollbar */
            .dark .calendar-container .fc-timeGridWeek-view .fc-scroller::-webkit-scrollbar-track,
            .dark .calendar-container .fc-timeGridDay-view .fc-scroller::-webkit-scrollbar-track {
              background: #0f172a;
            }
            
            .dark .calendar-container .fc-timeGridWeek-view .fc-scroller::-webkit-scrollbar-thumb,
            .dark .calendar-container .fc-timeGridDay-view .fc-scroller::-webkit-scrollbar-thumb {
              background: #334155;
            }
            
            .dark .calendar-container .fc-timeGridWeek-view .fc-scroller::-webkit-scrollbar-thumb:hover,
            .dark .calendar-container .fc-timeGridDay-view .fc-scroller::-webkit-scrollbar-thumb:hover {
              background: #475569;
            }
          `}</style>
          
          <FullCalendar
            ref={calendarRef}
            height={"100%"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            events={formatWorkouts()}
            eventClick={handleEventClick}
            eventsSet={handleEventsSet}
            dayMaxEvents={3}
            displayEventTime={false}
            eventDisplay="block"
            nowIndicator={true}
            slotMinTime="06:00:00"
            slotMaxTime="23:00:00"
            scrollTime="09:00:00"
            viewDidMount={handleViewChange}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0">
          {selectedWorkout && (
            <>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <CalendarCard
                title={selectedWorkout.title}
                date={selectedWorkout.date}
                notes={selectedWorkout.notes || "No additional notes"}
                workoutId={selectedWorkout.id}
                onDelete={() => {
                  setIsDialogOpen(false);
                  fetchWorkouts();
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}