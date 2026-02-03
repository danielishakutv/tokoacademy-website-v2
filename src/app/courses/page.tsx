import type { Metadata } from 'next';
import Link from 'next/link';
import { IconWrapper } from '@/components/IconWrapper';
import CourseThumbnail from '@/components/CourseThumbnail';
import { getCachedCoursesList } from '@/lib/courseCache';

type CourseCard = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
};

// Enable ISR: revalidate every hour (3600 seconds)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Courses - Learn In-Demand Digital Skills',
  description: 'Explore Toko Academy\'s comprehensive range of courses including Web Development, Data Analysis, AI, Digital Marketing, UI/UX Design, Python Programming, and more. Industry-relevant training for career success.',
  keywords: ['digital skills courses', 'web development training Nigeria', 'data analysis courses', 'AI training', 'digital marketing courses', 'Python programming', 'UI/UX design training'],
  alternates: {
    canonical: 'https://tokoacademy.org/courses',
  },
  openGraph: {
    title: 'Toko Academy Courses - Master Digital Skills',
    description: 'Choose from 10+ industry-relevant courses designed to help you succeed in the digital economy.',
    url: 'https://tokoacademy.org/courses',
    type: 'website',
    images: [{
      url: 'https://tokoacademy.org/images/hero/professional-courses.jpg',
      width: 1200,
      height: 630,
      alt: 'Toko Academy Courses'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toko Academy Courses - Master Digital Skills',
    description: 'Choose from 10+ industry-relevant courses designed to help you succeed in the digital economy.',
    images: ['https://tokoacademy.org/images/hero/professional-courses.jpg'],
  },
};

export default async function CoursesPage() {
  // Fetch courses from API with caching
  const coursesData = await getCachedCoursesList(async () => {
    const response = await fetch(
      'https://app.tokoacademy.org/register/courses.php',
      {
        method: 'GET',
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    return response.json();
  });

  // Map API courses to display format
  const courses: CourseCard[] = (coursesData.ok && Array.isArray(coursesData.courses) ? coursesData.courses : []).map((course: any) => {
    const courseSlug = (course.course_code || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return {
      id: courseSlug || course.course_id || '',
      title: course.course_name || '',
      description: course.course_description || '',
      category: course.course_category || 'General',
      duration: course.course_duration || 'N/A',
      level: course.course_level || 'Beginner',
    };
  });

  return (
    <>
      {/* Hero Section */}
      <section className="pt-48 md:pt-56 pb-16 md:pb-20 bg-gradient-to-br from-toko-magenta to-toko-blue text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Our Courses</h1>
            <p className="text-xl md:text-2xl text-white/95">
              Industry-relevant programs designed to equip you with in-demand digital skills 
              for career success in the modern economy.
            </p>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-lg text-toko-gray-600">
              All our courses include hands-on projects, expert instruction, and certification upon completion
            </p>
          </div>

          {/* All Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {courses.map((course: CourseCard) => (
              <div 
                key={course.id}
                id={course.id}
                className="card p-6 hover:scale-105 transition-transform duration-300 scroll-mt-32"
              >
                <Link href={`/courses/${course.id}`} className="group">
                  <div className="mb-4">
                    <CourseThumbnail id={course.id} title={course.title} duration={course.duration} courseId={course.id} />
                  </div>
                </Link>
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
                  <span className="px-3 py-1 bg-toko-magenta/10 text-toko-magenta text-sm font-medium rounded">
                    {course.category}
                  </span>
                </div>

                <div className="pt-4 border-t border-toko-gray-200">
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-toko-green font-semibold hover:text-toko-green-dark transition-colors inline-flex items-center gap-2"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Courses */}
      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Why Choose Our Courses?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <IconWrapper icon="material-symbols:school-rounded" className="w-12 h-12 text-toko-green" ariaHidden />
              </div>
              <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-toko-gray-600">
                Learn from industry professionals with real-world experience
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <IconWrapper icon="material-symbols:home-repair-service-rounded" className="w-12 h-12 text-toko-green" ariaHidden />
              </div>
              <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Practical Projects</h3>
              <p className="text-toko-gray-600">
                Build portfolio-worthy projects that showcase your skills
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <IconWrapper icon="material-symbols:schedule-rounded" className="w-12 h-12 text-toko-green" ariaHidden />
              </div>
              <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Flexible Schedule</h3>
              <p className="text-toko-gray-600">
                Learn at your pace with online and offline options
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <IconWrapper icon="material-symbols:workspace-premium-rounded" className="w-12 h-12 text-toko-green" ariaHidden />
              </div>
              <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Certification</h3>
              <p className="text-toko-gray-600">
                Earn recognized certificates upon successful completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-toko-green to-toko-blue">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-white mb-6">Ready to Start Learning?</h2>
            <p className="text-xl mb-8 text-white/95">
              Choose a course and take the first step towards mastering in-demand digital skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register/"
                className="btn-primary bg-white text-toko-green hover:bg-toko-gray-100"
              >
                Apply Now
              </Link>
              <Link href="/contact" className="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-toko-green">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
