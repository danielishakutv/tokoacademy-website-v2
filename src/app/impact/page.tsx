import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impact - Measurable Digital Skills Outcomes',
  description: 'See Toko Academy\'s impact figures, MEL framework, case studies, and beneficiary results from 2023 to 2026.',
  alternates: {
    canonical: 'https://tokoacademy.org/impact',
  },
  openGraph: {
    title: 'Impact - Toko Academy',
    description: 'Explore our verified impact metrics, case studies, and monitoring framework for digital skills programming.',
    url: 'https://tokoacademy.org/impact',
    type: 'website',
  },
};

const metrics = [
  { title: 'Learners Trained', value: '2,000+' },
  { title: 'Career Progression', value: '75%' },
  { title: 'Partner Institutions', value: '35+' },
  { title: 'Federal Agencies Trained', value: '5' },
  { title: 'Female Beneficiaries', value: '~43%' },
  { title: 'States Reached', value: '4+' },
];

const melFramework = [
  { outcome: 'Digital Skills', indicator: '% of participants passing post-training assessment', target: '≥75%' },
  { outcome: 'Employment', indicator: '% securing income within 6 months of training', target: '≥50%' },
  { outcome: 'Gender Inclusion', indicator: '% of female participants per programme', target: '≥40%' },
  { outcome: 'Institutional Impact', indicator: '% of government partners reporting improved digital tool use', target: '≥70%' },
  { outcome: 'Child Digital Literacy', indicator: 'Skills assessment score gain — kids programmes', target: 'Baseline +30%' },
  { outcome: 'Partner Satisfaction', indicator: 'Post-engagement satisfaction score', target: '≥4 / 5' },
];

const caseStudies = [
  {
    title: 'TEDxYola 2025: AI, Culture, and Change',
    description: 'Officially licensed TEDx event in North-East Nigeria. 200+ attendees • National thought leaders • SDG 4, 17',
  },
  {
    title: 'AI & Digital Literacy for Government Agencies',
    description: 'Structured training for officers across NSCDC, NPF, FRSC, and NMDPRA. 4 federal agencies • November 2025 • SDG 4, 8, 16',
  },
  {
    title: 'Women in Uniform — IWD 2025',
    description: 'International Women\'s Day initiative recognising women in uniformed services. Military • Police • NSCDC • Immigration • SDG 5, 4',
  },
  {
    title: 'Kids Coding Bootcamp & Summer Classes',
    description: 'Project-based programming and digital creativity for ages 6–17. Scratch, HTML, CSS • Public project showcases • SDG 4',
  },
  {
    title: 'From AI Users to AI Builders (Feb 2026)',
    description: 'Community-driven event shifting participants from passive AI consumption to active creation and local innovation. Students, professionals, tech enthusiasts • SDG 4, 8, 9',
  },
  {
    title: '16 Days of Activism — Safe Spaces, Strong Voices (Dec 2025)',
    description: 'GBV awareness, digital safety, and youth advocacy workshop with Tent2School. Youth & women participants • SDG 5, 10',
  },
];

const testimonials = [
  {
    quote: 'I moved from beginner to building real projects and presenting my work confidently in just a few months.',
    author: 'Program Graduate',
  },
  {
    quote: 'The structure made it easy to balance work and learning, and the outcomes were visible almost immediately.',
    author: 'Working Professional',
  },
  {
    quote: 'Our collaboration produced stronger digital literacy outcomes and better readiness among beneficiaries.',
    author: 'Partner Organization',
  },
  {
    quote: 'Our personnel left the training able to use AI tools, recognise cybersecurity risks, and apply data-informed thinking to operational decisions.',
    author: 'Senior Officer, Federal Agency',
  },
];

export default function ImpactPage() {
  return (
    <>
      <section className="pt-40 pb-16 bg-gradient-to-br from-toko-gray-900 via-toko-blue to-toko-green text-white md:pt-52 md:pb-20">
        <div className="section-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">Our Impact</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Real numbers. Real outcomes. Documented.
            </h1>
            <p className="mt-6 text-base text-white/85 md:text-lg">
              Toko Academy tracks every cohort against documented KPIs and reports outcomes transparently to partners and donors. The figures below are drawn from internal monitoring, evaluation, and learning data covering 2023–2026.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid gap-5 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.title} className="rounded-3xl border border-toko-gray-200 p-8 text-center shadow-sm">
                <p className="text-4xl font-bold text-toko-green">{metric.value}</p>
                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-toko-gray-500">{metric.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Our Monitoring, Evaluation & Learning Framework</p>
            <h2 className="mt-3 text-3xl text-toko-gray-900">Our Monitoring, Evaluation & Learning Framework</h2>
            <p className="mt-4 text-base text-toko-gray-600">
              Toko Academy maintains a structured MEL system to track programme performance, demonstrate accountability, and continuously improve quality.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-toko-gray-200">
            <div className="grid grid-cols-3 gap-px bg-toko-gray-200 text-sm text-center text-toko-gray-500 font-semibold md:grid-cols-3">
              <div className="bg-white p-4 text-left">Outcome Area</div>
              <div className="bg-white p-4">Indicator</div>
              <div className="bg-white p-4">Target</div>
            </div>
            {melFramework.map((item) => (
              <div key={item.outcome} className="grid grid-cols-3 gap-px bg-toko-gray-200 text-sm text-toko-gray-700 md:grid-cols-3">
                <div className="bg-white p-4 text-left">{item.outcome}</div>
                <div className="bg-white p-4">{item.indicator}</div>
                <div className="bg-white p-4 font-semibold text-toko-gray-900">{item.target}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Case Studies</p>
            <h2 className="mt-3 text-3xl text-toko-gray-900">Evidence from Our Programmes</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <article key={caseStudy.title} className="rounded-3xl border border-toko-gray-200 p-6 shadow-sm hover:shadow-toko-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-toko-gray-900 mb-4">{caseStudy.title}</h3>
                <p className="text-toko-gray-600">{caseStudy.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Voices</p>
            <h2 className="mt-3 text-3xl text-toko-gray-900">What Participants and Partners Say</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {testimonials.map((testimonial, index) => (
              <article key={index} className="rounded-3xl border border-toko-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm italic text-toko-gray-700">“{testimonial.quote}”</p>
                <p className="mt-6 font-semibold text-toko-gray-900">{testimonial.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="rounded-3xl border border-toko-gray-200 bg-toko-gray-50 p-8 text-center">
            <h2 className="text-3xl font-semibold text-toko-gray-900">Beneficiary Demographic Snapshot</h2>
            <p className="mt-4 max-w-3xl mx-auto text-base text-toko-gray-600">
              Across all programmes delivered to date, women and girls constitute approximately 43% of beneficiaries; youth aged 15–35 make up over 60%; and we have reached learners across four states physically and virtually.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-green text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold">Annual Report 2026</h2>
            <p className="mt-4 text-base text-white/90 md:text-lg">
              A full year of programming, partnerships, and impact, in one document.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/files/TOKO-Academy-Profile-April-2026.pdf" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-toko-green transition-colors hover:bg-toko-gray-100">
                Download Profile PDF
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
