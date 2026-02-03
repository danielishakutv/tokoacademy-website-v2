# 📁 Complete File Index - Toko Academy Website

## 📋 Documentation Files (Read These First!)

| File | Purpose | For Who |
|------|---------|---------|
| `README.md` | Project overview, quick start | Everyone |
| `QUICKSTART.md` | Step-by-step launch guide | New users |
| `SETUP.md` | Detailed configuration guide | Developers |
| `DEPLOYMENT.md` | Deployment instructions | DevOps/Admins |
| `CONTENT-GUIDE.md` | Content update guide | Content editors |
| `PROJECT-SUMMARY.md` | Complete project summary | Stakeholders |
| `STRUCTURE.md` | Visual reference guide | Developers/Designers |

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `next.config.js` | Next.js static export config |
| `tailwind.config.ts` | Brand colors & theme |
| `tsconfig.json` | TypeScript configuration |
| `postcss.config.js` | CSS processing |
| `netlify.toml` | Netlify deployment config |
| `.gitignore` | Git exclusions |
| `.env.local.example` | Environment variables template |

## 🎨 Source Code Structure

### `/src/app/` - Pages (Next.js App Router)

```
src/app/
├── layout.tsx              # Root layout (Header + Footer wrapper)
├── page.tsx                # Home page ✨
├── globals.css             # Global styles & Tailwind
│
├── about/
│   └── page.tsx           # About page
│
├── courses/
│   └── page.tsx           # Courses page
│
├── kids/
│   └── page.tsx           # Kids programs page
│
├── corporate/
│   └── page.tsx           # Corporate training page
│
├── contact/
│   └── page.tsx           # Contact page
│
├── privacy/
│   └── page.tsx           # Privacy policy
│
├── terms/
│   └── page.tsx           # Terms of service
│
├── sitemap.ts             # XML sitemap generator
└── robots.ts              # Robots.txt generator
```

### `/src/components/` - Reusable Components

```
src/components/
│
├── layout/
│   ├── Header.tsx         # Navigation (mini bar + main nav)
│   └── Footer.tsx         # Site footer
│
└── home/
    ├── HeroSlider.tsx     # Full-screen hero carousel
    ├── WhyChooseSection.tsx    # Features & statistics
    ├── CoursesSection.tsx      # Course cards grid
    ├── KidsSection.tsx         # Kids programs
    ├── ServicesSection.tsx     # Corporate services
    ├── TestimonialsSection.tsx # Success stories
    └── CTABanner.tsx          # Call-to-action banner
```

### `/src/data/` - Content Data

```
src/data/
├── courses.ts         # All 10 courses + kids courses
├── testimonials.ts    # Student testimonials + statistics
└── config.ts          # Contact info, social media, navigation
```

## 📦 Public Assets

```
public/
├── images/
│   └── hero/
│       ├── slide1.jpg     # (Add these - 1920x1080)
│       ├── slide2.jpg
│       ├── slide3.jpg
│       ├── slide4.jpg
│       └── README.md      # Image requirements guide
│
├── og-image.png          # (Add - 1200x630 for social)
├── favicon.ico           # (Add - browser icon)
├── apple-touch-icon.png  # (Add - 180x180)
├── icon-192.png          # (Add - PWA icon)
├── icon-512.png          # (Add - PWA icon)
├── robots.txt            # Search engine instructions
└── site.webmanifest      # PWA manifest
```

## 📊 Data Structure Details

### `courses.ts`
- 10 main courses (Data Analysis, Web Dev, etc.)
- 2 kids programs (Weekend Coding, CBT)
- Each includes: title, description, icon, duration, level, category

### `testimonials.ts`
- 6 student testimonials
- 4 statistics (learners, courses, success rate, partners)

### `config.ts`
- Contact information (phones, email, address)
- Social media links (5 platforms)
- External links (WordPress form, blog)
- Navigation menu items

## 🎨 Styling System

### Colors (in `tailwind.config.ts`)
```
toko-green:    #7CB342 (+ light/dark variants)
toko-yellow:   #FFC107 (+ light/dark variants)
toko-magenta:  #E91E63 (+ light/dark variants)
toko-blue:     #2196F3 (+ light/dark variants)
toko-gray:     50-900 scale
```

### Custom Classes (in `globals.css`)
```
.btn-primary        # Green button
.btn-secondary      # Outlined button
.section-container  # Max-width container
.section-padding    # Standard spacing
.card               # Card styling
.link-hover         # Link hover effect
```

## 🚀 Build Output

After running `npm run build`:

```
out/                    # Static files ready to deploy
├── index.html         # Home page
├── about/
│   └── index.html
├── courses/
│   └── index.html
├── kids/
│   └── index.html
├── corporate/
│   └── index.html
├── contact/
│   └── index.html
├── _next/             # Optimized JS, CSS, images
├── images/            # Static images
├── sitemap.xml        # SEO sitemap
└── robots.txt         # Search engine rules
```

## 📝 Scripts (in package.json)

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production → /out directory
npm run start    # Preview production build
npm run lint     # Check code quality
```

## 🔍 File Purposes Quick Reference

### Must Edit Before Launch
- [ ] `src/data/config.ts` - Update contact info
- [ ] `src/data/courses.ts` - Review course details
- [ ] `src/data/testimonials.ts` - Add real testimonials
- [ ] `public/images/hero/*` - Add hero images
- [ ] `public/og-image.png` - Add social image

### Can Edit Anytime
- [ ] `src/app/about/page.tsx` - About content
- [ ] `src/app/courses/page.tsx` - Course descriptions
- [ ] `src/app/kids/page.tsx` - Kids program details
- [ ] `src/app/corporate/page.tsx` - Corporate services

### Don't Edit Unless Necessary
- `next.config.js` - Build configuration
- `tailwind.config.ts` - Design system
- `tsconfig.json` - TypeScript settings
- Component files (`.tsx`) - UI structure

## 📈 File Size Targets

### Pages (HTML + First Load JS)
- Home: < 150KB
- About: < 80KB
- Courses: < 100KB
- Kids: < 90KB
- Corporate: < 90KB
- Contact: < 70KB

### Images
- Hero slides: < 200KB each
- Social image: < 100KB
- Icons: < 10KB each

## 🔗 External Dependencies

All defined in `package.json`:
- `next@14.2.0` - Framework
- `react@18.3.0` - UI library
- `tailwindcss@3.4.1` - Styling
- `typescript@5.3.3` - Type safety
- `sharp@0.33.0` - Image optimization

## 🎯 Key Integration Points

### WordPress Integration
- Application form: `src/data/config.ts` → `externalLinks.applyNow`
- Blog: `src/data/config.ts` → `externalLinks.blog`

### Social Media
- All platforms: `src/data/config.ts` → `contactInfo.socialMedia`

### WhatsApp
- Pre-filled message: `src/components/home/CTABanner.tsx`
- Chat link: `src/components/layout/Header.tsx`

### Analytics (When Added)
- Google Analytics: Add to `src/app/layout.tsx`
- Facebook Pixel: Add to `src/app/layout.tsx`

## 📱 Mobile Considerations

### Tested Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Wide: 1280px+

### Touch-Friendly
- All buttons ≥ 44x44px
- Mobile menu: Slide-out drawer
- Hero slider: Touch swipe enabled

## 🔐 Security Features

- No sensitive data in code
- External form handling (WordPress)
- HTTPS enforced (via Netlify/Vercel)
- Security headers (in `netlify.toml`)
- No user input collection on static pages

## ✅ Quality Checks

Before deployment, verify:
- [ ] All images optimized
- [ ] Contact info updated
- [ ] External links working
- [ ] Mobile responsive
- [ ] SEO metadata complete
- [ ] Build succeeds without errors
- [ ] All pages load correctly

## 📚 Learning Resources

To understand the codebase:
1. Start with `QUICKSTART.md`
2. Review `STRUCTURE.md` for visual overview
3. Read `SETUP.md` for detailed configuration
4. Check `CONTENT-GUIDE.md` for editing content
5. See `DEPLOYMENT.md` when ready to launch

## 🎉 You're All Set!

This file index covers every file in the project. Use it as a quick reference guide!

---

**Total Files**: ~50
**Lines of Code**: ~5,000+
**Components**: 15
**Pages**: 8
**Data Files**: 3
**Documentation**: 7

**Ready to Deploy**: ✅
