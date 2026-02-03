import type { Metadata } from 'next';
import Link from 'next/link';
import { IconWrapper } from '@/components/IconWrapper';
import { externalLinks } from '@/data/config';

export const metadata: Metadata = {
  title: 'About Us - Empowering Digital Skills Education',
  description: 'Learn about Toko Academy\'s mission to empower individuals and organizations with industry-relevant digital skills. Meet our expert team and discover our vision for digital education in Africa.',
  keywords: ['about Toko Academy', 'digital skills training Nigeria', 'tech education Africa', 'mission and vision', 'educational values', 'skilled educators'],
  alternates: {
    canonical: 'https://tokoacademy.org/about',
  },
  openGraph: {
    title: 'About Toko Academy - Empowering Digital Skills Education',
    description: 'Discover our mission, vision, and the expert team behind Toko Academy\'s success in digital skills training.',
    url: 'https://tokoacademy.org/about',
    type: 'website',
    images: [{
      url: 'https://tokoacademy.org/images/hero/our-ceo-daniel-ishaku-speaking.jpg',
      width: 1200,
      height: 630,
      alt: 'About Toko Academy'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Toko Academy - Empowering Digital Skills Education',
    description: 'Discover our mission, vision, and the expert team behind Toko Academy\'s success.',
    images: ['https://tokoacademy.org/images/hero/our-ceo-daniel-ishaku-speaking.jpg'],
  },
};

export default function AboutPage() {
  const team = [
    {
      name: 'Leadership Team',
      role: 'Experienced Educators & Industry Professionals',
      description: 'Our leadership brings decades of combined experience in technology, education, and business development.'
    }
  ];

  const values = [
    {
      icon: 'material-symbols:workspace-premium-rounded',
      title: 'Excellence',
      description: 'We are committed to delivering the highest quality education and training programs.'
    },
    {
      icon: 'material-symbols:lightbulb-rounded',
      title: 'Innovation',
      description: 'We continuously update our curriculum to reflect the latest industry trends and technologies.'
    },
    {
      icon: 'material-symbols:verified-rounded',
      title: 'Integrity',
      description: 'We operate with transparency, honesty, and ethical standards in all our dealings.'
    },
    {
      icon: 'material-symbols:auto-awesome-rounded',
      title: 'Empowerment',
      description: 'We believe in empowering our students with practical skills for real-world success.'
    },
    {
      icon: 'material-symbols:public-rounded',
      title: 'Accessibility',
      description: 'We make quality tech education accessible to everyone, regardless of background.'
    },
    {
      icon: 'material-symbols:trending-up-rounded',
      title: 'Growth',
      description: 'We foster continuous learning and personal development in our students and team.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-48 md:pt-56 pb-16 md:pb-20 bg-gradient-to-br from-toko-green to-toko-blue text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">About Toko Academy</h1>
            <p className="text-xl md:text-2xl text-white/95">
              Empowering individuals and organizations with industry-relevant digital skills to thrive in the digital age.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="card p-8 border-l-4 border-toko-green">
              <IconWrapper icon="material-symbols:track-changes-rounded" className="w-12 h-12 mb-4 text-toko-green" ariaHidden />
              <h2 className="text-3xl font-bold text-toko-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-toko-gray-600 leading-relaxed">
                To provide accessible, industry-relevant digital skills training that empowers individuals 
                and organizations to succeed in the rapidly evolving digital economy. We are committed to 
                bridging the digital skills gap in Africa by offering practical, hands-on education that 
                prepares our students for real-world challenges.
              </p>
            </div>

            <div className="card p-8 border-l-4 border-toko-blue">
              <IconWrapper icon="material-symbols:travel-explore-rounded" className="w-12 h-12 mb-4 text-toko-blue" ariaHidden />
              <h2 className="text-3xl font-bold text-toko-gray-900 mb-4">Our Vision</h2>
              <p className="text-lg text-toko-gray-600 leading-relaxed">
                To be Africa&apos;s leading digital skills training academy, recognized for excellence in 
                education, innovation in curriculum development, and transformative impact on individuals 
                and communities. We envision a future where everyone has the opportunity to participate 
                meaningfully in the digital economy.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-toko-gray-900 mb-6 text-center">Our Story</h2>
            <div className="text-lg text-toko-gray-600 space-y-4 leading-relaxed">
              <p>
                Toko Academy was founded with a simple yet powerful vision: to make quality digital skills 
                education accessible to everyone. We recognized a growing gap between the skills employers 
                need and the skills job seekers possess, particularly in the technology sector.
              </p>
              <p>
                Since our inception, we have trained over 2,000 students from diverse backgrounds, helping 
                them launch successful careers in technology, digital marketing, data analysis, and more. 
                Our programs combine theoretical knowledge with practical, hands-on experience, ensuring 
                our graduates are job-ready from day one.
              </p>
              <p>
                What sets us apart is our commitment to staying current with industry trends, our 
                experienced instructors who bring real-world expertise, and our focus on creating a 
                supportive learning environment where every student can thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at Toko Academy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="card p-6 hover:shadow-toko-lg transition-shadow duration-300"
              >
                <IconWrapper icon={value.icon} className="w-12 h-12 mb-4 text-toko-green" ariaHidden />
                <h3 className="text-xl font-bold text-toko-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-toko-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">What We Offer</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <IconWrapper icon="material-symbols:library-books-rounded" className="w-10 h-10 text-toko-green" ariaHidden />
              <div>
                <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Comprehensive Courses</h3>
                <p className="text-toko-gray-600">
                  From web development to data analysis, our courses cover the most in-demand digital skills.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconWrapper icon="material-symbols:school-rounded" className="w-10 h-10 text-toko-green" ariaHidden />
              <div>
                <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Expert Instructors</h3>
                <p className="text-toko-gray-600">
                  Learn from industry professionals with years of practical experience.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconWrapper icon="material-symbols:handyman-rounded" className="w-10 h-10 text-toko-green" ariaHidden />
              <div>
                <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Hands-On Projects</h3>
                <p className="text-toko-gray-600">
                  Build real-world projects that demonstrate your skills to potential employers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconWrapper icon="material-symbols:workspace-premium-rounded" className="w-10 h-10 text-toko-green" ariaHidden />
              <div>
                <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Certification</h3>
                <p className="text-toko-gray-600">
                  Earn recognized certificates that validate your new skills and knowledge.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconWrapper icon="material-symbols:handshake-rounded" className="w-10 h-10 text-toko-green" ariaHidden />
              <div>
                <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Career Support</h3>
                <p className="text-toko-gray-600">
                  Get guidance on job placement, interviews, and building your professional network.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconWrapper icon="material-symbols:apartment-rounded" className="w-10 h-10 text-toko-green" ariaHidden />
              <div>
                <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Corporate Training</h3>
                <p className="text-toko-gray-600">
                  Customized programs to upskill your workforce and drive digital transformation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-toko-green to-toko-blue">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-white mb-6">Join the Toko Academy Community</h2>
            <p className="text-xl mb-8 text-white/95">
              Be part of a growing community of learners transforming their careers through digital skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register/"
                className="btn-primary bg-white text-toko-green hover:bg-toko-gray-100"
              >
                Apply Now
              </Link>
              <Link href="/courses" className="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-toko-green">
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
