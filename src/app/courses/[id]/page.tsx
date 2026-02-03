import type { Metadata } from 'next';
import { getCachedCoursesList } from '@/lib/courseCache';
import CourseDetailsClient from './client';

// Allow dynamic rendering in development
export const dynamicParams = true;

/**
 * Generate static parameters for all courses
 * Required for static export mode with dynamic routes
 * Maps both original course slugs and API course codes
 */
export async function generateStaticParams() {
  try {
    // Direct API call to get all course codes
    const response = await fetch(
      'https://app.tokoacademy.org/register/courses.php',
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch courses for generateStaticParams:', response.status);
      return [];
    }

    const coursesData = await response.json();

    if (!coursesData.ok || !Array.isArray(coursesData.courses)) {
      console.warn('Invalid courses data in generateStaticParams');
      return [];
    }

    console.log(`generateStaticParams: Found ${coursesData.courses.length} courses`);

    // Map each course to its normalized ID parameter
    const apiParams = coursesData.courses
      .map((course: any) => {
        const courseCodeNormalized = (course.course_code || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
        
        if (courseCodeNormalized) {
          console.log(`  - ${course.course_code} → ${courseCodeNormalized}`);
        }
        
        return { id: courseCodeNormalized };
      })
      .filter((param: { id: string }) => param.id); // Filter out empty IDs

    // Also include the original course IDs from local data
    // This ensures backward compatibility with existing links
    const originalCourseIds = [
      'data-analysis',
      'scratch-programming',
      'web-development',
      'mobile-app',
      'graphics-design',
      'digital-marketing',
      'microsoft-packages',
      'ui-ux-design',
      'python-programming',
      'ai-automation',
    ];

    const originalParams = originalCourseIds.map(id => ({ id }));

    // Combine both sets, removing duplicates
    const allParams = [
      ...apiParams,
      ...originalParams,
    ];

    // Remove duplicates
    const uniqueParams = Array.from(
      new Map(allParams.map(param => [param.id, param])).values()
    );

    console.log(`generateStaticParams: Generated ${uniqueParams.length} unique parameters`);
    return uniqueParams;
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    // Return empty array as fallback - will allow dynamic routes on-demand
    return [];
  }
}

/**
 * Generate metadata for each course page
 */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const coursesData = await getCachedCoursesList(async () => {
      const response = await fetch('https://app.tokoacademy.org/register/courses.php', {
        method: 'GET',
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    });

    if (!coursesData.ok || !Array.isArray(coursesData.courses)) {
      return {
        title: 'Course Details - Toko Academy',
        description: 'Learn industry-relevant digital skills at Toko Academy',
      };
    }

    let course = coursesData.courses.find((c: any) => {
      const normalized = (c.course_code || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return normalized === params.id;
    });

    if (!course) {
      return {
        title: 'Course Details - Toko Academy',
        description: 'Learn industry-relevant digital skills at Toko Academy',
      };
    }

    const courseName = course.course_name || 'Course';
    const courseDesc = course.course_description || 'Learn industry-relevant digital skills at Toko Academy';

    return {
      title: `${courseName} - Toko Academy`,
      description: courseDesc,
      keywords: [courseName, 'Toko Academy', 'digital skills training', 'online course Nigeria', course.course_category],
      alternates: {
        canonical: `https://tokoacademy.org/courses/${params.id}`,
      },
      openGraph: {
        title: `${courseName} - Toko Academy`,
        description: courseDesc,
        url: `https://tokoacademy.org/courses/${params.id}`,
        type: 'website',
        images: [{
          url: 'https://tokoacademy.org/images/courses/default_course_image.webp',
          width: 1200,
          height: 630,
          alt: courseName,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${courseName} - Toko Academy`,
        description: courseDesc,
        images: ['https://tokoacademy.org/images/courses/default_course_image.webp'],
      },
    };
  } catch {
    return {
      title: 'Course Details - Toko Academy',
      description: 'Learn industry-relevant digital skills at Toko Academy',
    };
  }
}

/**
 * Course details page - Server component that renders client component
 */
export default function CourseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <CourseDetailsClient courseId={params.id} />;
}
