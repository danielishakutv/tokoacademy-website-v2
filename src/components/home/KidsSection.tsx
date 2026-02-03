'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { kidsCourses } from '@/data/courses';

const Icon = dynamic(() => import('@iconify/react').then((mod) => ({ default: mod.Icon })), {
  ssr: false,
  loading: () => null,
});

export default function KidsSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-toko-blue/10 to-toko-magenta/10">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-toko-gray-900 mb-4">Kids & Teens Programs</h2>
          <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
            Fun, interactive programs that build foundational tech skills for young learners
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {kidsCourses.map((course) => (
            <div 
              key={course.id}
              className="card p-8 bg-white"
            >
              <h3 className="text-2xl font-bold text-toko-gray-900 mb-3">
                {course.title}
              </h3>
              <p className="text-toko-gray-600 mb-6">
                {course.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-toko-gray-500 mb-1">Age Range</div>
                  <div className="font-semibold text-toko-green">{course.ageRange}</div>
                </div>
                <div>
                  <div className="text-sm text-toko-gray-500 mb-1">Schedule</div>
                  <div className="font-semibold text-toko-blue">{course.schedule}</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-semibold text-toko-gray-700 mb-3">What They&apos;ll Learn:</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-toko-gray-600">
                      <Icon icon="material-symbols:check-small-rounded" className="w-5 h-5 text-toko-green mt-0.5" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href="/kids"
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
          <Link href="/kids" className="btn-primary">
            Explore Kids Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
