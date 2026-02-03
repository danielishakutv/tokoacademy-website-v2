import type { Metadata } from 'next';
import Link from 'next/link';
import { IconWrapper } from '@/components/IconWrapper';
import { externalLinks } from '@/data/config';

export const metadata: Metadata = {
  title: 'Corporate Training - Upskill Your Workforce',
  description: 'Customized corporate training programs and IT consultation services. Empower your organization with cutting-edge digital skills training. On-site and remote options available.',
  openGraph: {
    title: 'Corporate Training & IT Consultation - Toko Academy',
    description: 'Transform your workforce with tailored digital skills training and strategic IT consulting.',
    url: 'https://tokoacademy.org/corporate',
  },
};

export default function CorporatePage() {
  const services = [
    {
      title: 'Corporate Training Programs',
      description: 'Customized training solutions designed specifically for your organization\'s needs and goals.',
      icon: 'material-symbols:apartment-rounded',
      features: [
        'Tailored curriculum aligned with business objectives',
        'On-site and remote delivery options',
        'Flexible scheduling to minimize disruption',
        'Progress tracking and performance analytics',
        'Post-training support and resources',
        'Certification for all participants'
      ]
    },
    {
      title: 'Professional Workshops & Seminars',
      description: 'Intensive, focused sessions on specific technologies and industry best practices.',
      icon: 'material-symbols:groups-rounded',
      features: [
        'Expert-led interactive sessions',
        'Latest industry trends and tools',
        'Hands-on practical exercises',
        'Networking opportunities',
        'Continuing education credits',
        'Custom topic selection'
      ]
    },
    {
      title: 'IT Consultation & Strategy',
      description: 'Strategic guidance to drive your organization\'s digital transformation initiatives.',
      icon: 'material-symbols:lightbulb-rounded',
      features: [
        'Technology needs assessment',
        'Digital transformation roadmaps',
        'Implementation planning and support',
        'Change management strategies',
        'Ongoing advisory services',
        'ROI analysis and optimization'
      ]
    }
  ];

  const trainingAreas = [
    { name: 'Web & Mobile Development', icon: 'material-symbols:laptop-mac-rounded' },
    { name: 'Data Analysis & Business Intelligence', icon: 'material-symbols:analytics-rounded' },
    { name: 'Cybersecurity Fundamentals', icon: 'material-symbols:shield-rounded' },
    { name: 'Cloud Computing & Infrastructure', icon: 'material-symbols:cloud-queue-rounded' },
    { name: 'Digital Marketing & Social Media', icon: 'material-symbols:smartphone-rounded' },
    { name: 'AI & Machine Learning Basics', icon: 'material-symbols:smart-toy-rounded' },
    { name: 'Project Management & Agile', icon: 'material-symbols:assignment-turned-in-rounded' },
    { name: 'UI/UX Design Principles', icon: 'material-symbols:design-services-rounded' }
  ];

  const benefits = [
    {
      icon: 'material-symbols:trending-up-rounded',
      title: 'Increased Productivity',
      description: 'Empower your team with skills that translate directly to improved performance and efficiency.'
    },
    {
      icon: 'material-symbols:workspace-premium-rounded',
      title: 'Competitive Advantage',
      description: 'Stay ahead of the curve with a workforce equipped with cutting-edge digital skills.'
    },
    {
      icon: 'material-symbols:savings-rounded',
      title: 'Reduced Hiring Costs',
      description: 'Upskill existing employees rather than constantly recruiting for new talent.'
    },
    {
      icon: 'material-symbols:groups-rounded',
      title: 'Employee Retention',
      description: 'Invest in your team\'s growth and see improved satisfaction and loyalty.'
    },
    {
      icon: 'material-symbols:change-circle-rounded',
      title: 'Digital Transformation',
      description: 'Successfully navigate digital initiatives with a tech-savvy workforce.'
    },
    {
      icon: 'material-symbols:insights-rounded',
      title: 'Measurable Results',
      description: 'Track progress with comprehensive analytics and performance metrics.'
    }
  ];

  const clients = [
    'Financial Services',
    'Healthcare',
    'Education',
    'Government Agencies',
    'Tech Startups',
    'Manufacturing',
    'Retail & E-commerce',
    'NGOs & Non-profits'
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-48 md:pt-56 pb-16 md:pb-20 bg-gradient-to-br from-toko-blue to-toko-green text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Corporate Training & Consultation</h1>
            <p className="text-xl md:text-2xl text-white/95">
              Empower Your Organization with Customized Digital Skills Training and Strategic IT Consulting
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions to drive your organization&apos;s digital transformation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="card p-8 hover:shadow-toko-lg transition-shadow duration-300"
              >
                <IconWrapper icon={service.icon} className="w-14 h-14 mb-4 text-toko-green" ariaHidden />
                <h3 className="text-2xl font-bold text-toko-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-toko-gray-600 mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <IconWrapper icon="material-symbols:check-small-rounded" className="w-5 h-5 text-toko-green mt-0.5" ariaHidden />
                      <span className="text-toko-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Areas */}
      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Training Areas</h2>
            <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
              We offer expertise across a wide range of technology domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainingAreas.map((area, index) => (
              <div 
                key={index}
                className="card p-6 text-center hover:shadow-toko-lg transition-shadow duration-300"
              >
                <IconWrapper icon={area.icon} className="w-12 h-12 mb-3 text-toko-green" ariaHidden />
                <h3 className="font-bold text-toko-gray-900">
                  {area.name}
                </h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-toko-gray-600">
              Don&apos;t see what you need? We can create custom training programs for any technology area.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Benefits of Corporate Training</h2>
            <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
              Why organizations choose Toko Academy for their training needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex gap-4"
              >
                <IconWrapper icon={benefit.icon} className="w-12 h-12 text-toko-green" ariaHidden />
                <div>
                  <h3 className="text-xl font-bold text-toko-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-toko-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
              Our streamlined process for delivering effective corporate training
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-4 items-start p-6 bg-white rounded-lg shadow-toko">
              <div className="flex-shrink-0 w-12 h-12 bg-toko-green text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Consultation & Needs Assessment</h3>
                <p className="text-toko-gray-600">
                  We meet with your team to understand your goals, challenges, and specific training requirements.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-white rounded-lg shadow-toko">
              <div className="flex-shrink-0 w-12 h-12 bg-toko-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Custom Curriculum Design</h3>
                <p className="text-toko-gray-600">
                  Our experts design a tailored training program aligned with your business objectives and timeline.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-white rounded-lg shadow-toko">
              <div className="flex-shrink-0 w-12 h-12 bg-toko-magenta text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Training Delivery</h3>
                <p className="text-toko-gray-600">
                  Expert instructors deliver engaging, hands-on training through your preferred format (on-site or remote).
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-white rounded-lg shadow-toko">
              <div className="flex-shrink-0 w-12 h-12 bg-toko-yellow text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-toko-gray-900 mb-2">Assessment & Follow-up</h3>
                <p className="text-toko-gray-600">
                  Track progress with assessments, receive detailed reports, and access ongoing support resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-toko-gray-900 mb-4">Industries We Serve</h2>
            <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
              Trusted by organizations across diverse sectors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {clients.map((client, index) => (
              <div 
                key={index}
                className="p-4 text-center bg-toko-gray-50 rounded-lg font-semibold text-toko-gray-700"
              >
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-toko-blue to-toko-green">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-white mb-6">Ready to Transform Your Workforce?</h2>
            <p className="text-xl mb-8 text-white/95">
              Contact us today to discuss how we can help your organization achieve its digital transformation goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="btn-primary bg-white text-toko-green hover:bg-toko-gray-100"
              >
                Request Consultation
              </Link>
              <a
                href="tel:+2348088256055"
                className="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-toko-green"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
