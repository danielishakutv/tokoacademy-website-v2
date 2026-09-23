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
    <section className="section-padding bg-surface">
      <div className="section-container">
        <div className="mb-10 max-w-3xl md:mb-12 reveal">
          <p className="eyebrow">Built With Trust</p>
          <h2 className="mt-3">Trusted by 35+ Partner Institutions</h2>
          <p className="prose-measure mt-4 text-ink-muted md:text-lg">
            Toko Academy partners with government agencies, academic institutions, international networks, and community organisations to deliver measurable digital skills outcomes.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {displayPartners.map((partner) => (
            /*
              The tile stays white in both themes. These are other people's
              logos — most are dark artwork on a transparent background, and a
              dark tile would swallow half of them. A white card under a logo
              is what every organisation's own brand guidelines ask for anyway.
            */
            <div
              key={partner.id}
              className="flex items-center justify-center rounded-xl border border-line bg-white p-4 transition-all duration-300 hover:border-brand/30 hover:shadow-md md:p-6"
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
              className="link-hover inline-flex min-h-[44px] items-center gap-2 font-semibold text-brand md:text-lg"
            >
              See All {partners.length} Partners →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
