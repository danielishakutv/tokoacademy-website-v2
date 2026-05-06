'use client';

import Image from 'next/image';
import { partners, partnersByCategory, partnerCategoryDescriptions } from '@/data/partners';

export default function PartnerLogosWall() {
  const categoryOrder: Array<keyof typeof partnersByCategory> = [
    'Federal Government & Regulatory Agencies',
    'Academic Partners',
    'International & Public Diplomacy Partners',
    'INGO & Civil Society Partners',
    'Educational Institutions',
    'Faith-Based & Community Partners',
  ];

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="mb-10 max-w-3xl md:mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Our Partners</p>
          <h2 className="mt-3 text-toko-gray-900">Trusted by Institutional Networks</h2>
          <p className="mt-4 text-base text-toko-gray-600 md:text-lg">
            Toko Academy partners with federal agencies, academic institutions, international networks, and community organisations to deliver measurable digital skills outcomes across Nigeria. Below is the institutional network that has formally engaged us.
          </p>
        </div>

        <div className="space-y-12">
          {categoryOrder.map((category) => {
            const categoryPartners = partnersByCategory[category] || [];
            if (categoryPartners.length === 0) return null;

            return (
              <div key={category}>
                {/* Category Label */}
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-toko-gray-500">
                  {category}
                </p>

                {/* Logo Grid */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
                  {categoryPartners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center justify-center rounded-xl border border-toko-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md hover:border-toko-green/30 md:p-6"
                    >
                      <div className="relative h-16 w-full md:h-20">
                        <Image
                          src={partner.logo}
                          alt={partner.logoAlt}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100px, 150px"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category Description */}
                <p className="mb-8 text-xs italic text-toko-gray-500 md:mb-10">
                  {partnerCategoryDescriptions[category]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
