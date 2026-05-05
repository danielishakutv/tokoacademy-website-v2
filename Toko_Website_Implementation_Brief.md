# Toko Academy — Website Implementation Brief

**Prepared for:** Web Development Team
**Prepared by:** Daniel Ishaku (Founder & CEO)
**Reference documents:** TOKO Academy Profile (April 2026), Organogram v2 Model B, Thematic Areas (April 2026)
**Live site reviewed:** https://tokoacademy.org/
**Status:** Ready for implementation

---

## How to use this document

This is a **single, ordered, copy-paste-ready** brief. Each section names a specific page or component, lists the exact change to make, and provides the final copy where new content is needed. Where the existing site already has a working implementation, the instruction says **"keep as-is"** so the team does not over-build.

The brief is organised in this order:

1. **Global changes** (header, footer, navigation, brand line, address, factual corrections)
2. **Homepage** (`/`)
3. **About** (`/about/`)
4. **Partners** (`/partners/`)
5. **Programs landing & Courses catalogue** (`/courses/` and the Programs dropdown)
6. **Thematic Areas page** (NEW — `/thematic-areas/`)
7. **Impact page** (NEW — `/impact/`)
8. **Events** (`/events/`)
9. **Contact** (`/contact/`)
10. **Corporate** (`/corporate/`)
11. **Kids** (`/kids/`)
12. **News** (`/news/` — minor updates)
13. **Tech & SEO checklist**
14. **Asset list** (what photos / logos / PDFs the team needs from Toko)
15. **Rollout schedule** (week-by-week phasing)
16. **Sign-off checklist** (founder confirmation per tier)

---

## Priority tiers

Each item is tagged with a tier so the team can sequence work:

- **[T1]** This week — high-impact, low-effort credibility fixes.
- **[T2]** Within 2–3 weeks — content rebuilds for About, Partners, Programs, Impact.
- **[T3]** Within the next month — new pages and forms.
- **[T4]** Ongoing — content cadence and SEO maintenance.

---

# 1. GLOBAL CHANGES

These changes apply across every page of the site. Implement these first — they fix factual issues that currently appear sitewide.

## 1.1 Top contact strip [T1]

**Current:** `+234 808 825 6055  |  +234 812 856 1493  |  info@tokoacademy.org` — keep this. Working correctly.

**Change required:** None. The strip displays both phone numbers and the corporate email correctly.

## 1.2 Header navigation [T1, T2]

**Current navigation:** About • Programs ▾ • Impact ▾ • Partners • Contact • [Apply Now]

**New navigation:** About • Programs ▾ • Thematic Areas • Impact • News & Media ▾ • Partners • Contact • [Apply Now]

**Reasoning:** The current "Impact" dropdown actually contains News, Press Releases and Gallery — that is media content, not impact data. Rename it to **News & Media**, and create a real top-level **Impact** page (see §7).

**New dropdown contents:**

- **Programs ▾** — All Programs • By School ▾ (six entries) • By Audience ▾ (Kids, Youth Bootcamps, Professional Upskilling, Corporate & Government) • Class Schedules
- **News & Media ▾** — Newsroom • Press Releases • Toko in the News • Events • Gallery

The "Impact" link goes directly to the new `/impact/` page (no dropdown).

## 1.3 Footer [T1]

**Current footer text:** `© 2026 Toko Academy. All rights reserved.`

**Replace with:**

```
Toko Academy Ltd. — Registered with the Corporate Affairs Commission of Nigeria, 2025 (CAC).
No. 1A Bekaji Road, Adjacent to YEDC S/C Office, Jimeta, Yola, Adamawa State, Nigeria.
+234 808 825 6055  •  +234 812 856 1493  •  info@tokoacademy.org

© 2026 Toko Academy Ltd. All rights reserved.   Privacy Policy   •   Terms of Service   •   Safeguarding Policy
```

**New footer link required:** "Safeguarding Policy" — links to `/safeguarding/` (a short page with the safeguarding statement; see §3.6 for the copy).

**Quick Links column — update:**

- Currently shows: About • Partners • Contact
- Change to: About • Thematic Areas • Impact • Partners • Contact

**More column — update:**

- Currently shows: All Programs • Kids • Bootcamps • Corporate Training • Class Schedules
- Keep this.

## 1.4 Address — sitewide reconciliation [T1]

**Issue:** The Contact page currently shows `No. 2 Bekaji Road, Bekaji, Yola, Jimeta 640261, Adamawa`. The official Profile document shows `No. 1A Bekaji Road, Adjacent to YEDC S/C Office, Jimeta, Yola, Adamawa State, Nigeria`.

**Action:** Use the official address everywhere. Find and replace sitewide:

- Find: `No. 2 Bekaji Road, Bekaji, Yola, Jimeta 640261, Adamawa`
- Replace with: `No. 1A Bekaji Road, Adjacent to YEDC S/C Office, Jimeta, Yola, Adamawa State, Nigeria.`

**Postal code:** If the developer has confirmation that 640261 is correct, keep it appended at the end. If not, drop it.

## 1.5 Abuja and Kaduna office cards [T1]

**Issue:** The Contact page currently shows two additional offices labelled "Under Maintenance" and "Temporarily Closed." These do not appear in the official Profile or Organogram.

**Action:** **Remove both office cards entirely** until they are operational and added to the official Profile. Showing "Temporarily Closed" offices on a public website damages credibility more than it adds reach.

If they are kept (founder's call), reword:

- "Under Maintenance" → "Opening soon — register interest"
- "Temporarily Closed" → "Opening soon — register interest"

…and link both buttons to a real waitlist form.

## 1.6 Statistics — reconcile across the site [T1]

**Issue:** Different stats appear in different places. Pick one set and use it everywhere.

| Stat | Homepage shows | Profile shows | **Use this number** |
| --- | --- | --- | --- |
| Learners trained | 2,000+ | 2,000+ | **2,000+** |
| Programs delivered | 120+ | 20+ | **20+ programmes / 120+ cohorts and sessions** (use whichever the founder confirms; do **not** show two different numbers on two different pages) |
| Partner institutions | 35+ | 35+ | **35+** |
| Career progression | 85% | 75% | **75%** (Profile is the source of truth) |

**Action:** Update homepage Impact Snapshot to: `2,000+ Learners Trained` • `20+ Programmes Delivered` • `35+ Partner Institutions` • `75% Career Progression`. If the team prefers to keep the "120+" number, label it **"Cohorts & Sessions Delivered"** so it does not contradict the Profile.

## 1.7 Brand line — restore "Skills for Tomorrow" [T1]

**Issue:** "Skills for Tomorrow" currently appears only in the footer and in the logo. It is the strapline used in every official document.

**Action:** Add "Skills for Tomorrow" as the eyebrow above the homepage hero headline (see §2.1).

---

# 2. HOMEPAGE (`/`)

The current homepage structure is good. Most changes are **copy refinements** and **adding a partner-logo section** — not a redesign.

## 2.1 Hero band [T1]

**Replace current hero copy with:**

> **Eyebrow:** SKILLS FOR TOMORROW
>
> **Headline:** Building Africa's Digital Future — One Community at a Time.
>
> **Subhead:** Toko Academy Ltd. is a Nigerian-incorporated digital skills and workforce development organisation training individuals, institutions, and communities for the digital economy. Headquartered in Yola, Adamawa State, with national virtual reach.
>
> **Primary CTA:** Explore Programmes → `/courses/`
> **Secondary CTA:** Partner With Us → `/partners/`
> **Tertiary link (small, under the buttons):** Download Our Profile (PDF) → links to the uploaded Profile PDF in the resource library

**Current hero ("Empowering Youths, Children, and Professionals for Lasting Change")** is fine but slightly generic. The replacement above ties the hero directly to the official tagline used across all documents and surfaces the CAC-incorporated status implicitly through "Nigerian-incorporated."

## 2.2 Audience selector — keep [T1]

Keep the four-tile audience selector exactly as it is: Parent / Guardian • Student / Youth • Professional • Organization / Government. Working well.

## 2.3 Impact Snapshot — update numbers [T1]

Replace the four stat cards with the reconciled numbers (see §1.6):

```
2,000+        20+ (or 120+)        35+              75%
Learners      Programmes /         Partner          Career
Trained       Cohorts Delivered    Institutions     Progression
```

**Add a fifth and sixth card** below or alongside (the row is currently four cards — extend to six on desktop, two columns on mobile):

```
5                               ~43%
Federal Agencies Trained        Female Beneficiaries
NSCDC • NPF • FRSC • NMDPRA     Across all programmes
```

These two stats are in your Profile and are exactly what donors and government clients look for.

## 2.4 Pathways By Audience — keep [T1]

Keep the four pathway cards (Children Programs, Youth Bootcamps, Professional Upskilling, Corporate & Institutional Training) exactly as they are. Strong section.

## 2.5 Why Toko Academy — refresh copy [T2]

The three current pillars (Industry-Relevant Learning, Inclusive Access, Measurable Outcomes) are fine but generic. Replace with **four** pillars that match the actual organisational character:

| Pillar | Copy |
| --- | --- |
| **Locally Grounded** | Headquartered in Yola, Adamawa State — programmes are co-designed with the communities and institutions they serve. |
| **Institutionally Trusted** | Trusted by federal agencies (NSCDC, NPF, FRSC, NMDPRA), academic partners (American University of Nigeria, U.S. Embassy's American Space Yola), and global networks (Code.org Global Partner Community). |
| **Evidence-Led** | Every cohort runs pre/post assessments, tracks employment outcomes at 6 months, and reports against documented KPIs. |
| **SDG-Aligned** | Programmes contribute directly to SDGs 4, 5, 8, 9, 10, 13, 16 and 17 — verifiable through our Thematic Areas matrix. |

## 2.6 Partner section — REBUILD [T1]

**Issue:** The current "Built With Government and Organizations" section names categories but no actual partners. This is the highest-impact change on the homepage.

**Replace with:** A logo wall, grouped by category. See **§4 Partners page** for the full list, logos required, and HTML structure. The homepage version should show a condensed strip — 12 logos in a single horizontal grid (or two rows on mobile) — with a "See All Partners" link to `/partners/`.

**Logos to display on the homepage, in this order:**

```
Row 1 (Government & Regulatory):
NSCDC  •  NPF  •  FRSC  •  NMDPRA

Row 2 (Academic & International):
American University of Nigeria  •  American Space Yola (U.S. Embassy)  •  Code.org Global Partner

Row 3 (Implementing & Community Partners):
Tent2School  •  The Timothy Initiative  •  Concordia Junior Academy Yola  •  Family Worship Centre Yola
```

Logos appear in greyscale at rest, full colour on hover. White or very light background. See `/mnt/user-data/outputs/03_Partners_Page_Mockup.html` for the visual reference.

## 2.7 Stories and Results — keep, expand [T2]

Keep the three quotes as they are. They are good and they match the Profile.

**Add a fourth quote tile** for institutional balance:

> *"Our personnel left the training able to use AI tools, recognise cybersecurity risks, and apply data-informed thinking to operational decisions."*
> **— Senior Officer, Federal Agency (AI & Digital Literacy for Government Programme, Nov 2025)**

If the actual agency wishes to be named, use the agency name. Otherwise the generic attribution works and is still institutionally credible.

## 2.8 SDG Strip — NEW SECTION [T2]

Add a new section between "Stories and Results" and "Impact Updates":

> **Eyebrow:** ALIGNED TO THE SUSTAINABLE DEVELOPMENT GOALS
>
> **Headline:** Our work contributes directly to the UN SDGs.
>
> **Body:** Toko Academy's eight Thematic Areas are mapped to specific Sustainable Development Goal targets, providing partners and donors with a clear accountability framework.
>
> **CTA:** See the SDG Alignment Matrix → `/thematic-areas/`

Below the copy, display the **8 official UN SDG icons** (4, 5, 8, 9, 10, 13, 16, 17) at ~64×64px in a horizontal row, with each icon labelled below it (e.g. "SDG 4 Quality Education").

**Important:** Use the official SDG icons from https://www.un.org/sustainabledevelopment/news/communications-material/. They are free for any organisation working toward the goals. Do not use stylised or recoloured versions.

## 2.9 Impact Updates — keep [T1]

Keep the existing "Follow Our Latest News and Events" section. No changes.

## 2.10 Final CTA strip — keep [T1]

Keep "Take the Next Step / Start Your Journey or Build One With Us." No changes.

---

# 3. ABOUT PAGE (`/about/`)

**Current state:** A short generic page with mission, vision, story, core values, and a "What We Offer" block. Significantly under-states the 2026 organisation.

**Action:** Replace the entire page body with the structure below. This page is the donor and procurement-officer landing page — it must communicate the organisation's full credibility.

## 3.1 Hero band [T2]

> **Eyebrow:** ABOUT TOKO ACADEMY
>
> **Headline:** Skills for Tomorrow. Built in North-East Nigeria, designed for the digital economy.
>
> **Subhead:** Toko Academy Ltd. is a Nigerian-incorporated digital skills and workforce development organisation training individuals, institutions, and communities to participate fully — and competitively — in the digital age.
>
> **Primary CTA:** Download Our Profile (PDF)
> **Secondary CTA:** Partner With Us → `/partners/`

## 3.2 At-a-Glance band — NEW [T2]

A four-column band immediately under the hero. Each column is a stat card with a single label and a short value.

| Legal Name | Registration | Founded | Headquarters |
| --- | --- | --- | --- |
| **Toko Academy Ltd.** | Fully incorporated with the Corporate Affairs Commission (CAC) of Nigeria, 2025. Formerly a subsidiary of Ecom Toko Enterprises. | **2021** as subsidiary; **2025** as independent legal entity. | No. 1A Bekaji Road, Adjacent to YEDC S/C Office, Jimeta, Yola, Adamawa State. |

**Visual treatment:** Use the same white-card-on-light-grey-background style already used on the homepage Impact Snapshot.

## 3.3 Mission & Vision — replace [T2]

Replace both blocks with the following exact copy:

**Our Mission**

To equip individuals, institutions, and communities — particularly in underserved and conflict-affected regions of Nigeria — with practical, industry-relevant digital skills that translate directly into income, productivity, and inclusion in the digital economy.

**Our Vision**

A Nigeria — and an Africa — in which no community is locked out of the digital transition because of where they were born, what they earn, or what gender they are.

## 3.4 Why We Exist — NEW BLOCK [T2]

Add this section between Vision and Theory of Change. Replace the current "Our Story" block with this.

**Why We Exist**

Adamawa State sits in one of Nigeria's most underserved and conflict-affected regions. Years of displacement disrupted education and economic systems, and the country's North-East records some of the highest youth unemployment rates nationally. Compounding this, formal education routinely turns out graduates whose skills do not match what the labour market — increasingly digital — actually needs.

Toko Academy was built to close that gap. Specifically, we respond to:

- A digital skills deficit among youth, graduates, and government personnel that limits their participation in the digital economy.
- Low digital literacy among public sector workers, which reduces institutional efficiency and service delivery.
- Structural exclusion of women and girls from technology education and career pathways.
- A lack of early technology exposure for children in the region, narrowing long-term aspirations.
- Weak linkages between training providers and labour market demand, producing a persistent skills mismatch.

## 3.5 Theory of Change — NEW [T2]

A horizontal flow diagram (5 nodes connected by arrows). On mobile, stack vertically.

**Section heading:** Our Theory of Change

**Intro paragraph:**
When individuals — particularly women, youth, and public servants in underserved regions — receive practical, market-relevant digital training alongside mentorship and career support, they generate income, improve institutional productivity, and contribute to broader community development. Aggregated across cohorts, those changes drive systemic economic inclusion and social equity.

**Diagram nodes (left to right):**

1. **INPUTS** — Certified trainers • Curriculum • Facilities & technology • Partner networks • Community trust
2. **ACTIVITIES** — Bootcamps & workshops • Government agency training • Kids coding • TEDxYola • Webinars & mentoring
3. **OUTPUTS** — 2,000+ trained • 20+ programmes delivered • 35+ partnerships • Certifications issued • Youth projects built
4. **OUTCOMES** — Income generation • Employment gained • Improved government efficiency • Girls in tech • Digital inclusion
5. **IMPACT** — Reduced digital poverty • SDG 4, 5, 8 contributions • Inclusive digital economy in North-East Nigeria

**Footnote (small italic text below the diagram):**
*Key assumptions: (1) participants have baseline access to a device or facility; (2) gender-sensitive facilitation increases women's enrolment and retention; (3) government partners sustain institutional use of digital tools post-training; (4) community trust is maintained through transparent, locally-grounded programming.*

**Implementation note:** Use a horizontal flex layout with 5 cards and right-pointing arrow icons between them. On screens narrower than 1024px, stack vertically with downward arrows.

## 3.6 Leadership & Team — NEW [T2]

**Section heading:** Leadership & Team

**Intro:** Toko Academy is led by a six-member professional team combining technical expertise, programme design experience, and deep community familiarity.

**Team cards** (3 columns on desktop, 2 on tablet, 1 on mobile). Each card: headshot (square, 1:1), name, role, expertise summary, LinkedIn icon link. **All headshots must be shot the same way — same lighting, same background — to look like a team rather than six separate uploads.**

```
1. Daniel Ishaku — Founder & CEO
   IT, digital education, software architecture, entrepreneurship, strategic leadership.

2. Owenosa Sunshine Omogiate — Head of Operations
   Operational strategy, process optimisation, resource planning, performance management,
   internal systems, team coordination.

3. Sondani Tusuro — HR & Legal Officer
   Human resource management, recruitment & talent development, compliance & regulatory affairs,
   policy development, employee relations.

4. Simon Bonoshi Abraham — Programme Lead
   Programme design & execution, project management, training coordination, monitoring &
   evaluation, partner & stakeholder engagement, community outreach.

5. Joy Oshione Inope — Office & Assets Manager
   Facility & asset management, inventory control, administrative operations, procurement
   support, workplace efficiency.

6. Florence Hauwa Aliyu — Marketing & Communications Lead
   Digital content creation, social media strategy, branding, outreach.
```

**Note to dev team:** Founder will confirm whether Owenosa Sunshine Omogiate carries the COO title (per the Organogram) or Head of Operations title (per the Profile §13). Use whichever the founder confirms; do not show conflicting titles.

## 3.7 Governance & Safeguarding — NEW [T2]

**Section heading:** Governance & Safeguarding

**Body copy:**

Toko Academy operates under structured governance and a documented safeguarding framework appropriate to international donor standards.

**Governance.** The Academy is led by its Founder & CEO, supported by a six-member programme team. Strategic oversight is provided by the Board of Directors and an Advisory Council, with independent financial audit.

**Safeguarding.** We apply child-safe facilitation standards across all Kids & Youth Technology programmes — including supervision ratios and age-appropriate content guidelines — and operate a code of conduct for all trainers and volunteers working with young people. We maintain a mandatory reporting protocol for any safeguarding concern, with a confidential reporting line to the CEO and Board.

**Policies maintained:**

- Human Resource Policy
- Procurement Policy
- Monitoring, Evaluation, Accountability & Learning (MEAL) Policy
- Conflict of Interest Policy
- Data Protection Policy
- Child Protection & PSEA Policy

*Detailed policies are available to partners and donors on request.*

**CTA below this block:** [ Request Safeguarding Documentation ] → links to a form (or `mailto:info@tokoacademy.org?subject=Safeguarding Documentation Request`).

## 3.8 What We Offer — replace with Schools-and-Themes summary [T2]

Replace the current generic six-card grid with a clear two-column structure linking to the new `/thematic-areas/` and `/courses/` pages.

**Section heading:** How We Deliver

**Body:** Our work is organised through six specialised Schools delivering eight cross-cutting Thematic Areas, each aligned with specific Sustainable Development Goals.

**Two-column block:**

```
SIX SCHOOLS                              EIGHT THEMATIC AREAS
1. Digital Literacy & Productivity        1. Digital Literacy & Foundational Skills
2. Software Engineering                   2. Advanced Tech, Innovation & Software
3. AI & Emerging Technologies             3. Data, Analytics & Decision-Making
4. Data Science & Analytics               4. Workforce, Entrepreneurship & Creative
5. Digital Media & Creative Tech          5. Children & Youth Tech Education
6. Kids & Youth Technology                6. Gender Equality, Inclusion & Protection
                                          7. Public Sector Capacity Building
                                          8. Climate Education & Green Digital Skills
```

**CTA buttons (side by side below the block):**
- [ Browse Programmes by School ] → `/courses/`
- [ See Our Thematic Areas ] → `/thematic-areas/`

## 3.9 Final CTA — keep, refresh [T2]

Keep the structure of the current "Join the Toko Academy Community" CTA, but update copy:

> **Heading:** Work With Us.
> **Body:** Whether you are a learner, a parent, a partner, or a donor — there is a clear way in.
> **Buttons:** [ Apply to a Programme ] [ Become a Partner ] [ Talk to Our Team ]

---

# 4. PARTNERS PAGE (`/partners/`)

**Current state:** The page describes partnership categories and a "How We Work" 3-step process — but does not name a single actual partner. **This is the most damaging gap on the entire site** and must be the first thing fixed.

**Action:** Add a logo wall **above** the existing "Where We Collaborate" content, then keep the existing content (Why Partner, How We Work) below it.

## 4.1 Hero band — refresh copy [T1]

> **Eyebrow:** OUR PARTNERS
>
> **Headline:** Trusted by federal agencies, universities, INGOs, and global networks.
>
> **Subhead:** Toko Academy partners with government, academic institutions, international development bodies, and community organisations to deliver measurable digital skills outcomes across Nigeria. Below is the institutional network that has formally engaged us.

## 4.2 Logo wall — NEW SECTION [T1]

Place this block immediately under the hero. Logos grouped into six categories with clear category labels above each row.

**HTML/visual notes:**
- Each logo: ~160px wide, fits inside a 200×120px white card with 1px light-grey border and small radius.
- Default state: full colour. Hover state: subtle lift (translateY -2px) + slightly stronger shadow.
- Category label: small uppercase grey heading above each group.
- Mobile: 2 logos per row.
- Desktop: 4 logos per row.

**Group 1 — Federal Government & Regulatory Agencies**

```
1. Nigeria Security & Civil Defence Corps (NSCDC)
2. Nigeria Police Force (NPF)
3. Federal Road Safety Corps (FRSC)
4. Nigerian Midstream & Downstream Petroleum Regulatory Authority (NMDPRA)
```

Caption text below this group: *"Toko Academy delivered structured AI and digital literacy training to officers across these four federal agencies in November 2025."*

**Group 2 — Academic Partners**

```
5. American University of Nigeria (AUN)
```

Caption: *"Academic collaboration on curriculum design and youth development programming."*

**Group 3 — International & Public Diplomacy Partners**

```
6. American Space Yola (U.S. Embassy Programme)
7. Code.org Global Partner Community  ← (announced Jan 2026 — see press release)
```

Caption: *"International public diplomacy and global partner network engagements bringing world-class AI and computer science education to North-East Nigeria."*

**Group 4 — INGO & Civil Society Partners**

```
8. Tent2School Initiative
9. The Timothy Initiative
```

Caption: *"Implementing partners for community-facing programming, GBV awareness, and communications training."*

**Group 5 — Educational Institutions**

```
10. Concordia Junior Academy Yola
```

Caption: *"Teacher training and school-based technology education partnership."*

**Group 6 — Faith-Based & Community Partners**

```
11. Family Worship Centre Yola (FWC)
```

Caption: *"Community outreach and faith-based engagement on digital skills and inclusion."*

## 4.3 Existing "Where We Collaborate" section — keep [T1]

Keep the four-card "Where We Collaborate" block (Government Programs / Organization Partnerships / Private Sector Alliances) — it usefully invites *new* partners. Place it **below** the logo wall, so visitors first see proof of existing partners, then read about future partnership models.

## 4.4 Existing "Why Partner With Us" — keep [T1]

Keep this block as-is. The four bullet points work well.

## 4.5 Existing "How We Work" — keep [T1]

Keep the three-step process (Discovery Call → Partnership Design → Delivery and Reporting). No changes.

## 4.6 Add: Become a Partner form [T3]

Replace the "Talk to Our Team" CTA at the bottom with a real form. Fields:

- Name *
- Organisation *
- Role / Title *
- Email *
- Phone (optional)
- Type of partnership: [ Government ] [ Academic ] [ INGO / Civil Society ] [ Private Sector ] [ Donor / Funder ] [ Other ]
- Country / region of operation *
- Brief description of partnership interest *
- [ Submit ]

Form submissions route to `info@tokoacademy.org` with subject line `Partnership Enquiry — [Organisation Name]`.

## 4.7 Reference HTML mock-up

A working HTML mock-up of the rebuilt Partners page is provided as a separate file: `Partners_Page_Mockup.html`. The dev team can use it as a visual reference and lift the structure directly.

---

# 5. PROGRAMS LANDING & COURSES CATALOGUE (`/courses/`)

**Current state:** A flat list of 13 courses. Every course shows "Image coming soon" and "N/A" pricing. Several courses have no description. There is a typo ("Pything Programming"). The catalogue is not organised into Schools or Thematic Areas.

## 5.1 Immediate fixes [T1]

These are corrections — do them this week, before any restructure.

- **Fix typo:** "Pything" → "Python" (course title and description).
- **Fix empty descriptions:** Five courses currently show no description text. Use the placeholder copy below until the team writes proper descriptions:

```
AI for Productivity
"Practical, day-to-day use of AI tools (ChatGPT, Claude, Gemini, Copilot)
to accelerate research, writing, analysis, and planning workflows."

Cybersecurity Fundamentals
"Foundational cybersecurity concepts for individuals and small teams —
threat awareness, password hygiene, phishing identification, safe device
practices, and incident response basics."

Data Analysis & Visualisation
"Hands-on data analysis using spreadsheets and modern BI tools.
Cleaning, exploring, and visualising data to support decisions in
development, government, and business contexts."

UI/UX Design
"Designing usable, accessible digital products. Wireframing,
prototyping in Figma, user research basics, and visual hierarchy
for web and mobile."

Web Development (Code Stream)
"Build websites with HTML, CSS, and JavaScript from the ground up.
For learners who want to write real code rather than rely on no-code tools."
```

- **Replace "N/A" pricing.** Either show real pricing, "On Request," or "Cohort-based — see Class Schedules." Decide one and apply consistently.
- **Replace "Image coming soon"** with placeholder course images. Even a clean coloured tile with the course title is better than the current placeholder text. (See **§14 Asset List** for the photography brief.)

## 5.2 Restructure into Schools [T2]

Add a tab/filter bar at the top of `/courses/` so visitors can browse by School:

```
[ All Programmes ]  [ Digital Literacy ]  [ Software Engineering ]
[ AI & Emerging Tech ]  [ Data Science ]  [ Digital Media ]  [ Kids & Youth ]
```

Default view: All Programmes. Each filter shows only the courses belonging to that School.

**School-to-course mapping** (for the filter logic):

| School | Courses currently in catalogue |
| --- | --- |
| Digital Literacy & Productivity | (Add: Digital Foundations, Microsoft Office Suite — currently missing) |
| Software Engineering | Web Development (CMS), Web Development (Code Stream), Python Programming |
| AI & Emerging Technologies | AI Essentials, AI Chatbots & Workflow Automation, AI for Productivity, AI Web Development |
| Data Science & Analytics | Data Analysis & Visualisation |
| Digital Media & Creative Tech | Digital Marketing & Content Creation, UI/UX Design |
| Kids & Youth Technology | Scratch Programming (also referenced from /kids/) |
| (Cross-school) | Cybersecurity Fundamentals — appears in Digital Literacy and Software Engineering |

**Action:** The team will need to add at least two missing courses to fully populate the Digital Literacy School: **Digital Foundations** and **Microsoft Office Suite**. Use the descriptions below.

```
Digital Foundations
"Internet fundamentals, digital safety, online identity, and the basics
of working confidently with digital tools. For adult learners, public
servants, and anyone new to working online."

Microsoft Office Suite
"Practical Word, Excel, and PowerPoint skills for the workplace. Covers
formatting, formulas, charts, presentations, and collaboration features."
```

## 5.3 Course detail pages [T3]

Each course's "View Details" page currently appears thin or stubbed. The full template should be:

- Hero strip: course title, School badge, level, format (Online / In-Person / Hybrid).
- Who this course is for (3 bullet points).
- What you'll learn (8–12 bullet outcomes).
- Curriculum / weekly breakdown.
- Format & duration.
- Trainer bio (when assigned).
- Pricing or "Apply for Pricing" CTA.
- SDG icons relevant to the course.
- [ Apply Now ] button → `bootcamp.tokoacademy.org/signup`

**Priority:** Build out **3–4 flagship courses** to a high standard rather than 13 stubs. Suggested first four: AI Essentials, Data Analysis & Visualisation, Web Development (Code Stream), Digital Marketing & Content Creation.

---

# 6. THEMATIC AREAS PAGE (`/thematic-areas/`) — NEW

**Status:** This page does not exist. Build it.

**Why this page matters:** It is the single most useful page for donors, INGOs, and government partners doing due diligence. It is portable directly from the Thematic Areas document.

## 6.1 Hero band [T2]

> **Eyebrow:** WHAT WE DO
>
> **Headline:** Eight Thematic Areas. One mission.
>
> **Subhead:** Toko Academy delivers programmes across eight strategic pillars, each aligned to specific Sustainable Development Goals. Together, they form a coherent response to the digital, gender, and workforce challenges of North-East Nigeria — and beyond.

## 6.2 Eight Thematic Area cards [T2]

A grid of 8 cards (4 columns × 2 rows on desktop; 2×4 on tablet; 1×8 on mobile). Each card has:

- Number (1–8) and area name
- Two-sentence description (lifted from the Thematic Areas document)
- 3–4 focus areas as a small bullet list
- Row of relevant SDG icons (using official UN icons)
- "Read more" disclosure that expands an inline panel

**Card content (paste exactly):**

**1. Digital Literacy & Foundational Skills**
*SDG 4 • SDG 10 • SDG 16*
Bridging the digital divide by equipping individuals, public servants, teachers, and underserved communities with essential digital competencies needed to participate in the modern economy and access digital public services.
*Focus:* Digital foundations & internet fundamentals • Microsoft Office & productivity • Digital safety & basic cybersecurity • Adult digital literacy.

**2. Advanced Technology, Innovation & Software Engineering**
*SDG 4 • SDG 8 • SDG 9*
Building next-generation digital capabilities by training developers, graduates, and entrepreneurs to move from technology consumers to creators — equipped to build solutions, products, and businesses for the digital economy.
*Focus:* AI & Machine Learning • Blockchain & IoT • Web & mobile development • Cloud, cybersecurity & UI/UX.

**3. Data, Analytics & Evidence-Based Decision Making**
*SDG 8 • SDG 16 • SDG 17*
Strengthening data culture across development organisations, government agencies, and NGOs through data literacy, business intelligence, and MEAL training that improves accountability, service delivery, and evidence-based programming.
*Focus:* Data analysis & visualisation • MEAL systems • Research methods & survey tools • Data-informed governance.

**4. Workforce Development, Entrepreneurship & Creative Economy**
*SDG 4 • SDG 5 • SDG 8*
Linking training directly to labour market demand and income generation through bootcamps, upskilling, mentorship, and enterprise support — with particular focus on SMEs, creatives, and youth seeking employment, freelance income, or entrepreneurship.
*Focus:* Career readiness & employability • Entrepreneurship & SME development • Digital marketing, content & graphic design • Freelancing & the creative economy.

**5. Children & Youth Technology Education**
*SDG 4 • SDG 5 • SDG 10*
Cultivating early digital readiness, computational thinking, and 21st-century creativity in children and young people — laying the foundation for long-term participation in the digital economy.
*Focus:* Programming for kids (Scratch, HTML, CSS) • VR game development • AI foundations for youth • School-based & holiday bootcamps.

**6. Gender Equality, Inclusion & Protection of Vulnerable Groups**
*SDG 5 • SDG 10 • SDG 16*
Closing the gender gap in technology and ensuring that women, girls, displacement-affected populations, persons with disabilities, and other marginalised groups are not left behind in the digital transition.
*Focus:* Women & girls in STEM • Women in Uniform programming • GBV awareness & 16 Days of Activism • Scholarships & child-safe standards.

**7. Public Sector Capacity Building & Institutional Strengthening**
*SDG 8 • SDG 16 • SDG 17*
Equipping government agencies, law enforcement, regulatory bodies, and public institutions with the digital tools, AI literacy, cybersecurity awareness, and data-driven governance practices required to improve service delivery and citizen outcomes.
*Focus:* AI & digital literacy for government • Cybersecurity for law enforcement • Data-driven decision-making • Institutional digital transformation.

**8. Climate Education, Green Digital Skills & Sustainability**
*SDG 4 • SDG 9 • SDG 13 • SDG 15*
Preparing learners and institutions for the green digital transition by integrating climate awareness, sustainable technology practices, and green-economy skills into our training and community programming.
*Focus:* Climate literacy for youth & schools • Green digital skills (sustainable computing, climate data, e-waste) • Tech for climate adaptation • Youth-led climate action.

## 6.3 Cross-Cutting Approaches block [T2]

Below the eight cards, a small five-tile band:

> **Heading:** Cross-Cutting Approaches — Applied Across Every Programme
>
> 1. **Equity & Inclusion** — Gender-responsive facilitation, scholarships for low-income learners, accessibility considerations across every programme.
> 2. **Community-Centred Delivery** — Programmes co-designed with local partners and rooted in the lived realities of North-East Nigerian communities.
> 3. **Evidence & Learning** — Pre/post assessments, MEAL systems, and a longitudinal beneficiary database tracking outcomes over multiple years.
> 4. **Safeguarding & Child Protection** — Child-safe standards, code of conduct for all trainers, zero-tolerance policies on harassment and exploitation.
> 5. **Partnerships & Multi-Sector Collaboration** — Working across government, academia, INGOs, faith-based organisations, and private sector to scale impact.

## 6.4 SDG Alignment Matrix — NEW [T2]

This is the donor-facing accountability table. Render as a styled HTML table (responsive — collapses into stacked rows on mobile).

**Heading:** SDG Alignment Matrix

**Body:** The matrix below summarises how each of our eight Thematic Areas contributes to the Sustainable Development Goals.

| Thematic Area | SDG 4 | SDG 5 | SDG 8 | SDG 9 | SDG 10 | SDG 13 | SDG 16 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1. Digital Literacy & Foundational Skills | ● | — | — | — | ● | — | ● |
| 2. Advanced Tech, Innovation & Software Eng. | ● | — | ● | ● | — | — | — |
| 3. Data, Analytics & Decision Making | — | — | ● | — | — | — | ● |
| 4. Workforce, Entrepreneurship & Creative Econ. | ● | ● | ● | — | — | — | — |
| 5. Children & Youth Tech Education | ● | ● | — | — | ● | — | — |
| 6. Gender Equality, Inclusion & Protection | — | ● | — | — | ● | — | ● |
| 7. Public Sector Capacity Building | — | — | ● | — | — | — | ● |
| 8. Climate Education & Green Digital Skills | ● | — | — | ● | — | ● | — |

*Legend: ● = Direct contribution.   — = Limited / indirect contribution.*

## 6.5 CTA — Partner With Us [T2]

End the page with a partner-focused CTA:

> **Heading:** Designing a programme that fits one of these areas?
>
> **Body:** We co-design with government, INGO, academic, and private sector partners. Tell us your goal — we will scope the work.
>
> [ Talk to Our Team ] → `/partners/`

---

# 7. IMPACT PAGE (`/impact/`) — NEW

**Status:** This page does not exist. The current "Impact" dropdown actually links to media/PR pages.

**Action:** Build a real Impact page. The current "Impact" dropdown is being renamed to **"News & Media"** (see §1.2), so this `/impact/` page sits as a clean top-level item.

## 7.1 Hero [T2]

> **Eyebrow:** OUR IMPACT
>
> **Headline:** Real numbers. Real outcomes. Documented.
>
> **Subhead:** Toko Academy tracks every cohort against documented KPIs and reports outcomes transparently to partners and donors. The figures below are drawn from internal monitoring, evaluation, and learning data covering 2023–2026.

## 7.2 Headline numbers grid [T2]

A 6-card grid (3×2 desktop; 2×3 tablet; 1×6 mobile). Use the same card style as the homepage Impact Snapshot.

```
2,000+              75%                 35+
Learners Trained    Career Progression  Partner Institutions

5                   ~43%                4+
Federal Agencies    Female Beneficiaries States Reached
Trained             Across Programmes    Physical & Virtual
```

## 7.3 MEL Framework — NEW [T2]

**Heading:** Our Monitoring, Evaluation & Learning Framework

**Body:** Toko Academy maintains a structured MEL system to track programme performance, demonstrate accountability, and continuously improve quality. Every programme runs pre- and post-training assessments; participants are surveyed at 3–6 months to capture behaviour change and economic outcomes.

**KPI table:**

| Outcome Area | Indicator | Target |
| --- | --- | :---: |
| Digital Skills | % of participants passing post-training assessment | ≥75% |
| Employment | % securing income within 6 months of training | ≥50% |
| Gender Inclusion | % of female participants per programme | ≥40% |
| Institutional Impact | % of government partners reporting improved digital tool use | ≥70% |
| Child Digital Literacy | Skills assessment score gain — kids programmes | Baseline +30% |
| Partner Satisfaction | Post-engagement satisfaction score | ≥4 / 5 |

## 7.4 Case studies — NEW [T2]

A grid of 6 case-study cards, each linking to a sub-page (or to an event entry on `/events/`). Card content:

```
1. TEDxYola 2025: AI, Culture, and Change
   Officially licensed TEDx event in North-East Nigeria.
   200+ attendees • National thought leaders • SDG 4, 17

2. AI & Digital Literacy for Government Agencies
   Structured training for officers across NSCDC, NPF, FRSC, and NMDPRA.
   4 federal agencies • November 2025 • SDG 4, 8, 16

3. Women in Uniform — IWD 2025
   International Women's Day initiative recognising women in uniformed services.
   Military • Police • NSCDC • Immigration • SDG 5, 4

4. Kids Coding Bootcamp & Summer Classes
   Project-based programming and digital creativity for ages 6–17.
   Scratch, HTML, CSS • Public project showcases • SDG 4

5. From AI Users to AI Builders (Feb 2026)
   Community-driven event shifting participants from passive AI consumption
   to active creation and local innovation.
   Students, professionals, tech enthusiasts • SDG 4, 8, 9

6. 16 Days of Activism — Safe Spaces, Strong Voices (Dec 2025)
   GBV awareness, digital safety, and youth advocacy workshop with Tent2School.
   Youth & women participants • SDG 5, 10
```

## 7.5 Voices block — pull from homepage testimonials [T2]

Reuse the three testimonials currently on the homepage, plus the federal-agency quote suggested in §2.7.

## 7.6 Beneficiary demographic snapshot [T2]

Single horizontal band:

> *"Across all programmes delivered to date, women and girls constitute approximately 43% of beneficiaries; youth aged 15–35 make up over 60%; and we have reached learners across four states physically and virtually."*

## 7.7 Annual report download [T2 / T3]

CTA at the bottom of the page:

> **Heading:** Annual Report 2026
> **Body:** A full year of programming, partnerships, and impact, in one document.
> [ Download (PDF) ]

If the 2026 Annual Report does not yet exist, link to the **TOKO Academy Profile (April 2026)** as an interim document until the formal annual report is published.

---


# 8. EVENTS PAGE (`/events/`)

**Current state:** Only 2 events listed (TEDxYola 2025, IWD 2025). The Profile documents 8 delivered events between 2023 and 2026.

## 8.1 Backfill missing events [T1]

Add the six missing events below. Use the same card style already in use. **Each entry below is ready to paste — title, date, description, beneficiaries, SDG tags.**

### Event 1 — Yola Upskill Programme

- **Date:** October 2023
- **Status:** Delivered
- **Audience:** Youth and early professionals
- **Description:** A five-week intensive programme covering Excel, data analysis, web design, and core business tools — built to drive employability and income generation among youth and early-career professionals in Adamawa State.
- **Beneficiaries:** ~25 participants
- **SDG alignment:** SDG 4, SDG 8

### Event 2 — Kids Summer Coding Classes

- **Date:** August 2025
- **Status:** Delivered
- **Audience:** Children aged 7–15
- **Description:** Hands-on coding sessions using Scratch, HTML, and CSS. Designed to build computational thinking, creativity, and early exposure to digital careers among children in Yola.
- **Beneficiaries:** Children aged 7–15
- **SDG alignment:** SDG 4

### Event 3 — AI & Digital Literacy for Government Agencies

- **Date:** November 2025
- **Status:** Delivered
- **Audience:** Federal agency personnel
- **Description:** Structured capacity-building for four national institutions, equipping personnel with practical AI tools, cybersecurity awareness, and data-driven decision-making to improve service delivery.
- **Beneficiaries:** Officers from NSCDC, FRSC, NPF, and NMDPRA
- **SDG alignment:** SDG 4, SDG 8, SDG 16

### Event 4 — 16 Days of Activism: Safe Spaces, Strong Voices

- **Date:** December 2025
- **Status:** Delivered
- **Audience:** Youth and women participants
- **Description:** A workshop in partnership with Tent2School Initiative, creating a safe space for GBV awareness, digital safety, and youth advocacy. Directly contributing to the Generation Equality Forum gender inclusion agenda.
- **Beneficiaries:** Youth and women participants
- **SDG alignment:** SDG 5, SDG 10

### Event 5 — From AI Users to AI Builders

- **Date:** February 2026
- **Status:** Delivered
- **Audience:** Students, professionals, and tech enthusiasts
- **Description:** A community-driven event shifting participants from passive AI consumption to active creation — inspiring local innovation and real-world application of emerging technologies in North-East Nigeria.
- **Beneficiaries:** Students, professionals, tech enthusiasts
- **SDG alignment:** SDG 4, SDG 8, SDG 9

### Event 6 — Kids Coding Bootcamp

- **Date:** April 2026
- **Status:** Delivered
- **Audience:** Young learners
- **Description:** An immersive bootcamp in programming, digital creativity, and problem-solving. Participants built real applications and games through project-based learning — culminating in a public project showcase.
- **Beneficiaries:** Young learners (ages 7–15)
- **SDG alignment:** SDG 4

## 8.2 Event card structure [T1]

Standardise every event card with these fields:

```
[Event hero image]
[Status pill: Delivered / Upcoming]   [Date]
[Event title]
[1–2 sentence description]
[Beneficiaries: line]
[SDG icons row]
[ Read more → ]  [ View photos → ]
```

## 8.3 Upcoming events feed [T2]

Add a clearly separated "Upcoming Events" section above "Past Events." Even if there are no confirmed events, the section frame builds anticipation. If empty, show: *"Next event announcements coming soon — subscribe to our newsletter to be notified."*

## 8.4 Existing events — no copy changes [T1]

Keep the current TEDxYola 2025 and IWD 2025 entries exactly as they are. They are well-written.

---

# 9. CONTACT PAGE (`/contact/`)

**Current state:** Phone numbers and email correct. Address wrong. Three office cards (Yola plus "Under Maintenance" Abuja and Kaduna). No working contact form.

## 9.1 Address fix [T1]

Replace `No. 2 Bekaji Road, Bekaji, Yola, Jimeta 640261, Adamawa` with the official address (see §1.4).

## 9.2 Remove Abuja and Kaduna cards [T1]

See §1.5 for the full reasoning. Two options — pick one with the founder:

- **Option A (recommended):** Remove both cards entirely.
- **Option B:** Reword to "Opening soon — register interest" and link to a real waitlist form.

## 9.3 Add a working contact form [T3]

The current page tells visitors to "contact us directly via phone, email, or WhatsApp." Add a real form. Three routed forms (or one form with a "Reason for enquiry" dropdown):

**Form: General Enquiry**
- Name * • Email * • Phone (optional) • Message *

**Form: Training Enrolment**
- Name * • Email * • Phone (optional) • Programme of interest (dropdown of all courses) • Preferred start date

**Form: Partnership / Donor Enquiry**
- (Use the Partners page form — see §4.6)

All form submissions route to `info@tokoacademy.org`.

## 9.4 Add embedded Google Map [T2]

Below the contact card, embed a Google Map iframe pinned to the Bekaji Road office. Use the official address. Link the pin label to "Toko Academy — Yola Headquarters."

## 9.5 Office hours — keep [T1]

Keep the current office hours. Working correctly.

## 9.6 Add WhatsApp click-to-chat — keep [T1]

The existing `wa.me/2348088256055` link works well. Keep it as is.

---

# 10. CORPORATE PAGE (`/corporate/`)

**Current state:** Generic services list. Does not reference the federal agencies you have actually trained.

## 10.1 Add a "Trusted By" band near the top [T1]

Insert this between the hero and the existing "Our Services" block:

> **Heading:** Trusted by Federal Agencies and Institutional Partners
>
> **Body:** Toko Academy has delivered structured AI literacy, cybersecurity awareness, and digital skills training to officers and personnel across the **Nigeria Security & Civil Defence Corps (NSCDC), the Nigeria Police Force (NPF), the Federal Road Safety Corps (FRSC), and the Nigerian Midstream & Downstream Petroleum Regulatory Authority (NMDPRA)**, alongside academic and international partners including the **American University of Nigeria** and the **U.S. Embassy's American Space Yola** programme.

Display logos of those partners in a small horizontal strip below the paragraph.

## 10.2 Replace generic "Our Services" copy [T2]

Keep the three-card structure (Corporate Training Programs / Professional Workshops / IT Consultation) but rewrite the descriptions to reference real engagement types:

**Corporate Training Programs**
*"Customised, multi-session capacity-building for organisations and government agencies. Recent engagements include AI and digital literacy training for federal agency personnel, structured around your operational priorities and delivered on-site or remotely."*

**Professional Workshops & Seminars**
*"Intensive single-session or short-format workshops on specific tools and topics — AI in the workplace, cybersecurity awareness, data-driven decision-making — designed for working professionals with limited training time."*

**IT Consultation & Strategy**
*"Strategic guidance for institutional digital transformation: technology needs assessments, ICT systems support, digital workflow design, and roadmap development — drawing on our delivery experience across government, INGO, and academic environments."*

## 10.3 Existing "Benefits" and "How It Works" — keep [T1]

The current Benefits and How It Works sections are fine. No changes.

## 10.4 Final CTA — refresh [T2]

> **Heading:** Bring this to your team.
> **Body:** Tell us your training goals and audience — we will scope a programme.
> **Buttons:** [ Talk to Our Team ] [ See Past Government Engagements → /impact/ ]

---

# 11. KIDS PAGE (`/kids/`)

**Current state:** Two programmes (Weekend Coding Classes, CBT). Clean layout. Could expand.

## 11.1 Expand programme list [T2]

Add at least two more programmes from the Thematic Areas document:

**VR Game Development**
- *Age range:* 12–17
- *What they'll learn:* 3D space basics, simple game logic, VR storytelling, project-based building
- *Schedule:* School holidays / weekends

**AI Foundations for Youth**
- *Age range:* 13–17
- *What they'll learn:* What AI actually is, how to use AI tools responsibly, prompt design, simple AI projects, ethics & safety
- *Schedule:* Weekends or school holidays

## 11.2 Add safeguarding strip [T1]

The Kids page should have a small, reassuring safeguarding line near the top:

> *"All Kids & Youth Technology programmes operate under documented child-safe facilitation standards, supervision ratios, and a code of conduct for all trainers — aligned with international NGO safeguarding requirements. Detailed safeguarding policies are available to parents and partners on request."*

## 11.3 Add parent FAQ block [T3]

A short collapsed FAQ section: "How long is each class?" "What does my child need to bring?" "How are trainers vetted?" "What happens at the end of the programme?" etc.

## 11.4 Existing "Why Enroll Your Child?" — keep [T1]

Keep the benefits section as-is.

---

# 12. NEWS PAGE (`/news/`) — minor updates only

**Current state:** Best page on the site. Real Code.org press release. Strong "4 Myths About Tech Education in Northern Nigeria" post. Tone is on-brand.

## 12.1 No structural changes [T1]

Keep as-is.

## 12.2 Promote the Code.org partnership [T1]

The Code.org partnership is currently announced **only** in the press release. Surface it in two more places:

- Homepage partner logo wall (see §2.6 — already in the list).
- Partners page logo wall (see §4.2, Group 3 — already in the list).
- About page reference: in §3.2 "How We Deliver," add a sentence — *"In January 2026, Toko Academy joined the Code.org Global Partner Community to expand world-class AI and computer science education in North-East Nigeria."*

## 12.3 Set publishing cadence [T4]

Aim for one post per month minimum. Practical content categories already working: regional analysis (the "4 Myths" piece), partnership announcements, beneficiary stories, programme recaps.

---

# 13. TECH & SEO CHECKLIST

These are platform-level items, not page-level. Most are quick wins.

## 13.1 Page titles & meta descriptions [T2]

Write manual page titles and meta descriptions for every page. Examples:

| Page | Suggested page title (≤ 60 chars) | Meta description (≤ 155 chars) |
| --- | --- | --- |
| `/` | Toko Academy — Skills for Tomorrow \| Yola, Nigeria | Nigerian-incorporated digital skills organisation training youth, professionals, government, and children for the digital economy. |
| `/about/` | About Toko Academy — CAC-Registered Digital Skills Organisation | Toko Academy Ltd. is a Nigerian-incorporated workforce development organisation headquartered in Yola, Adamawa State. Learn about our mission and team. |
| `/partners/` | Our Partners — Federal Agencies, Universities & INGOs \| Toko Academy | Trusted by NSCDC, NPF, FRSC, NMDPRA, American University of Nigeria, the U.S. Embassy, Tent2School, and the Code.org Global Partner Network. |
| `/thematic-areas/` | Eight Thematic Areas — SDG-Aligned Programmes \| Toko Academy | Eight strategic pillars of digital skills programming, mapped to UN Sustainable Development Goals 4, 5, 8, 9, 10, 13, 16, and 17. |
| `/impact/` | Our Impact — 2,000+ Trained, 35+ Partners, 5 Federal Agencies | Verified outcomes, MEL framework, KPIs, and case studies from Toko Academy's 2023–2026 programming across North-East Nigeria. |
| `/courses/` | Programmes & Courses — AI, Data, Software, Digital Skills \| Toko Academy | Industry-relevant courses across six Schools: AI, Software Engineering, Data Science, Digital Media, Digital Literacy, and Kids & Youth Tech. |
| `/contact/` | Contact Toko Academy — Yola, Adamawa State, Nigeria | Get in touch with Toko Academy. Headquartered at No. 1A Bekaji Road, Jimeta, Yola. Phone, email, WhatsApp, or visit our office. |

## 13.2 Schema.org structured data [T2]

The site already uses some schema markup (Events, Organization, Blog) — good. Add:

- `EducationalOrganization` schema on `/` and `/about/` (with founder, address, foundingDate, sameAs links to social).
- `Course` schema on every course detail page (with provider, courseCode, educationalLevel, instructor when available).
- `Person` schema on the leadership team cards (with jobTitle, sameAs LinkedIn).

## 13.3 Google Business Profile [T2]

Create / claim a Google Business Profile for No. 1A Bekaji Road, Jimeta, Yola. Add photos, hours, phone link, website link. This is the single highest-leverage local-SEO action.

## 13.4 Analytics & Search Console [T1]

- Verify the property in **Google Search Console**.
- Confirm **Google Analytics 4** (or equivalent) is firing on every page.
- Submit `sitemap.xml` to Search Console.

## 13.5 Open Graph / social cards [T2]

Confirm every page has correct OG tags so links shared on WhatsApp, LinkedIn, and X preview with the Toko logo and a clean title/description. Particularly important for the press releases.

## 13.6 Performance [T2]

- Compress every photo to WebP (with a JPEG fallback).
- Lazy-load below-the-fold images.
- Target Lighthouse mobile score ≥ 90 on the homepage and About page.

## 13.7 Accessibility (WCAG 2.1 AA) [T2]

- Verify colour contrast on the navy + green palette (the lime green on white may need to darken for AA-compliant body text).
- Confirm every image has descriptive `alt` text (not "Image coming soon").
- Confirm keyboard navigation works through the dropdowns, audience selector, and forms.
- Add a "Skip to main content" link at the top.

## 13.8 Privacy & data [T1]

- Confirm the existing Privacy Policy and Terms pages reflect Nigerian NDPR requirements.
- If a contact form is added, declare data handling explicitly under the form fields ("By submitting, you consent to Toko Academy contacting you about your enquiry. We do not share your data with third parties.").

---

# 14. ASSET LIST — what the team needs from Toko

The implementation work above depends on the assets below. Recommend the founder schedules a **single half-day photo session** to produce most of these.

## 14.1 Logos required [T1]

For the Partners page logo wall, the team needs partner logos in PNG with transparent backgrounds. If logos cannot be obtained, a clean wordmark on a white card is acceptable.

```
Federal:
[ ] NSCDC logo
[ ] NPF (Nigeria Police Force) logo
[ ] FRSC logo
[ ] NMDPRA logo

Academic & International:
[ ] American University of Nigeria (AUN) logo
[ ] American Space Yola (U.S. Embassy programme) logo
[ ] Code.org Global Partner Community logo

INGO & Community:
[ ] Tent2School Initiative logo
[ ] The Timothy Initiative logo
[ ] Concordia Junior Academy Yola logo
[ ] Family Worship Centre Yola logo
```

## 14.2 Photography required [T2]

```
[ ] Six leadership headshots — same background, same lighting
[ ] Hero image: a current cohort in session at the Bekaji Road office
[ ] Building exterior — Bekaji Road office, daylight
[ ] At least 4 course-in-progress shots (one per major School)
[ ] Kids coding session photo (faces obscured or with parental consent)
[ ] TEDxYola 2025 — at least one strong stage shot
[ ] At least one government training session photo
```

## 14.3 PDFs required [T1]

```
[ ] Toko Academy Profile (April 2026) — for the "Download Our Profile" CTA
[ ] Thematic Areas brochure — for the Thematic Areas page resource link
[ ] Simplified Organogram — for the About page resource link
[ ] Annual Report 2026 (when available — placeholder until then)
```

## 14.4 SDG icons [T2]

Download the official UN SDG icons from https://www.un.org/sustainabledevelopment/news/communications-material/. Use the colour SVG versions for the Thematic Areas page and the colour PNGs for the homepage SDG strip.

---

# 15. ROLLOUT SCHEDULE

A practical phasing plan for the team:

## Week 1 — Tier 1 fixes (credibility)

- §1.4 Address fix sitewide
- §1.5 Remove Abuja/Kaduna office cards
- §1.6 Reconcile statistics
- §1.7 Add "Skills for Tomorrow" eyebrow on homepage
- §2.6 Build homepage partner logo strip (using whatever logos are available immediately)
- §4.1–4.5 Build Partners logo wall
- §5.1 Fix course catalogue typos and missing descriptions
- §8.1 Backfill 6 missing events
- §9.1 Fix Contact page address
- §1.3 Update footer (CAC line, full address)

## Weeks 2–3 — Tier 2 rebuilds

- §3 Full About page rebuild (incl. team, Theory of Change, Governance & Safeguarding)
- §6 Build new Thematic Areas page
- §7 Build new Impact page
- §1.2 Implement new navigation (rename Impact → News & Media, add Thematic Areas, add Impact)
- §2.5 Refresh "Why Toko Academy" pillars
- §2.8 Add SDG strip to homepage
- §10 Refresh Corporate page
- §11.1 Expand Kids programme list

## Week 4 — Tier 3 forms and detail pages

- §4.6 Build Become a Partner form
- §9.3 Build Contact forms (general / training enrolment / partnership)
- §9.4 Embed Google Map on Contact page
- §5.3 Build out 3–4 flagship course detail pages

## Ongoing — Tier 4

- §12.3 Maintain News cadence
- §13 SEO and analytics review quarterly
- Photograph every cohort going forward
- Add new partnerships to logo wall as they are secured

---

# 16. SIGN-OFF CHECKLIST

Before each tier is marked complete, founder confirms:

```
TIER 1
[ ] Address is correct sitewide (No. 1A Bekaji Road, Adjacent to YEDC S/C Office)
[ ] Footer shows CAC registration line
[ ] Statistics match the Profile (no contradictions across pages)
[ ] All 11 partner logos are visible on the Partners page
[ ] Homepage shows at least 8 partner logos
[ ] Course catalogue has no typos and no empty descriptions
[ ] All 8 events are listed on /events/
[ ] No "Under Maintenance" or "Temporarily Closed" copy anywhere

TIER 2
[ ] About page reflects the 2026 organisation in full
[ ] All 6 leadership team members shown with consistent headshots
[ ] Theory of Change diagram is rendered
[ ] Thematic Areas page is live with all 8 areas and the SDG matrix
[ ] Impact page is live with KPI table and 6 case studies
[ ] Navigation includes Thematic Areas and Impact as top-level items
[ ] News & Media dropdown contains the former "Impact" links
[ ] Homepage SDG strip is live with all 8 official UN icons

TIER 3
[ ] Three contact forms are working and routing to info@tokoacademy.org
[ ] Become a Partner form is live
[ ] Google Map embedded on Contact page
[ ] At least 4 course detail pages are fully built out

TIER 4 — ongoing
[ ] One news/blog post per month
[ ] Cohort photography updated quarterly
[ ] Quarterly SEO and analytics review held
```

---

*Brief prepared from: TOKO Academy Profile (April 2026), Organogram v2 Model B, Thematic Areas (April 2026), and a live audit of tokoacademy.org as of 5 May 2026.*

*Questions, clarifications, or sign-off: Daniel Ishaku — info@tokoacademy.org*
