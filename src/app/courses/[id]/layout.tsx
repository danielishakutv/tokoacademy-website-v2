import type { Metadata } from 'next';

export async function generateStaticParams() {
  try {
    const response = await fetch('https://app.tokoacademy.org/register/courses.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      // Fallback to common course codes if API fails
      return [
        { id: 'daav' },  // Data Analysis & Visualization
        { id: 'ai-chat' },
        { id: 'ai-ess' },
        { id: 'ai-pr' },
        { id: 'ai-web' },
        { id: 'cyb-fu' },
        { id: 'dm-cc' },
        { id: 'kids-scr' },
        { id: 'uiux-de' },
        { id: 'wd-nc' },
        { id: 'wdc' },
      ];
    }

    const data = await response.json();

    if (!data.ok || !Array.isArray(data.courses)) {
      return [{ id: 'daav' }];
    }

    return data.courses.map((course: any) => ({
      id: course.course_code.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return fallback params
    return [
      { id: 'daav' },
      { id: 'ai-chat' },
      { id: 'ai-ess' },
      { id: 'ai-pr' },
      { id: 'ai-web' },
      { id: 'cyb-fu' },
      { id: 'dm-cc' },
      { id: 'kids-scr' },
      { id: 'uiux-de' },
      { id: 'wd-nc' },
      { id: 'wdc' },
    ];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const response = await fetch(
      `https://app.tokoacademy.org/register/get_course.php?id=${params.id}`,
      {
        next: {
          revalidate: 3600,
          tags: ['course-details'],
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }

    const data = await response.json();

    if (!data.ok || !data.courses) {
      throw new Error('Invalid response');
    }

    const course = data.courses;

    return {
      title: `${course.course_name} - Learn at Toko Academy`,
      description:
        course.course_description ||
        `Enroll in ${course.course_name} - ${course.duration_weeks} weeks of comprehensive training in ${course.category}. ${course.study_modes} modes available.`,
      openGraph: {
        title: course.course_name,
        description:
          course.course_description ||
          `Learn ${course.course_name} with our expert instructors`,
        url: `https://tokoacademy.org/courses/${params.id}`,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Course Details - Toko Academy',
      description: 'Explore our comprehensive course offerings',
    };
  }
}

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
