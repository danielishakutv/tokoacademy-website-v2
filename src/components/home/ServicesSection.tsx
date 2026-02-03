'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const Icon = dynamic(() => import('@iconify/react').then((mod) => ({ default: mod.Icon })), {
  ssr: false,
  loading: () => null,
});

export default function ServicesSection() {
  const services = [
    {
      title: 'Corporate Training',
      description: 'Customized training programs to upskill your workforce with the latest digital competencies.',
      icon: 'material-symbols:apartment-rounded',
      features: [
        'Tailored curriculum for your organization',
        'On-site and remote training options',
        'Performance tracking and reporting',
        'Flexible scheduling'
      ]
    },
    {
      title: 'Professional Workshops',
      description: 'Intensive workshops and seminars on emerging technologies and industry best practices.',
      icon: 'material-symbols:groups-rounded',
      features: [
        'Expert-led sessions',
        'Industry-specific content',
        'Networking opportunities',
        'Continuing education credits'
      ]
    },
    {
      title: 'IT Consultation',
      description: 'Strategic IT consulting and business support services to drive digital transformation.',
      icon: 'material-symbols:lightbulb-rounded',
      features: [
        'Technology assessment',
        'Digital strategy development',
        'Implementation support',
        'Ongoing advisory services'
      ]
    }
  ];

  return (
    <section className="section-padding bg-toko-gray-900 text-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-white mb-4">Beyond Individual Courses</h2>
          <p className="text-xl text-toko-gray-300 max-w-3xl mx-auto">
            Comprehensive training and consultation services for organizations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 
                         hover:bg-white/10 hover:border-toko-green transition-all duration-300"
            >
              <Icon icon={service.icon} className="w-14 h-14 mb-4 text-toko-green" aria-hidden />
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-toko-gray-300 mb-6">{service.description}</p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon icon="material-symbols:check-small-rounded" className="w-5 h-5 text-toko-green mt-0.5" aria-hidden />
                    <span className="text-toko-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/corporate" 
            className="inline-block px-10 py-5 bg-toko-green text-white font-bold text-lg 
                     rounded hover:bg-toko-green-dark transition-colors duration-300 
                     focus:outline-none focus:ring-4 focus:ring-toko-green/50"
          >
            Learn About Corporate Training
          </Link>
        </div>
      </div>
    </section>
  );
}
