// app/components/DashboardContent.tsx
"use client";

import ModelViewer from "@/app/components/modelViewer";
import { redirect } from "next/navigation";

export default function DashboardContent() {
  const handleLogWorkout = () => {
    redirect("/dashboard/addWorkout");
  };

  const handleWorkoutHistory = () => {
    redirect("/dashboard/calendar");
  };

  const handleWorkoutGallery = () => {
    redirect("/dashboard/gallary");
  };

  return (
    <div className="min-h-screen overflow-hidden">

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <div className="text-center pt-4 pb-4 sm:pt-6 sm:pb-8 px-4 flex-shrink-0 relative z-50">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            Workout <span className="text-blue-500">Tracker</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Visualize your muscle groups and track your fitness journey with precision
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
          {/* Mobile Layout (< md) */}
          <div className="block md:hidden space-y-6">
            {/* Navigation Buttons - Mobile */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl">
              <div className="grid grid-cols-1 gap-3">
                <button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 relative z-50 pointer-events-auto text-sm sm:text-base"
                  onClick={handleLogWorkout}
                >
                  Log Workout
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="w-full bg-slate-700/60 border border-slate-600 text-gray-200 py-3 rounded-xl font-medium hover:bg-slate-600/60 transition-all duration-200 relative z-50 pointer-events-auto text-xs sm:text-sm"
                    onClick={handleWorkoutHistory}
                  >
                    History
                  </button>
                  <button 
                    className="w-full bg-slate-700/60 border border-slate-600 text-gray-200 py-3 rounded-xl font-medium hover:bg-slate-600/60 transition-all duration-200 relative z-50 pointer-events-auto text-xs sm:text-sm"
                    onClick={handleWorkoutGallery}
                  >
                    Gallery
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Model - Mobile */}
            <div className="rounded-2xl overflow-hidden" style={{ height: '50vh', minHeight: '300px' }}>
              <ModelViewer />
            </div>

            {/* Feature Cards - Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/25">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white mb-1">Track Progress</h3>
                <p className="text-gray-300 text-xs">Monitor your workout metrics</p>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-purple-500/25">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white mb-1">Muscle Groups</h3>
                <p className="text-gray-300 text-xs">Target specific muscles</p>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-xl sm:col-span-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-green-500/25">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white mb-1">Achieve Goals</h3>
                <p className="text-gray-300 text-xs">Set targets and celebrate your fitness milestones</p>
              </div>
            </div>
          </div>

          {/* Desktop Layout (md+) */}
          <div className="hidden md:flex items-center justify-center min-h-0 h-full">
            <div className="grid grid-cols-12 gap-6 lg:gap-8 w-full max-w-7xl h-full max-h-[600px]">
              
              {/* Left Sidebar - Navigation */}
              <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col justify-center space-y-4 lg:space-y-6 relative z-50">
                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 lg:p-6 shadow-xl">
                  <div className="space-y-3">
                    <button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 relative z-50 pointer-events-auto text-sm lg:text-base"
                      onClick={handleLogWorkout}
                    >
                      Log Workout
                    </button>
                    <button 
                      className="w-full bg-slate-700/60 border border-slate-600 text-gray-200 py-3 rounded-xl font-medium hover:bg-slate-600/60 transition-all duration-200 relative z-50 pointer-events-auto text-sm lg:text-base"
                      onClick={handleWorkoutHistory}
                    >
                      Workout History
                    </button>
                    <button 
                      className="w-full bg-slate-700/60 border border-slate-600 text-gray-200 py-3 rounded-xl font-medium hover:bg-slate-600/60 transition-all duration-200 relative z-50 pointer-events-auto text-sm lg:text-base"
                      onClick={handleWorkoutGallery}
                    >
                      Workout Gallery
                    </button>
                  </div>
                </div>

                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 lg:p-6 shadow-xl">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 lg:mb-4 shadow-lg shadow-blue-500/25">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-base lg:text-lg font-bold text-white mb-2">Track Progress</h3>
                  <p className="text-gray-300 text-xs lg:text-sm">Monitor your workout metrics and see real improvements</p>
                </div>
              </div>

              {/* Center - 3D Model */}
              <div className="col-span-12 md:col-span-8 lg:col-span-6 flex items-center justify-center relative z-10">
                <div className="relative group w-full h-full">
                  <div className="h-full rounded-2xl overflow-hidden" style={{ height: 'calc(100% - 20px)', minHeight: '400px' }}>
                    <ModelViewer />
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Features (Hidden on md, shown on lg+) */}
              <div className="hidden lg:flex lg:col-span-3 flex-col justify-center space-y-6 relative z-50">
                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Muscle Groups</h3>
                  <p className="text-gray-300 text-sm">Visualize and target specific muscle groups effectively</p>
                </div>

                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/25">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Achieve Goals</h3>
                  <p className="text-gray-300 text-sm">Set targets and celebrate your fitness milestones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}