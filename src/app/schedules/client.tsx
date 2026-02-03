'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type Schedule = {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  mode: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolled: number;
  color: string;
};

type ViewMode = 'weekly' | 'monthly';

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const colorClasses: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  'toko-green': {
    bg: 'bg-toko-green/10',
    text: 'text-toko-green',
    border: 'border-toko-green',
    badge: 'bg-toko-green text-white'
  },
  'toko-blue': {
    bg: 'bg-toko-blue/10',
    text: 'text-toko-blue',
    border: 'border-toko-blue',
    badge: 'bg-toko-blue text-white'
  },
  'toko-magenta': {
    bg: 'bg-toko-magenta/10',
    text: 'text-toko-magenta',
    border: 'border-toko-magenta',
    badge: 'bg-toko-magenta text-white'
  },
  'toko-yellow': {
    bg: 'bg-toko-yellow/10',
    text: 'text-toko-yellow-dark',
    border: 'border-toko-yellow',
    badge: 'bg-toko-yellow text-toko-gray-900'
  },
};

export default function SchedulesClient({ schedules }: { schedules: Schedule[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-02');

  // Get unique courses for filter
  const courses = useMemo(() => {
    const uniqueCourses = Array.from(
      new Map(schedules.map(s => [s.courseCode, { code: s.courseCode, name: s.courseName }]))
    ).map(([_, course]) => course);
    return uniqueCourses;
  }, [schedules]);

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    let filtered = schedules;

    if (selectedCourse !== 'all') {
      filtered = filtered.filter(s => s.courseCode === selectedCourse);
    }

    if (viewMode === 'monthly') {
      filtered = filtered.filter(s => {
        const scheduleMonth = s.startDate.substring(0, 7);
        return scheduleMonth === selectedMonth;
      });
    }

    return filtered;
  }, [schedules, selectedCourse, selectedMonth, viewMode]);

  // Group by day for weekly view
  const schedulesByDay = useMemo(() => {
    const grouped: Record<string, Schedule[]> = {};
    dayOrder.forEach(day => {
      grouped[day] = filteredSchedules
        .filter(s => s.dayOfWeek === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return grouped;
  }, [filteredSchedules]);

  // Group by date for monthly view
  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, Schedule[]> = {};
    
    filteredSchedules.forEach(schedule => {
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      
      // Find all occurrences in the selected month
      const [year, month] = selectedMonth.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        
        // Check if this date falls on the class day and is within range
        if (date >= startDate && date <= endDate && 
            date.toLocaleDateString('en-US', { weekday: 'long' }) === schedule.dayOfWeek) {
          const dateKey = date.toISOString().split('T')[0];
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(schedule);
        }
      }
    });
    
    return grouped;
  }, [filteredSchedules, selectedMonth]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    schedules.forEach(s => {
      months.add(s.startDate.substring(0, 7));
      months.add(s.endDate.substring(0, 7));
    });
    return Array.from(months).sort();
  }, [schedules]);

  const getAvailabilityBadge = (schedule: Schedule) => {
    const spotsLeft = schedule.capacity - schedule.enrolled;
    if (spotsLeft === 0) {
      return <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">Full</span>;
    } else if (spotsLeft <= 3) {
      return <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">{spotsLeft} spots left</span>;
    }
    return <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">Available</span>;
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-48 md:pt-56 pb-12 md:pb-16 bg-gradient-to-br from-toko-blue to-toko-magenta text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-4">Class Schedules</h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8">
              Find the perfect class time for your learning journey
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="bg-white border-b border-toko-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="section-container py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* View Mode Toggle */}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setViewMode('weekly')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-toko-blue text-white shadow-md'
                    : 'bg-toko-gray-100 text-toko-gray-700 hover:bg-toko-gray-200'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'monthly'
                    ? 'bg-toko-blue text-white shadow-md'
                    : 'bg-toko-gray-100 text-toko-gray-700 hover:bg-toko-gray-200'
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Course Filter */}
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-2.5 border border-toko-gray-300 rounded-lg bg-white text-toko-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-toko-blue w-full sm:w-auto"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.code} value={course.code}>
                    {course.name}
                  </option>
                ))}
              </select>

              {/* Month Picker (only for monthly view) */}
              {viewMode === 'monthly' && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2.5 border border-toko-gray-300 rounded-lg bg-white text-toko-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-toko-magenta w-full sm:w-auto"
                >
                  {availableMonths.map(month => {
                    const date = new Date(month + '-01');
                    return (
                      <option key={month} value={month}>
                        {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          {filteredSchedules.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-20 h-20 mx-auto text-toko-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-toko-gray-900 mb-2">No classes found</h3>
              <p className="text-toko-gray-600">Try adjusting your filters</p>
            </div>
          ) : viewMode === 'weekly' ? (
            <div className="space-y-6">
              {dayOrder.map(day => {
                const daySchedules = schedulesByDay[day];
                if (daySchedules.length === 0) return null;

                return (
                  <div key={day} className="card p-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-toko-blue to-toko-magenta p-4">
                      <h2 className="text-2xl font-bold text-white">{day}</h2>
                    </div>
                    <div className="p-4 space-y-3">
                      {daySchedules.map(schedule => {
                        const colors = colorClasses[schedule.color] || colorClasses['toko-green'];
                        return (
                          <div
                            key={schedule.id}
                            className={`p-4 rounded-lg border-l-4 ${colors.border} ${colors.bg} hover:shadow-md transition-shadow`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex-1">
                                {/* Mobile: Time on its own line */}
                                <div className="sm:hidden mb-3">
                                  <div className={`${colors.badge} inline-block px-3 py-1 rounded text-sm font-bold`}>
                                    {schedule.startTime} - {schedule.endTime}
                                  </div>
                                </div>
                                
                                {/* Desktop: Time with title */}
                                <div className="hidden sm:flex items-start gap-3 mb-2">
                                  <div className="flex-shrink-0">
                                    <div className={`${colors.badge} px-3 py-1 rounded text-sm font-bold`}>
                                      {schedule.startTime} - {schedule.endTime}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className={`text-lg font-bold ${colors.text} mb-1`}>
                                      {schedule.courseName}
                                    </h3>
                                    <p className="text-sm text-toko-gray-700 font-medium mb-1">
                                      {schedule.instructor}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-xs text-toko-gray-600">
                                      <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {schedule.location}
                                      </span>
                                      <span>•</span>
                                      <span>{schedule.mode}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Mobile: Title and details */}
                                <div className="sm:hidden">
                                  <h3 className={`text-lg font-bold ${colors.text} mb-1`}>
                                    {schedule.courseName}
                                  </h3>
                                  <p className="text-sm text-toko-gray-700 font-medium mb-1">
                                    {schedule.instructor}
                                  </p>
                                  <div className="flex flex-wrap gap-2 text-xs text-toko-gray-600">
                                    <span className="flex items-center gap-1">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      {schedule.location}
                                    </span>
                                    <span>•</span>
                                    <span>{schedule.mode}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex sm:flex-col gap-2 sm:items-end">
                                {getAvailabilityBadge(schedule)}
                                <Link
                                  href={`/courses/${schedule.courseCode.toLowerCase()}`}
                                  className="text-sm font-semibold text-toko-blue hover:underline whitespace-nowrap"
                                >
                                  View Course →
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(schedulesByDate)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, daySchedules]) => {
                  const dateObj = new Date(date);
                  return (
                    <div key={date} className="card p-0 overflow-hidden">
                      <div className="bg-gradient-to-br from-toko-magenta to-toko-blue p-4 text-white">
                        <div className="text-3xl font-bold">
                          {dateObj.getDate()}
                        </div>
                        <div className="text-sm opacity-90">
                          {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short' })}
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {daySchedules.map(schedule => {
                          const colors = colorClasses[schedule.color] || colorClasses['toko-green'];
                          return (
                            <div
                              key={schedule.id}
                              className={`p-3 rounded-lg ${colors.bg} border-l-4 ${colors.border}`}
                            >
                              <div className={`${colors.badge} inline-block px-2 py-1 rounded text-xs font-bold mb-2`}>
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                              <h4 className={`font-bold ${colors.text} text-sm mb-1`}>
                                {schedule.courseName}
                              </h4>
                              <p className="text-xs text-toko-gray-600 mb-2">
                                {schedule.instructor}
                              </p>
                              <div className="flex items-center justify-between">
                                {getAvailabilityBadge(schedule)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Call to Action */}
          {filteredSchedules.length > 0 && (
            <div className="mt-12 text-center">
              <div className="card p-8 bg-gradient-to-br from-toko-green/10 to-toko-blue/10 border-2 border-toko-green">
                <h3 className="text-2xl font-bold text-toko-gray-900 mb-4">
                  Ready to Start Learning?
                </h3>
                <p className="text-toko-gray-700 mb-6 max-w-2xl mx-auto">
                  Choose a class that fits your schedule and begin your journey to mastering new digital skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/courses" className="btn-primary">
                    Browse All Courses
                  </Link>
                  <Link href="/contact" className="btn-secondary">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
