'use client';

import { useState, useEffect } from 'react';
import { testimonials } from '@/data/testimonials';

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-toko-gray-900 mb-4">Success Stories</h2>
          <p className="text-xl text-toko-gray-600 max-w-3xl mx-auto">
            Hear from our alumni who have transformed their careers with Toko Academy
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          {mounted && testimonials[activeIndex] && (
            <>
              <div className="card p-8 md:p-12 bg-gradient-to-br from-toko-green/5 to-toko-blue/5">
                <div className="text-6xl text-toko-green mb-6">&quot;</div>
                <p className="text-xl md:text-2xl text-toko-gray-700 mb-6 leading-relaxed">
                  {testimonials[activeIndex].content}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-toko-green to-toko-blue flex items-center justify-center text-white text-2xl font-bold">
                    {testimonials[activeIndex].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-toko-gray-900">
                      {testimonials[activeIndex].name}
                    </div>
                    <div className="text-toko-gray-600">
                      {testimonials[activeIndex].role}
                    </div>
                    {testimonials[activeIndex].course && (
                      <div className="text-sm text-toko-green font-medium mt-1">
                        {testimonials[activeIndex].course}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-toko-green/50 ${
                      index === activeIndex
                        ? 'w-12 h-3 bg-toko-green'
                        : 'w-3 h-3 bg-toko-gray-300 hover:bg-toko-gray-400'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((testimonial) => (
            <div 
              key={testimonial.id}
              className="card p-6 hover:shadow-toko-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-toko-green to-toko-blue flex items-center justify-center text-white text-lg font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-toko-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-toko-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
              <p className="text-toko-gray-600 mb-3">
                {testimonial.content}
              </p>
              {testimonial.course && (
                <div className="text-xs text-toko-green font-medium">
                  {testimonial.course}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
