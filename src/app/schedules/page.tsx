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

export default function SchedulesPage() {
  return <SchedulesClient schedules={schedulesData.schedules} />;
}
