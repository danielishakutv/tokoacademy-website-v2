export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  course?: string;
  image?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Chioma Okafor',
    role: 'Data Analyst',
    content: 'Toko Academy transformed my career! The Data Analysis course was practical and industry-relevant. Within 3 months of completing the program, I landed my dream job.',
    course: 'Data Analysis & Visualization'
  },
  {
    id: '2',
    name: 'Emmanuel Adeyemi',
    role: 'Web Developer',
    content: 'The hands-on approach at Toko Academy made all the difference. I built real projects and learned from experienced instructors who truly care about student success.',
    course: 'Website Development'
  },
  {
    id: '3',
    name: 'Fatima Ibrahim',
    role: 'Digital Marketer',
    content: 'As a small business owner, the Digital Marketing course helped me grow my online presence exponentially. The ROI has been incredible!',
    course: 'Digital Marketing'
  },
  {
    id: '4',
    name: 'David Eze',
    role: 'UI/UX Designer',
    content: 'The UI/UX Design course at Toko Academy gave me the skills and confidence to freelance successfully. The instructors are industry professionals who share real-world insights.',
    course: 'UI/UX Design'
  },
  {
    id: '5',
    name: 'Mrs. Adebayo',
    role: 'Parent',
    content: 'My 10-year-old son loves the Weekend Coding Classes! He\'s learning valuable skills while having fun. The instructors are patient and engaging.',
    course: 'Kids Weekend Coding'
  },
  {
    id: '6',
    name: 'Oluwaseun Balogun',
    role: 'Python Developer',
    content: 'From zero programming knowledge to building my own applications - Toko Academy made it possible. The Python course is comprehensive and well-structured.',
    course: 'Python Programming'
  }
];

export interface Statistic {
  value: string;
  label: string;
}

export const statistics: Statistic[] = [
  {
    value: '1,500+',
    label: 'Learners Trained'
  },
  {
    value: '15+',
    label: 'Industry-Relevant Courses'
  },
  {
    value: '95%',
    label: 'Success Rate'
  },
  {
    value: '15+',
    label: 'Corporate Partners'
  }
];
