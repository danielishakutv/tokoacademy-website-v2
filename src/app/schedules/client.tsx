'use client';

import { useState, useMemo, type ReactNode } from 'react';
import Link from 'next/link';

/**
 * The timetable.
 *
 * Two things were rebuilt here beyond the colour migration.
 *
 * **Every class was written out twice.** There was a `sm:hidden` block and a
 * `hidden sm:flex` block carrying the same course name, the same instructor
 * and the same location — two copies of the truth in one file, and twice the
 * DOM on the phone that can least afford it. One block now handles both, by
 * letting the flex direction change instead of the markup.
 *
 * **The controls sat behind the header.** They were `sticky top-0`, which on a
 * site with a fixed header means stuck underneath it and invisible. They now
 * stick just below it.
 */

type Schedule = {
  id: string;
  courseCode: string;
  courseName: string;
  /** Null where the record had only a placeholder; see `page.tsx`. */
  instructor: string | null;
  mode: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  startDate: string;
  endDate: string;
  color: string;
};

type ViewMode = 'weekly' | 'monthly';

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/*
 * Each accent needs a dark-theme partner. `text-toko-green` is #4A7C2A — a
 * green chosen to be readable *on white*, and all but invisible on a tinted
 * block in the dark theme. The `-light` variants are the same hues lifted.
 * The badges keep `text-white` because they are solid colour, not surfaces.
 */
const colorClasses: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  'toko-green': {
    bg: 'bg-toko-green/10',
    text: 'text-toko-green dark:text-toko-green-light',
    border: 'border-toko-green',
    badge: 'bg-toko-green text-white'
  },
  'toko-blue': {
    bg: 'bg-toko-blue/10',
    text: 'text-toko-blue-dark dark:text-toko-blue-light',
    border: 'border-toko-blue',
    badge: 'bg-toko-blue-dark text-white'
  },
  'toko-magenta': {
    bg: 'bg-toko-magenta/10',
    text: 'text-toko-magenta-dark dark:text-toko-magenta-light',
    border: 'border-toko-magenta',
    badge: 'bg-toko-magenta-dark text-white'
  },
  'toko-yellow': {
    bg: 'bg-toko-yellow/10',
    text: 'text-toko-yellow-dark dark:text-toko-yellow-light',
    border: 'border-toko-yellow',
    badge: 'bg-toko-yellow text-toko-gray-900'
  },
};

const selectClass =
  'w-full rounded-lg border border-line-strong bg-surface-raised px-4 py-2.5 font-medium text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 sm:w-auto';

/*
 * `heroImage` arrives already rendered from the server page rather than being
 * imported here. `Picture` checks the filesystem at build time to decide
 * between a photograph and a labelled placeholder, and `node:fs` cannot be
 * pulled into a client bundle — so the server renders it and hands it over.
 */
export default function SchedulesClient({
  schedules,
  heroImage,
}: {
  schedules: Schedule[];
  heroImage?: ReactNode;
}) {
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

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-14 md:pt-40 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <div className={`grid items-center gap-10 ${heroImage ? 'lg:grid-cols-[1.1fr_0.9fr]' : ''}`}>
            <div className="reveal">
              <p className="eyebrow">Timetable</p>
              <h1 className="mt-3">Class Schedules</h1>
              <p className="prose-measure mt-5 text-lg text-ink-muted md:text-xl">
                Find the perfect class time for your learning journey.
              </p>
            </div>
            {/* A timetable is a page of numbers. One photograph of the room
                those numbers describe is what stops it reading as a
                spreadsheet. */}
            {heroImage}
          </div>
        </div>
      </section>

      {/* Controls. The offsets track the fixed header's height and are
          deliberately a few pixels short of it, so this bar tucks under its
          edge rather than leaving a sliver of the page sliding past. */}
      <section className="sticky top-[60px] z-30 border-b border-line bg-surface/95 backdrop-blur md:top-[96px] lg:top-[100px]">
        <div className="section-container py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* View Mode */}
            <div className="flex w-full gap-2 md:w-auto" role="group" aria-label="View">
              {(['weekly', 'monthly'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={`min-h-[44px] flex-1 rounded-lg px-6 font-semibold capitalize transition-colors md:flex-none ${
                    viewMode === mode
                      ? 'bg-toko-blue-dark text-white shadow-md'
                      : 'bg-surface-sunken text-ink-muted hover:text-brand'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <label className="sr-only" htmlFor="course-filter">Filter by course</label>
              <select
                id="course-filter"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={selectClass}
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.code} value={course.code}>
                    {course.name}
                  </option>
                ))}
              </select>

              {viewMode === 'monthly' && (
                <>
                  <label className="sr-only" htmlFor="month-filter">Filter by month</label>
                  <select
                    id="month-filter"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={selectClass}
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          {filteredSchedules.length === 0 ? (
            <div className="py-16 text-center">
              <svg className="mx-auto mb-4 h-20 w-20 text-ink-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3>No classes found</h3>
              <p className="mt-2 text-ink-muted">Try adjusting your filters.</p>
            </div>
          ) : viewMode === 'weekly' ? (
            <div className="space-y-6">
              {dayOrder.map(day => {
                const daySchedules = schedulesByDay[day];
                if (daySchedules.length === 0) return null;

                return (
                  <div key={day} className="card overflow-hidden p-0 reveal">
                    <div className="bg-gradient-to-r from-toko-blue to-toko-magenta p-4">
                      <h2 className="text-white">{day}</h2>
                    </div>
                    <div className="space-y-3 p-3 sm:p-4">
                      {daySchedules.map(schedule => (
                        <ClassRow key={schedule.id} schedule={schedule} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(schedulesByDate)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, daySchedules]) => {
                  const dateObj = new Date(date);
                  return (
                    <div key={date} className="card overflow-hidden p-0 reveal">
                      <div className="bg-gradient-to-br from-toko-magenta to-toko-blue p-4 text-white">
                        <div className="text-3xl font-bold leading-none">
                          {dateObj.getDate()}
                        </div>
                        <div className="mt-1 text-sm text-white/90">
                          {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short' })}
                        </div>
                      </div>
                      <div className="space-y-3 p-4">
                        {daySchedules.map(schedule => {
                          const colors = colorClasses[schedule.color] || colorClasses['toko-green'];
                          return (
                            <div
                              key={schedule.id}
                              className={`rounded-lg border-l-4 p-3 ${colors.bg} ${colors.border}`}
                            >
                              <div className={`${colors.badge} mb-2 inline-block rounded px-2 py-1 text-xs font-bold`}>
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                              <h4 className={`${colors.text}`}>
                                {schedule.courseName}
                              </h4>
                              {schedule.instructor && (
                                <p className="mt-1 text-xs text-ink-muted">
                                  {schedule.instructor}
                                </p>
                              )}
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
              <div className="card border-2 border-brand bg-brand-soft p-6 sm:p-8 reveal">
                <h3>Ready to Start Learning?</h3>
                <p className="mx-auto mt-4 max-w-2xl text-ink-muted">
                  Choose a class that fits your schedule and begin your journey to mastering new digital skills.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
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

/**
 * One class, in one block for every screen width.
 *
 * On a phone the time badge sits above the course name and the link drops to
 * the bottom; from `sm` up the badge moves beside the name and the link moves
 * to the right. Nothing is duplicated and nothing scrolls sideways — a wide
 * row becomes a stacked card rather than a table you have to drag.
 */
function ClassRow({ schedule }: { schedule: Schedule }) {
  const colors = colorClasses[schedule.color] || colorClasses['toko-green'];

  return (
    <div className={`rounded-lg border-l-4 p-4 transition-shadow hover:shadow-md ${colors.border} ${colors.bg}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
          <div className={`${colors.badge} w-fit shrink-0 rounded px-3 py-1 text-sm font-bold`}>
            {schedule.startTime} - {schedule.endTime}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`${colors.text}`}>{schedule.courseName}</h3>
            {schedule.instructor && (
              <p className="mt-1 text-sm font-medium text-ink-muted">{schedule.instructor}</p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-subtle">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {schedule.location}
              </span>
              <span aria-hidden>•</span>
              <span>{schedule.mode}</span>
            </div>
          </div>
        </div>

        <Link
          href={`/courses/${schedule.courseCode.toLowerCase()}`}
          className="link-hover inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap text-sm font-semibold text-toko-blue-dark dark:text-toko-blue-light"
        >
          View Course →
        </Link>
      </div>
    </div>
  );
}
