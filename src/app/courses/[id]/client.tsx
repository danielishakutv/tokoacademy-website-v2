'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCachedCourseDetails, getCachedCoursesList } from '@/lib/courseCache';

interface CourseDetails {
  id: number;
  course_code: string;
  course_name: string;
  course_description: string | null;
  category: string;
  level: string;
  duration_weeks: number;
  study_modes: string;
  price: string;
  currency: string;
  target_audience: string;
  prerequisites: string;
  requirements: string;
  learning_outcomes: string;
  syllabus_json: Record<string, string>;
  instructor_name: string;
  instructor_bio: string;
  instructor_image_url: string;
}

export default function CourseDetailsClient({
  courseId,
}: {
  courseId: string;
}) {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);

        const coursesData = await getCachedCoursesList(async () => {
          const coursesResponse = await fetch(
            'https://app.tokoacademy.org/register/courses.php',
            {
              method: 'GET',
              cache: 'force-cache',
            }
          );

          if (!coursesResponse.ok) {
            throw new Error('Failed to fetch courses list');
          }

          return coursesResponse.json();
        });

        if (!coursesData.ok || !Array.isArray(coursesData.courses)) {
          throw new Error('Invalid courses response format');
        }

        // Try to find the course by:
        // 1. Matching normalized course code (e.g., 'ai-chat' from 'AI-CHAT')
        // 2. Matching original course slug (e.g., 'scratch-programming')
        let matchingCourse = coursesData.courses.find((course: any) => {
          const courseCodeNormalized = (course.course_code || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          return courseCodeNormalized === courseId;
        });

        // Fallback: check if courseId matches any known course slug
        // This handles links like /courses/scratch-programming/
        if (!matchingCourse && courseId === 'scratch-programming') {
          matchingCourse = coursesData.courses.find((c: any) => 
            (c.course_code || '').toUpperCase() === 'KIDS-SCR'
          );
        } else if (!matchingCourse && courseId === 'data-analysis') {
          matchingCourse = coursesData.courses.find((c: any) =>
            (c.course_code || '').toUpperCase() === 'DAAV'
          );
        } else if (!matchingCourse && courseId === 'web-development') {
          matchingCourse = coursesData.courses.find((c: any) =>
            (c.course_code || '').toUpperCase() === 'WD-NC'
          );
        } else if (!matchingCourse && courseId === 'ui-ux-design') {
          matchingCourse = coursesData.courses.find((c: any) =>
            (c.course_code || '').toUpperCase() === 'UIUX-DE'
          );
        } else if (!matchingCourse && courseId === 'digital-marketing') {
          matchingCourse = coursesData.courses.find((c: any) =>
            (c.course_code || '').toUpperCase() === 'DM-CC'
          );
        } else if (!matchingCourse && courseId === 'ai-automation') {
          matchingCourse = coursesData.courses.find((c: any) =>
            (c.course_code || '').toUpperCase() === 'AI-ESS'
          );
        } else if (!matchingCourse && courseId === 'python-programming') {
          // Python programming might not have a direct match
          matchingCourse = coursesData.courses.find((c: any) =>
            (c.course_name || '').toLowerCase().includes('python')
          );
        }

        if (!matchingCourse) {
          throw new Error(`Course with ID "${courseId}" not found`);
        }

        const detailsKey = String(matchingCourse.course_id || matchingCourse.id || courseId);

        const detailsData = await getCachedCourseDetails(detailsKey, async () => {
          const detailsResponse = await fetch(
            `https://app.tokoacademy.org/register/get_course.php?id=${detailsKey}`,
            {
              method: 'GET',
              cache: 'force-cache',
            }
          );

          if (!detailsResponse.ok) {
            throw new Error('Failed to fetch course details');
          }

          return detailsResponse.json();
        });

        if (detailsData.ok && detailsData.courses) {
          setCourse(detailsData.courses);
        } else {
          throw new Error('Invalid course details response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-toko-magenta to-toko-blue pt-32 pb-16">
        <div className="section-container">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-toko-magenta to-toko-blue pt-32 pb-16">
        <div className="section-container">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-toko-gray-900 mb-4">
              Course Not Found
            </h2>
            <p className="text-toko-gray-600 mb-6">
              {error || 'The course you are looking for does not exist.'}
            </p>
            <Link href="/courses" className="btn-primary">
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const syllabusItems = Array.isArray(course.syllabus_json)
    ? course.syllabus_json
    : Object.entries(course.syllabus_json).map(([week, content]) => ({
        week,
        content,
      }));

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-toko-magenta to-toko-blue text-white">
        <div className="section-container">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Courses
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-full">
                {course.category}
              </span>
              <span className="px-4 py-2 bg-toko-green text-white text-sm font-semibold rounded-full">
                {course.level}
              </span>
              <span className="px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-full">
                {course.duration_weeks} weeks
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {course.course_name}
            </h1>

            <div className="flex flex-wrap gap-6 md:gap-8">
              <div>
                <p className="text-white/70 text-sm mb-1">Course Code</p>
                <p className="text-xl font-semibold">{course.course_code}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Study Modes</p>
                <p className="text-xl font-semibold">{course.study_modes}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Price</p>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-semibold">
                    {course.currency} {(parseFloat(course.price) * 0.85).toLocaleString('en-NG', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                  </p>
                  <span className="px-2 py-1 bg-toko-green text-white text-xs font-bold rounded">
                    15% OFF
                  </span>
                </div>
                <p className="text-sm text-white/60 line-through">
                  {course.currency} {parseFloat(course.price).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Description */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-toko-gray-900 mb-4">
                  About This Course
                </h2>
                <p className="text-lg text-toko-gray-600 leading-relaxed">
                  {course.course_description || 'Learn everything you need to succeed in this field.'}
                </p>
              </div>

              {/* Target Audience */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-toko-gray-900 mb-4">
                  Who Should Enroll?
                </h2>
                <p className="text-lg text-toko-gray-600 leading-relaxed">
                  {course.target_audience}
                </p>
              </div>

              {/* Prerequisites */}
              <div className="mb-12 p-6 bg-toko-blue/5 rounded-lg border border-toko-blue/10">
                <h3 className="text-2xl font-bold text-toko-gray-900 mb-3">
                  Prerequisites
                </h3>
                <p className="text-toko-gray-600">
                  {course.prerequisites}
                </p>
              </div>

              {/* Requirements */}
              <div className="mb-12 p-6 bg-toko-green/5 rounded-lg border border-toko-green/10">
                <h3 className="text-2xl font-bold text-toko-gray-900 mb-3">
                  What You&apos;ll Need
                </h3>
                <p className="text-toko-gray-600">
                  {course.requirements}
                </p>
              </div>

              {/* Learning Outcomes */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-toko-gray-900 mb-6">
                  Learning Outcomes
                </h2>
                <p className="text-lg text-toko-gray-600 leading-relaxed mb-4">
                  By the end of this course, you will be able to:
                </p>
                <div className="space-y-3">
                  {course.learning_outcomes.split(';').map((outcome, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-toko-green text-white">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-toko-gray-600">{outcome.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syllabus */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-toko-gray-900 mb-6">
                  Course Syllabus
                </h2>
                <div className="space-y-4">
                  {Array.isArray(syllabusItems) ? (
                    syllabusItems.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 border-l-4 border-toko-green bg-toko-gray-50 rounded"
                      >
                        <h4 className="font-bold text-toko-gray-900 mb-2">
                          {typeof item === 'string'
                            ? `Week ${index + 1}`
                            : item.week || `Week ${index + 1}`}
                        </h4>
                        <p className="text-toko-gray-600">
                          {typeof item === 'string' ? item : item.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-toko-gray-500">
                      Syllabus details coming soon
                    </div>
                  )}
                </div>
              </div>

              {/* Instructor */}
              <div className="bg-toko-gray-50 p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-toko-gray-900 mb-6">
                  Your Instructor
                </h2>
                <div className="flex gap-6">
                  {course.instructor_image_url && (
                    <Image
                      src={course.instructor_image_url}
                      alt={course.instructor_name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-toko-gray-900 mb-2">
                      {course.instructor_name}
                    </h3>
                    <p className="text-toko-gray-600">
                      {course.instructor_bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 bg-toko-gray-50 rounded-lg p-8">
                <div className="mb-8">
                  <div className="mb-2">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-4xl font-bold text-toko-magenta">
                        {course.currency} {(parseFloat(course.price) * 0.85).toLocaleString('en-NG', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                      </span>
                      <span className="px-3 py-1 bg-toko-green text-white text-sm font-bold rounded-full">
                        15% OFF TODAY
                      </span>
                    </div>
                    <p className="text-toko-gray-500 text-lg line-through">
                      {course.currency} {parseFloat(course.price).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-toko-gray-600 mb-6">
                    {course.duration_weeks}-week course
                  </p>
                  <button
                    onClick={() => {
                      window.location.href = `https://tokoacademy.org/register/?course=${course.course_code}`;
                    }}
                    className="w-full btn-primary mb-4"
                  >
                    Register Now
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = `mailto:info@tokoacademy.org?subject=Inquiry about ${course.course_name}`;
                    }}
                    className="w-full px-6 py-3 bg-white border-2 border-toko-gray-200 text-toko-gray-900 font-semibold rounded-lg hover:bg-toko-gray-50 transition-colors"
                  >
                    Contact Us
                  </button>
                </div>

                <div className="space-y-4 pt-8 border-t border-toko-gray-200">
                  <div>
                    <p className="text-sm text-toko-gray-500 mb-1">Duration</p>
                    <p className="font-semibold text-toko-gray-900">
                      {course.duration_weeks} weeks
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-toko-gray-500 mb-1">Level</p>
                    <p className="font-semibold text-toko-gray-900">
                      {course.level}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-toko-gray-500 mb-1">Category</p>
                    <p className="font-semibold text-toko-gray-900">
                      {course.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-toko-gray-500 mb-1">Study Modes</p>
                    <p className="font-semibold text-toko-gray-900">
                      {course.study_modes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-toko-magenta to-toko-blue text-white">
        <div className="section-container max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students mastering {course.course_name} at Toko Academy.
            Enroll now and transform your career.
          </p>
          <button
            onClick={() => {
              window.location.href = `https://tokoacademy.org/register/?course=${course.course_code}`;
            }}
            className="inline-block px-8 py-4 bg-white text-toko-magenta font-bold rounded-lg hover:bg-toko-gray-100 transition-colors"
          >
            Enroll in This Course
          </button>
        </div>
      </section>
    </>
  );
}
