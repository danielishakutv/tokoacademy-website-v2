'use client';

import Image from 'next/image';
import Link from 'next/link';
import { partners } from '@/data/partners';

interface PartnerLogosStripProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function PartnerLogosStrip({ limit = 12, showViewAll = true }: PartnerLogosStripProps) {
  const displayPartners = partners.slice(0, limit);

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="mb-10 max-w-3xl md:mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Built With Trust</p>
          <h2 className="mt-3 text-toko-gray-900">Trusted by 35+ Partner Institutions</h2>
          <p className="mt-4 text-base text-toko-gray-600 md:text-lg">
            Toko Academy partners with government agencies, academic institutions, international networks, and community organisations to deliver measurable digital skills outcomes.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {displayPartners.map((partner) => (
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

        {showViewAll && (
          <div className="mt-10 text-center">
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 text-base font-semibold text-toko-green transition-colors hover:text-toko-green-dark md:text-lg"
            >
              See All {partners.length} Partners →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
