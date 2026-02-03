// Course Fetching Utilities
import { Course } from '@/data/courses';
import { getCachedCoursesList } from './courseCache';

// API Configuration
const API_BASE = 'https://app.tokoacademy.org/register';

/**
 * Fetches the list of all courses from the API
 * Uses global caching to improve performance
 */
export async function fetchCoursesFromApi(): Promise<Course[]> {
  return getCachedCoursesList(async () => {
    const response = await fetch(`${API_BASE}/courses.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.ok || !Array.isArray(data.courses)) {
      throw new Error('Invalid API response format');
    }

    // Map API response to Course type
    return data.courses.map((course: any) => {
      // Create URL-friendly slug from course code
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
        price: course.course_price ? parseFloat(course.course_price) : 0,
        image: course.course_image || '/images/courses/default.jpg',
        features: course.course_features 
          ? (typeof course.course_features === 'string' 
              ? JSON.parse(course.course_features) 
              : course.course_features)
          : [],
        syllabus: course.course_syllabus
          ? (typeof course.course_syllabus === 'string'
              ? JSON.parse(course.course_syllabus)
              : course.course_syllabus)
          : [],
      };
    });
  });
}

/**
 * Fetches all courses and returns them
 */
export async function getAllCourses(): Promise<Course[]> {
  return fetchCoursesFromApi();
}

/**
 * Fetches a single course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  const courses = await getAllCourses();
  return courses.find(course => course.id === id) || null;
}
