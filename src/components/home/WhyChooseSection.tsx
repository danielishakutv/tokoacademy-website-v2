'use client';

import dynamic from 'next/dynamic';
import { statistics } from '@/data/testimonials';

const Icon = dynamic(() => import('@iconify/react').then((mod) => ({ default: mod.Icon })), {
  ssr: false,
  loading: () => null,
});

export default function WhyChooseSection() {
  const features = [
    {
      icon: 'material-symbols:track-changes-rounded',
      title: 'Industry-Relevant Curriculum',
      description: 'Our courses are designed with input from industry experts to ensure you learn the most current and in-demand skills.'
    },
    {
      icon: 'material-symbols:school-rounded',
      title: 'Expert Instructors',
      description: 'Learn from experienced professionals who bring real-world expertise and practical insights to every lesson.'
    },
    {
      icon: 'material-symbols:construction-rounded',
      title: 'Hands-On Learning',
      description: 'Build real projects and gain practical experience that prepares you for actual workplace challenges.'
    },
    {
      icon: 'material-symbols:schedule-rounded',
      title: 'Flexible Learning Options',
      description: 'Study at your own pace with options for online, offline, and hybrid learning formats that fit your schedule.'
    },
    {
      icon: 'material-symbols:handshake-rounded',
      title: 'Career Support',
      description: 'Get guidance on job placement, portfolio building, and networking opportunities to launch your tech career.'
    },
    {
      icon: 'material-symbols:workspace-premium-rounded',
      title: 'Certification',
      description: 'Earn recognized certificates upon completion that demonstrate your skills to potential employers.'
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-toko-gray-900 mb-4">Why Choose Toko Academy?</h2>
          <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
            Empowering individuals and organizations with digital skills to thrive in the digital age
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {statistics.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-8 lg:p-0 
                         bg-gradient-to-br from-toko-green/5 to-toko-blue/5 lg:bg-none
                         rounded-2xl lg:rounded-none
                         shadow-lg lg:shadow-none
                         border-2 border-toko-green/20 lg:border-0
                         hover:shadow-xl lg:hover:shadow-none
                         hover:scale-105 lg:hover:scale-100
                         transition-all duration-300"
            >
              <div className="text-4xl sm:text-5xl font-bold text-toko-green mb-2">
                {stat.value}
              </div>
              <div className="text-toko-gray-700 lg:text-toko-gray-600 font-medium text-base sm:text-lg lg:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg border-2 border-toko-gray-200 hover:border-toko-green 
                         hover:shadow-toko transition-all duration-300"
            >
              <Icon icon={feature.icon} className="w-12 h-12 mb-4 text-toko-green" aria-hidden />
              <h3 className="text-xl font-bold text-toko-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-toko-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
