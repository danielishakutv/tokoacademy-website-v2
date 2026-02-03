'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { externalLinks } from '@/data/config';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Professional Courses for Career Growth',
    subtitle: 'Industry-Leading Training',
    description: 'Master in-demand digital skills with our comprehensive professional courses.',
    image: '/images/hero/professional-courses.jpg',
    gradient: 'from-toko-green/90 to-toko-blue/80'
  },
  {
    id: 2,
    title: 'Practical Mentorship Approach',
    subtitle: 'Learn by Doing',
    description: 'Hands-on training with expert mentors guiding you every step of the way.',
    image: '/images/hero/practical-mentorship-approach-classes.jpg',
    gradient: 'from-toko-blue/90 to-toko-magenta/80'
  },
  {
    id: 3,
    title: 'Kids & Teens Coding Programs',
    subtitle: 'Future Innovators',
    description: 'Fun, interactive coding classes that build strong tech foundations for young learners.',
    image: '/images/hero/kids-coding.jpg',
    gradient: 'from-toko-magenta/90 to-toko-yellow/80'
  },
  {
    id: 4,
    title: 'Specialized Corporate Training',
    subtitle: 'Empower Your Workforce',
    description: 'Custom training programs for government agencies, military, and organizations.',
    image: '/images/hero/training-military-officers.jpg',
    gradient: 'from-toko-yellow/90 to-toko-green/80'
  },
  {
    id: 5,
    title: 'Leadership in Digital Education',
    subtitle: 'Trusted by Communities',
    description: 'Partnering with community leaders to drive digital transformation across Nigeria.',
    image: '/images/hero/commissioner-for-women-affairs.jpg',
    gradient: 'from-toko-green/90 to-toko-blue/80'
  },
  {
    id: 6,
    title: 'Expert-Led Sessions',
    subtitle: 'Learn From the Best',
    description: 'Our CEO and industry experts deliver cutting-edge tech training and insights.',
    image: '/images/hero/our-ceo-daniel-ishaku-speaking.jpg',
    gradient: 'from-toko-blue/90 to-toko-magenta/80'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || !mounted) return;

    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, mounted]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            mounted && index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-top"
              style={{
                backgroundImage: `url('${slide.image}')`
              }}
            />
            {/* Gradient Overlay */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-80`}
            />
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex items-center">
            <div className="section-container">
              <div className="max-w-4xl">
                <div className="animate-slide-up">
                  <p className="text-white/90 text-lg md:text-xl font-medium mb-4 uppercase tracking-wider">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-white font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-white/95 text-xl md:text-2xl mb-8 max-w-2xl">
                    {slide.description}
                  </p>
                  
                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/register/"
                      className="inline-block px-10 py-5 bg-white text-toko-green font-bold text-lg 
                               rounded hover:bg-toko-gray-100 transition-all duration-300 
                               focus:outline-none focus:ring-4 focus:ring-white/50 text-center
                               shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    >
                      Apply Now
                    </Link>
                    <Link
                      href="/#courses"
                      onClick={(e) => {
                        const el = document.getElementById('courses');
                        if (el) {
                          e.preventDefault();
                          setIsAutoPlaying(false);
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="inline-block px-10 py-5 bg-transparent text-white font-bold text-lg 
                               border-2 border-white rounded hover:bg-white hover:text-toko-green 
                               transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 text-center
                               transform hover:-translate-y-1"
                    >
                      View Courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {mounted && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 hover:bg-white/30 
                       backdrop-blur-sm rounded-full transition-all duration-300 focus:outline-none 
                       focus:ring-4 focus:ring-white/50"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 hover:bg-white/30 
                       backdrop-blur-sm rounded-full transition-all duration-300 focus:outline-none 
                       focus:ring-4 focus:ring-white/50"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  index === currentSlide
                    ? 'w-12 h-3 bg-white'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2 text-white/80 animate-bounce">
        <span className="text-sm uppercase tracking-wider">Scroll</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
