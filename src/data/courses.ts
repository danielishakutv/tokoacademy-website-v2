export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  level: string;
  category: string;
}

export const courses: Course[] = [
  {
    id: 'data-analysis',
    title: 'Data Analysis & Visualization',
    description: 'Master Excel, SQL, Power BI, and Python for data-driven decision making. Learn to transform raw data into actionable insights.',
    icon: 'material-symbols:analytics-rounded',
    duration: '12 weeks',
    level: 'Beginner to Advanced',
    category: 'Data Science'
  },
  {
    id: 'scratch-programming',
    title: 'Scratch Programming',
    description: 'Perfect for beginners and kids! Learn programming fundamentals through fun, interactive projects using Scratch.',
    icon: 'material-symbols:sports-esports-rounded',
    duration: '8 weeks',
    level: 'Beginner',
    category: 'Programming'
  },
  {
    id: 'web-development',
    title: 'Website Development',
    description: 'Build modern, responsive websites with HTML, CSS, JavaScript, and popular frameworks like React and Next.js.',
    icon: 'material-symbols:laptop-mac-rounded',
    duration: '16 weeks',
    level: 'Beginner to Advanced',
    category: 'Development'
  },
  {
    id: 'mobile-app',
    title: 'Mobile App Development',
    description: 'Create powerful mobile applications for iOS and Android using React Native and modern development tools.',
    icon: 'material-symbols:smartphone-rounded',
    duration: '14 weeks',
    level: 'Intermediate',
    category: 'Development'
  },
  {
    id: 'graphics-design',
    title: 'Graphics Design',
    description: 'Master visual communication with Adobe Creative Suite, Figma, and Canva. Create stunning graphics for print and digital media.',
    icon: 'material-symbols:palette-rounded',
    duration: '10 weeks',
    level: 'Beginner to Advanced',
    category: 'Design'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing & Content Creation',
    description: 'Learn SEO, social media marketing, content strategy, and digital advertising to grow your online presence.',
    icon: 'material-symbols:campaign-rounded',
    duration: '12 weeks',
    level: 'Beginner to Advanced',
    category: 'Marketing'
  },
  {
    id: 'microsoft-packages',
    title: 'Microsoft Packages',
    description: 'Become proficient in Word, Excel, PowerPoint, Outlook, and other Microsoft Office applications for professional productivity.',
    icon: 'material-symbols:description-rounded',
    duration: '6 weeks',
    level: 'Beginner to Advanced',
    category: 'Productivity'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Design beautiful, user-friendly interfaces and experiences. Learn wireframing, prototyping, and user research.',
    icon: 'material-symbols:design-services-rounded',
    duration: '12 weeks',
    level: 'Beginner to Intermediate',
    category: 'Design'
  },
  {
    id: 'python-programming',
    title: 'Python Programming',
    description: 'Learn one of the most versatile programming languages for web development, automation, data science, and AI.',
    icon: 'material-symbols:code-rounded',
    duration: '14 weeks',
    level: 'Beginner to Advanced',
    category: 'Programming'
  },
  {
    id: 'ai-automation',
    title: 'AI Essentials & Automation',
    description: 'Explore artificial intelligence, machine learning basics, and automation tools to enhance productivity and innovation.',
    icon: 'material-symbols:smart-toy-rounded',
    duration: '10 weeks',
    level: 'Intermediate to Advanced',
    category: 'AI & Automation'
  }
];

export const kidsCourses = [
  {
    id: 'weekend-coding',
    title: 'Kids Weekend Coding Classes',
    description: 'Fun, interactive coding classes for children ages 6-16. Learn programming through games, animations, and creative projects.',
    ageRange: '6-16 years',
    schedule: 'Saturdays & Sundays',
    features: [
      'Scratch Programming',
      'Block-based Coding',
      'Game Development',
      'Creative Projects',
      'Small Class Sizes',
      'Experienced Instructors'
    ]
  },
  {
    id: 'cbt-program',
    title: 'Computer Based Training (CBT)',
    description: 'Comprehensive computer literacy program for ages 8-18. Develop practical IT skills and prepare for computer-based examinations.',
    ageRange: '8-18 years',
    schedule: 'Flexible weekday & weekend options',
    features: [
      'Computer Fundamentals',
      'Microsoft Office Suite',
      'Internet & Email',
      'Typing Skills',
      'CBT Exam Preparation',
      'Digital Literacy'
    ]
  }
];
