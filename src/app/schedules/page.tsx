import type { Metadata } from 'next';
import SchedulesClient from './client';
import schedulesData from '@/data/schedules.json';

export const metadata: Metadata = {
  title: 'Class Schedules - View Our Course Timetable',
  description: 'Browse Toko Academy class schedules. Filter by course, view weekly or monthly timetables. Find the perfect class time for your learning journey.',
  keywords: ['class schedules', 'course timetable', 'Toko Academy schedule', 'training times', 'course calendar'],
  alternates: {
    canonical: 'https://tokoacademy.org/schedules',
  },
  openGraph: {
    title: 'Class Schedules - Toko Academy',
    description: 'Browse our class schedules and find the perfect time for your training.',
    url: 'https://tokoacademy.org/schedules',
    type: 'website',
    images: [{
      url: 'https://tokoacademy.org/images/hero/professional-courses.jpg',
      width: 1200,
      height: 630,
      alt: 'Toko Academy Class Schedules'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Class Schedules - Toko Academy',
    description: 'Browse our class schedules and find the perfect time for your training.',
    images: ['https://tokoacademy.org/images/hero/professional-courses.jpg'],
  },
};

/**
 * Names that are not a person. Several records carry "Expert Instructors"
 * where an instructor's name belongs — a placeholder that was being printed
 * on the timetable as though somebody had been assigned to teach the class.
 */
const PLACEHOLDER_INSTRUCTORS = new Set([
  'expert instructors',
  'expert instructor',
  'tba',
  'tbc',
]);

function realInstructor(name: string | undefined): string | null {
  const trimmed = (name ?? '').trim();
  if (!trimmed || PLACEHOLDER_INSTRUCTORS.has(trimmed.toLowerCase())) return null;
  return trimmed;
}

/**
 * The stored records also carry a `capacity` and an `enrolled` count that
 * nothing tracks — they drove a "spots left" badge that was invented rather
 * than counted. The page no longer shows either, and no longer sends them to
 * the browser: what a timetable needs is the time, the place and the course.
 */
export default function SchedulesPage() {
  const schedules = schedulesData.schedules.map(
    ({ capacity: _capacity, enrolled: _enrolled, instructor, ...schedule }) => ({
      ...schedule,
      instructor: realInstructor(instructor),
    })
  );

  return <SchedulesClient schedules={schedules} />;
}
