import type { Metadata } from 'next';
import { contactInfo } from '@/data/config';
import { captchaSiteKey } from '@/lib/enquiries';
import Picture from '@/components/ui/Picture';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch with Toko Academy',
  description: 'Contact Toko Academy for inquiries about courses, corporate training, or enrollment. Call +234 808 825 6055 or email info@tokoacademy.org. Located in Yola, Abuja, and Kaduna.',
  keywords: ['contact Toko Academy', 'Toko Academy phone', 'Toko Academy email', 'Toko Academy location', 'training inquiries Nigeria', 'course enrollment'],
  alternates: {
    canonical: 'https://tokoacademy.org/contact',
  },
  openGraph: {
    title: 'Contact Toko Academy',
    description: 'Get in touch with us for any inquiries about our courses and training programs.',
    url: 'https://tokoacademy.org/contact',
    type: 'website',
    images: [{
      url: 'https://tokoacademy.org/images/hero/professional-courses.jpg',
      width: 1200,
      height: 630,
      alt: 'Contact Toko Academy'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Toko Academy',
    description: 'Get in touch with us for any inquiries about our courses and training programs.',
    images: ['https://tokoacademy.org/images/hero/professional-courses.jpg'],
  },
};

const WHATSAPP_HREF =
  "https://wa.me/2348088256055?text=Hello%20Toko%20Academy,%20I'd%20like%20to%20learn%20more%20about%20your%20courses";

export default async function ContactPage() {
  // Read once at build time. No key configured means no captcha widget and no
  // third-party script — the form still works on its honeypot and the server's
  // rate limit.
  const siteKey = await captchaSiteKey();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface-sunken pt-28 pb-14 md:pt-40 md:pb-20">
        <div className="aurora" aria-hidden />
        <div className="section-container relative">
          <div className="mx-auto max-w-3xl text-center reveal">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-3">Talk to us</h1>
            <p className="prose-measure mx-auto mt-5 text-lg text-ink-muted md:text-xl">
              Have questions? We&apos;d love to hear from you. Get in touch with our team.
            </p>
          </div>

          {/*
            Three tap targets at the top, before anything else on the page.
            Most people who open a contact page on a phone want to press a
            number, not read a column of details and then hunt for one.
          */}
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            <QuickAction
              href={`tel:${contactInfo.phones[0]}`}
              label="Call us"
              value={contactInfo.phones[0]}
              delay="reveal-delay-1"
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              }
            />
            <QuickAction
              href={`mailto:${contactInfo.email}`}
              label="Email us"
              value={contactInfo.email}
              delay="reveal-delay-2"
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              }
            />
            <QuickAction
              href={WHATSAPP_HREF}
              external
              label="WhatsApp"
              value="Chat with us"
              delay="reveal-delay-3"
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              }
            />
          </div>
        </div>
      </section>

      {/* Details and the form */}
      <section className="section-padding bg-surface">
        <div className="section-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="reveal">
              <p className="eyebrow">Where to find us</p>
              <h2 className="mt-3">Get In Touch</h2>

              <Picture
                src="/images/contact/entrance.jpg"
                alt="The entrance to Toko Academy on Bekaji Road, Jimeta-Yola"
                brief="The front of the building with the signage visible, shot in daylight from across the street. Landscape."
                aspect="aspect-[3/2]"
                className="mt-6"
              />

              <div className="mt-8 space-y-6">
                <Detail
                  title="Phone"
                  icon={
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  }
                >
                  <a href={`tel:${contactInfo.phones[0]}`} className="link-hover block text-ink-muted">
                    {contactInfo.phones[0]}
                  </a>
                  <a href={`tel:${contactInfo.phones[1]}`} className="link-hover block text-ink-muted">
                    {contactInfo.phones[1]}
                  </a>
                </Detail>

                <Detail
                  title="Email"
                  icon={
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  }
                >
                  {/* `break-all`: an address with no spaces will otherwise push
                      this column wider than a 360px screen. */}
                  <a href={`mailto:${contactInfo.email}`} className="link-hover block break-all text-ink-muted">
                    {contactInfo.email}
                  </a>
                </Detail>

                <Detail
                  title="Location"
                  icon={
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  }
                >
                  <p className="text-ink-muted">{contactInfo.address}</p>
                </Detail>
              </div>

              {/* Social */}
              <div className="mt-10">
                <h3 className="eyebrow mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  <Social href={contactInfo.socialMedia.facebook} label="Facebook">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </Social>
                  <Social href={contactInfo.socialMedia.instagram} label="Instagram">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </Social>
                  <Social href={contactInfo.socialMedia.twitter} label="X (Twitter)">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </Social>
                  <Social href={contactInfo.socialMedia.linkedin} label="LinkedIn">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </Social>
                </div>
              </div>
            </div>

            {/* A real form, at last. The dashed box that stood here asked
                people to phone or email instead — which is not a contact page,
                it is an apology for not having one. */}
            <ContactForm siteKey={siteKey} />
          </div>
        </div>
      </section>

      {/* One address, and when somebody is in it */}
      <section className="section-padding bg-surface-sunken">
        <div className="section-container">
          <div className="mx-auto max-w-5xl">
            <div className="text-center reveal">
              <p className="eyebrow">Visit us</p>
              <h2 className="mt-3">Toko Academy, Yola</h2>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-center">
              <Picture
                src="/images/contact/reception.jpg"
                alt="The reception area at Toko Academy, Jimeta-Yola"
                brief="Where a visitor arrives — the desk, the waiting chairs, daylight from the window. Nobody posing."
                aspect="aspect-[4/3]"
                className="reveal"
              />

              <div className="card p-6 sm:p-8 reveal reveal-delay-1">
                <p className="text-ink-muted">{contactInfo.address}</p>

                <dl className="mt-6 space-y-4 border-t border-line pt-6">
                  <div>
                    <dt className="text-sm font-semibold text-ink">Monday – Friday</dt>
                    <dd className="text-brand">9:00 AM – 4:00 PM</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-ink">Saturday</dt>
                    <dd className="text-brand">9:30 AM – 2:00 PM</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-ink">Sunday</dt>
                    <dd className="text-ink-muted">Closed</dd>
                  </div>
                </dl>

                <a href={`tel:${contactInfo.phones[0]}`} className="btn-primary mt-8 w-full">
                  Call for Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** A big, single-press target: an icon, what it does, and what it will reach. */
function QuickAction({
  href,
  label,
  value,
  icon,
  external = false,
  delay = '',
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  external?: boolean;
  delay?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`card flex min-h-[72px] items-center gap-3 p-4 text-left reveal ${delay}`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          {icon}
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block truncate text-sm text-ink-muted">{value}</span>
      </span>
    </a>
  );
}

function Detail({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
        <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          {icon}
        </svg>
      </div>
      <div className="min-w-0">
        <h3 className="mb-1">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex size-11 items-center justify-center rounded-lg border border-line bg-surface-raised text-ink-muted transition-colors hover:border-brand hover:text-brand"
      aria-label={label}
    >
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        {children}
      </svg>
    </a>
  );
}
