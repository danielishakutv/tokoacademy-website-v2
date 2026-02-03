import type { Metadata } from 'next';
import Link from 'next/link';
import { IconWrapper } from '@/components/IconWrapper';
import { kidsCourses } from '@/data/courses';
import { externalLinks } from '@/data/config';

export const metadata: Metadata = {
  title: 'Kids & Teens Programs - Coding & Computer Training for Young Learners',
  description: 'Fun, interactive coding classes and CBT programs for children ages 6-18. Weekend coding classes, Scratch programming, and computer literacy training. Build tech skills early!',
  openGraph: {
    title: 'Kids & Teens Tech Programs - Toko Academy',
    description: 'Engaging coding and computer training programs designed specifically for young learners ages 6-18.',
    url: 'https://tokoacademy.org/kids',
  },
};

export default function KidsPage() {
  const benefits = [
    {
      icon: 'material-symbols:sports-esports-rounded',
      title: 'Fun & Engaging',
      description: 'Learning through games, animations, and creative projects that keep kids excited about technology.'
    },
    {
      icon: 'material-symbols:psychology-rounded',
      title: 'Critical Thinking',
      description: 'Develop problem-solving skills and logical reasoning through coding challenges.'
    },
    {
      icon: 'material-symbols:palette-rounded',
      title: 'Creativity',
      description: 'Express creativity by building games, animations, and interactive stories.'
    },
    {
      icon: 'material-symbols:groups-rounded',
      title: 'Small Classes',
      description: 'Personal attention with small class sizes for effective learning.'
    },
    {
      icon: 'material-symbols:trending-up-rounded',
      title: 'Progressive Learning',
      description: 'Age-appropriate curriculum that grows with your child\'s abilities.'
    },
    {
      icon: 'material-symbols:emoji-events-rounded',
      title: 'Build Confidence',
      description: 'Gain confidence through completing projects and achieving milestones.'
    }
  ];

  const faqs = [
    {
      question: 'Is prior computer experience required?',
      answer: 'No prior experience is necessary! Our programs are designed for complete beginners and progressively build skills.'
    },
    {
      question: 'What equipment does my child need?',
      answer: 'For online classes, a computer/laptop with internet connection. For in-person classes, we provide all necessary equipment.'
    },
    {
      question: 'How are classes structured?',
      answer: 'Classes are interactive and hands-on, with a mix of instruction, guided practice, and independent projects.'
    },
    {
      question: 'Will my child receive a certificate?',
      answer: 'Yes! Students receive certificates upon successful completion of each program level.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-48 md:pt-56 pb-16 md:pb-20 bg-gradient-to-br from-toko-magenta to-toko-yellow text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Kids & Teens Programs</h1>
            <p className="text-xl md:text-2xl text-white/95">
              Fun, Interactive, Skill-Building Programs for Young Learners Ages 6-18
            </p>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Our Programs</h2>
            <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
              Specially designed courses to introduce young minds to the world of technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {kidsCourses.map((course) => (
              <div 
                key={course.id}
                className="card p-8 bg-gradient-to-br from-white to-toko-gray-50"
              >
                <h3 className="text-3xl font-bold text-toko-gray-900 mb-4">
                  {course.title}
                </h3>
                <p className="text-lg text-toko-gray-600 mb-6">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white rounded-lg">
                  <div>
                    <div className="text-sm text-toko-gray-500 mb-1">Age Range</div>
                    <div className="font-bold text-toko-green text-lg">{course.ageRange}</div>
                  </div>
                  <div>
                    <div className="text-sm text-toko-gray-500 mb-1">Schedule</div>
                    <div className="font-bold text-toko-blue text-lg">{course.schedule}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="font-semibold text-toko-gray-900 mb-3 text-lg">What They&apos;ll Learn:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <IconWrapper icon="material-symbols:check-small-rounded" className="w-5 h-5 text-toko-green mt-0.5" ariaHidden />
                        <span className="text-toko-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/register/"
                  className="btn-primary w-full text-center"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Why Enroll Your Child?</h2>
            <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
              Benefits of early technology education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="card p-6 text-center hover:shadow-toko-lg transition-shadow duration-300"
              >
                <IconWrapper icon={benefit.icon} className="w-14 h-14 mb-4 text-toko-green" ariaHidden />
                <h3 className="text-xl font-bold text-toko-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-toko-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Progressive Learning Path</h2>
            <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
              Our structured approach ensures steady skill development
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4 items-start p-6 bg-toko-green/5 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-toko-green text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Foundation (Ages 6-9)</h3>
                  <p className="text-toko-gray-600">
                    Introduction to computers, basic navigation, and visual programming with Scratch. 
                    Focus on creativity and fundamental concepts.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 bg-toko-blue/5 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-toko-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Intermediate (Ages 10-13)</h3>
                  <p className="text-toko-gray-600">
                    Advanced Scratch projects, introduction to web development basics, and digital literacy. 
                    Build more complex applications and games.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 bg-toko-magenta/5 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-toko-magenta text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Advanced (Ages 14-18)</h3>
                  <p className="text-toko-gray-600">
                    Text-based programming (Python), web development, mobile apps, and preparation for 
                    professional certifications. Focus on career readiness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-bold text-toko-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-toko-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-toko-magenta to-toko-yellow">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-white mb-6">Give Your Child a Head Start in Tech</h2>
            <p className="text-xl mb-8 text-white/95">
              Enroll today and watch your child develop valuable skills while having fun!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register/"
                className="btn-primary bg-white text-toko-magenta hover:bg-toko-gray-100"
              >
                Enroll Your Child
              </Link>
              <Link href="/contact" className="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-toko-magenta">
                Ask Questions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
