import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thematic Areas - Strategic Digital Skills Programs',
  description: 'Explore Toko Academy\'s eight thematic areas aligned with the Sustainable Development Goals for inclusive digital skills, workforce development, and community resilience.',
  alternates: {
    canonical: 'https://tokoacademy.org/thematic-areas',
  },
  openGraph: {
    title: 'Thematic Areas - Toko Academy',
    description: 'Discover our eight thematic pillars and how they align to the UN Sustainable Development Goals.',
    url: 'https://tokoacademy.org/thematic-areas',
    type: 'website',
  },
};

const thematicAreas = [
  {
    number: '1',
    title: 'Digital Literacy & Foundational Skills',
    sdgs: ['SDG 4', 'SDG 10', 'SDG 16'],
    description:
      'Bridging the digital divide by equipping individuals, public servants, teachers, and underserved communities with essential digital competencies needed to participate in the modern economy and access digital public services.',
    focus: ['Digital foundations & internet fundamentals', 'Microsoft Office & productivity', 'Digital safety & basic cybersecurity', 'Adult digital literacy'],
  },
  {
    number: '2',
    title: 'Advanced Technology, Innovation & Software Engineering',
    sdgs: ['SDG 4', 'SDG 8', 'SDG 9'],
    description:
      'Building next-generation digital capabilities by training developers, graduates, and entrepreneurs to move from technology consumers to creators — equipped to build solutions, products, and businesses for the digital economy.',
    focus: ['AI & Machine Learning', 'Blockchain & IoT', 'Web & mobile development', 'Cloud, cybersecurity & UI/UX'],
  },
  {
    number: '3',
    title: 'Data, Analytics & Evidence-Based Decision Making',
    sdgs: ['SDG 8', 'SDG 16', 'SDG 17'],
    description:
      'Strengthening data culture across development organisations, government agencies, and NGOs through data literacy, business intelligence, and MEAL training that improves accountability, service delivery, and evidence-based programming.',
    focus: ['Data analysis & visualisation', 'MEAL systems', 'Research methods & survey tools', 'Data-informed governance'],
  },
  {
    number: '4',
    title: 'Workforce Development, Entrepreneurship & Creative Economy',
    sdgs: ['SDG 4', 'SDG 5', 'SDG 8'],
    description:
      'Linking training directly to labour market demand and income generation through bootcamps, upskilling, mentorship, and enterprise support — with particular focus on SMEs, creatives, and youth seeking employment, freelance income, or entrepreneurship.',
    focus: ['Career readiness & employability', 'Entrepreneurship & SME development', 'Digital marketing, content & graphic design', 'Freelancing & the creative economy'],
  },
  {
    number: '5',
    title: 'Children & Youth Technology Education',
    sdgs: ['SDG 4', 'SDG 5', 'SDG 10'],
    description:
      'Cultivating early digital readiness, computational thinking, and 21st-century creativity in children and young people — laying the foundation for long-term participation in the digital economy.',
    focus: ['Programming for kids (Scratch, HTML, CSS)', 'VR game development', 'AI foundations for youth', 'School-based & holiday bootcamps'],
  },
  {
    number: '6',
    title: 'Gender Equality, Inclusion & Protection of Vulnerable Groups',
    sdgs: ['SDG 5', 'SDG 10', 'SDG 16'],
    description:
      'Closing the gender gap in technology and ensuring that women, girls, displacement-affected populations, persons with disabilities, and other marginalised groups are not left behind in the digital transition.',
    focus: ['Women & girls in STEM', 'Women in Uniform programming', 'GBV awareness & 16 Days of Activism', 'Scholarships & child-safe standards'],
  },
  {
    number: '7',
    title: 'Public Sector Capacity Building & Institutional Strengthening',
    sdgs: ['SDG 8', 'SDG 16', 'SDG 17'],
    description:
      'Equipping government agencies, law enforcement, regulatory bodies, and public institutions with the digital tools, AI literacy, cybersecurity awareness, and data-driven governance practices required to improve service delivery and citizen outcomes.',
    focus: ['AI & digital literacy for government', 'Cybersecurity for law enforcement', 'Data-driven decision-making', 'Institutional digital transformation'],
  },
  {
    number: '8',
    title: 'Climate Education, Green Digital Skills & Sustainability',
    sdgs: ['SDG 4', 'SDG 9', 'SDG 13', 'SDG 15'],
    description:
      'Preparing learners and institutions for the green digital transition by integrating climate awareness, sustainable technology practices, and green-economy skills into our training and community programming.',
    focus: ['Climate literacy for youth & schools', 'Green digital skills (sustainable computing, climate data, e-waste)', 'Tech for climate adaptation', 'Youth-led climate action'],
  },
];

const crossCutting = [
  {
    title: 'Equity & Inclusion',
    description:
      'Gender-responsive facilitation, scholarships for low-income learners, accessibility considerations across every programme.',
  },
  {
    title: 'Community-Centred Delivery',
    description:
      'Programmes co-designed with local partners and rooted in the lived realities of North-East Nigerian communities.',
  },
  {
    title: 'Evidence & Learning',
    description:
      'Pre/post assessments, MEAL systems, and a longitudinal beneficiary database tracking outcomes over multiple years.',
  },
  {
    title: 'Safeguarding & Child Protection',
    description:
      'Child-safe standards, code of conduct for all trainers, zero-tolerance policies on harassment and exploitation.',
  },
  {
    title: 'Partnerships & Multi-Sector Collaboration',
    description:
      'Working across government, academia, INGOs, faith-based organisations, and private sector to scale impact.',
  },
];

const alignmentMatrix = [
  { area: 'Digital Literacy & Foundational Skills', ratings: ['●', '—', '—', '—', '●', '—', '●'] },
  { area: 'Advanced Tech, Innovation & Software Eng.', ratings: ['●', '—', '●', '●', '—', '—', '—'] },
  { area: 'Data, Analytics & Decision Making', ratings: ['—', '—', '●', '—', '—', '—', '●'] },
  { area: 'Workforce, Entrepreneurship & Creative Econ.', ratings: ['●', '●', '●', '—', '—', '—', '—'] },
  { area: 'Children & Youth Tech Education', ratings: ['●', '●', '—', '—', '●', '—', '—'] },
  { area: 'Gender Equality, Inclusion & Protection', ratings: ['—', '●', '—', '—', '●', '—', '●'] },
  { area: 'Public Sector Capacity Building', ratings: ['—', '—', '●', '—', '—', '—', '●'] },
  { area: 'Climate Education & Green Digital Skills', ratings: ['●', '—', '—', '●', '—', '●', '—'] },
];

export default function ThematicAreasPage() {
  return (
    <>
      <section className="pt-40 pb-16 bg-gradient-to-br from-toko-gray-900 via-toko-blue to-toko-green text-white md:pt-52 md:pb-20">
        <div className="section-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">What We Do</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Eight Thematic Areas. One mission.
            </h1>
            <p className="mt-6 text-base text-white/85 md:text-lg">
              Toko Academy delivers programmes across eight strategic pillars, each aligned to specific Sustainable Development Goals. Together, they form a coherent response to the digital, gender, and workforce challenges of North-East Nigeria — and beyond.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid gap-6 lg:grid-cols-2">
            {thematicAreas.map((area) => (
              <article key={area.number} className="rounded-3xl border border-toko-gray-200 p-6 shadow-sm transition-shadow hover:shadow-toko-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-toko-green">Area {area.number}</p>
                    <h2 className="mt-3 text-2xl font-semibold text-toko-gray-900">{area.title}</h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-toko-gray-100 px-4 py-2 text-sm font-semibold text-toko-gray-700">
                    {area.sdgs.join(' • ')}
                  </div>
                </div>
                <p className="mt-5 text-toko-gray-600">{area.description}</p>
                <div className="mt-6 space-y-2">
                  {area.focus.map((item) => (
                    <div key={item} className="flex gap-3 text-toko-gray-700">
                      <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-toko-green" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-gray-50">
        <div className="section-container">
          <div className="max-w-3xl text-center mx-auto mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">Cross-Cutting Approaches</p>
            <h2 className="mt-3 text-3xl text-toko-gray-900">Applied Across Every Programme</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-5">
            {crossCutting.map((item) => (
              <div key={item.title} className="rounded-3xl border border-toko-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-toko-gray-900 mb-3">{item.title}</h3>
                <p className="text-toko-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.2em] text-toko-gray-500">SDG Alignment Matrix</p>
              <h2 className="mt-3 text-3xl text-toko-gray-900">SDG Alignment Matrix</h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-toko-gray-200">
              <div className="grid grid-cols-1 gap-px bg-toko-gray-200 text-sm text-center text-toko-gray-500 md:grid-cols-8">
                <div className="bg-white p-4 text-left font-semibold text-toko-gray-900">Thematic Area</div>
                <div className="bg-white p-4">4</div>
                <div className="bg-white p-4">5</div>
                <div className="bg-white p-4">8</div>
                <div className="bg-white p-4">9</div>
                <div className="bg-white p-4">10</div>
                <div className="bg-white p-4">13</div>
                <div className="bg-white p-4">16</div>
              </div>
              {alignmentMatrix.map((row) => (
                <div key={row.area} className="grid grid-cols-1 gap-px bg-toko-gray-200 md:grid-cols-8 text-center text-sm text-toko-gray-700">
                  <div className="bg-white p-4 text-left font-medium">{row.area}</div>
                  {row.ratings.map((rating, index) => (
                    <div key={index} className="bg-white p-4">{rating}</div>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm italic text-toko-gray-500">
              Legend: ● = Direct contribution. — = Limited / indirect contribution.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-toko-green text-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold">Designing a programme that fits one of these areas?</h2>
            <p className="mt-4 text-base text-white/90 md:text-lg">
              We co-design with government, INGO, academic, and private sector partners. Tell us your goal — we will scope the work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/partners" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-toko-green transition-colors hover:bg-toko-gray-100">
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
