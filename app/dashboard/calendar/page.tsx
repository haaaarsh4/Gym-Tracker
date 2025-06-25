"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  formatDate,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
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

  // Use fetchWorkouts in useEffect
  useEffect(() => {
    fetchWorkouts();
  }, []);

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

  return (
    <>
      <div className="flex w-full justify-start items-start gap-8">
        <div className="w-full sm:text-xl 
          [&_.fc-toolbar-title]:text-base [&_.fc-toolbar-title]:sm:text-2xl  
          [&_.fc-button]:text-xs [&_.fc-button]:sm:text-sm  
          [&_.fc-button]:p-1 [&_.fc-button]:sm:p-2
          [&_.fc-daygrid-event]:text-xs [&_.fc-daygrid-event]:sm:text-sm
          [&_.fc-event-title]:text-[8px] [&_.fc-event-title]:sm:text-sm [&_.fc-event-title]:font-bold
          [&_.fc-daygrid-event]:py-0 [&_.fc-daygrid-event]:px-1  
          [&_.fc-daygrid-event]:sm:py-1 [&_.fc-daygrid-event]:sm:px-2
          [&_.fc-daygrid-event]:!whitespace-normal  
          [&_.fc-daygrid-event]:hover:cursor-pointer
          [&_.fc-daygrid-event-harness]:!h-auto 
          [&_.fc-daygrid-dot-event]:!whitespace-normal 
          [&_.fc-daygrid-dot-event_.fc-event-title]:!whitespace-normal 
          [&_.fc-daygrid-event_.fc-event-title]:!whitespace-normal 
          [&_.fc-daygrid-event_.fc-event-title]:overflow-hidden 
          [&_.fc-daygrid-event_.fc-event-title]:break-words 
          [&_.fc-day]:min-h-[4rem]">
          <FullCalendar
            height={"85vh"}
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
            dayMaxEvents={2}
            displayEventTime={false}
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
                        // Refresh the workouts list
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