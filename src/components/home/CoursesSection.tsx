import Link from 'next/link';
import { courses } from '@/data/courses';
import CourseThumbnail from '@/components/CourseThumbnail';

export default function CoursesSection() {
  return (
    <section id="courses" className="section-padding bg-toko-gray-50">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-toko-gray-900 mb-4">Our Courses</h2>
          <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
            Industry-relevant programs designed to equip you with in-demand digital skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="card p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-4">
                <CourseThumbnail id={course.id} title={course.title} duration={course.duration} courseId={course.id} />
              </div>
              <h3 className="text-2xl font-bold text-toko-gray-900 mb-3">
                {course.title}
              </h3>
              <p className="text-toko-gray-600 mb-4">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-toko-green/10 text-toko-green text-sm font-medium rounded">
                  {course.duration}
                </span>
                <span className="px-3 py-1 bg-toko-blue/10 text-toko-blue text-sm font-medium rounded">
                  {course.level}
                </span>
              </div>
              <Link 
                href={`/courses/${course.id}`}
                className="text-toko-green font-semibold hover:text-toko-green-dark transition-colors inline-flex items-center gap-2"
              >
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/courses" className="btn-primary">
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
