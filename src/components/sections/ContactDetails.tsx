import type { ReactNode } from 'react';
import ContactForm from '@/app/contact/ContactForm';
import { contactInfo } from '@/data/config';
import { captchaSiteKey } from '@/lib/enquiries';
import { flag, stagger, text, type SectionProps } from './fields';
import Band, { Intro, toneOf } from './tone';

/**
 * Phone numbers, email and address, as things you can press.
 *
 * The details come from `data/config` rather than from the section's fields,
 * and deliberately so: an address typed into one page is an address that goes
 * stale on that page alone, and the footer, the contact page and the
 * structured data would all disagree with it. One place, everywhere.
 *
 * Every card is a real `tel:` or `mailto:` link. Most people who reach contact
 * details on a phone want to press a number, not read a column and then hunt
 * for one.
 */
export default async function ContactDetails({ data, first = false }: SectionProps) {
  const tone = toneOf(data);
  const heading = text(data, 'heading');
  const body = text(data, 'body');
  const showForm = flag(data, 'showForm');

  // Read once at build time. No key configured means no widget and no
  // third-party script; the form still has its honeypot and the server's rate
  // limit behind it.
  const siteKey = showForm ? await captchaSiteKey() : null;

  const details = (
    <div className={`grid gap-3 ${showForm ? '' : 'sm:grid-cols-3'}`.trim()}>
      {contactInfo.phones.map((phone, index) => (
        <Detail
          key={phone}
          href={`tel:${phone.replace(/\s+/g, '')}`}
          label={index === 0 ? 'Call us' : 'Or call'}
          value={phone}
          delay={stagger(index)}
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          }
        />
      ))}

      <Detail
        href={`mailto:${contactInfo.email}`}
        label="Email us"
        value={contactInfo.email}
        delay={stagger(contactInfo.phones.length)}
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        }
      />

      <div className={`card reveal ${stagger(contactInfo.phones.length + 1)} flex gap-3 p-4`}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-ink">Visit us</span>
          <span className="block text-sm text-ink-muted">{contactInfo.address}</span>
        </span>
      </div>
    </div>
  );

  return (
    <Band tone={tone} first={first}>
      <Intro tone={tone} heading={heading} body={body} className="reveal" />

      <div className={heading || body ? 'mt-10' : ''}>
        {showForm ? (
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            {details}
            <ContactForm siteKey={siteKey} />
          </div>
        ) : (
          details
        )}
      </div>
    </Band>
  );
}

/** One pressable card: an icon, what it does, and what it will reach. */
function Detail({
  href,
  label,
  value,
  icon,
  delay,
}: {
  href: string;
  label: string;
  value: string;
  icon: ReactNode;
  delay: string;
}) {
  return (
    <a href={href} className={`card reveal ${delay} flex min-h-[72px] items-center gap-3 p-4 text-left`}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          {icon}
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {/* `break-words`, not `truncate`: an email address has to stay
            readable at 360px, and a cut-off address is not a contact detail. */}
        <span className="block break-words text-sm text-ink-muted">{value}</span>
      </span>
    </a>
  );
}
