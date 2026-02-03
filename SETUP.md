# Toko Academy Website - Complete Setup Guide

## 📋 Project Overview

A production-ready, super-fast, lightweight, fully responsive static website for Toko Academy built with:
- **Next.js 14** (App Router with Static Site Generation)
- **TypeScript** for type safety
- **Tailwind CSS** with custom brand colors
- **Optimized for low-bandwidth** regions
- **SEO-ready** with metadata and structured data

## 🎨 Brand Colors

Extracted from the Toko Academy logo:
- **Green**: `#7CB342` (Primary)
- **Yellow**: `#FFC107` (Accent)
- **Magenta**: `#E91E63` (Accent)
- **Blue**: `#2196F3` (Accent)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Open browser**
Navigate to http://localhost:3000

### Build for Production

```bash
npm run build
```

This generates a fully static website in the `/out` directory.

## 📁 Project Structure

```
tokoacademy.org_v2/
├── public/                    # Static assets
│   ├── images/               # Images directory
│   │   └── hero/            # Hero slider images
│   ├── robots.txt           # Search engine instructions
│   └── site.webmanifest     # PWA manifest
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with Header/Footer
│   │   ├── page.tsx         # Home page
│   │   ├── about/           # About page
│   │   ├── courses/         # Courses page
│   │   ├── kids/            # Kids programs page
│   │   ├── corporate/       # Corporate training page
│   │   ├── contact/         # Contact page
│   │   ├── privacy/         # Privacy policy
│   │   ├── terms/           # Terms of service
│   │   ├── sitemap.ts       # XML sitemap generator
│   │   ├── robots.ts        # Robots.txt generator
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable components
│   │   ├── layout/          # Header, Footer
│   │   └── home/            # Home page sections
│   ├── data/                # Static data files
│   │   ├── courses.ts       # Course information
│   │   ├── testimonials.ts  # Testimonials & stats
│   │   └── config.ts        # Contact info & navigation
│   └── types/               # TypeScript definitions
├── tailwind.config.ts       # Tailwind configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies
```

## 🖼️ Image Setup

### Required Images

Place these images in `public/images/hero/`:
- `slide1.jpg` (1920x1080) - Main hero image
- `slide2.jpg` (1920x1080) - Industry courses
- `slide3.jpg` (1920x1080) - Hands-on training
- `slide4.jpg` (1920x1080) - Kids programs

Place these in `public/`:
- `og-image.png` (1200x630) - Social sharing image
- `favicon.ico` - Browser icon
- `apple-touch-icon.png` (180x180) - iOS icon
- `icon-192.png` (192x192) - PWA icon
- `icon-512.png` (512x512) - PWA icon

### Image Optimization Tips

1. Use WebP format for better compression
2. Compress images with TinyPNG or Squoosh
3. Target file sizes: Hero images < 200KB each
4. Use progressive JPEGs

## 🔧 Configuration

### Update Contact Information

Edit `src/data/config.ts`:
```typescript
export const contactInfo = {
  phones: ['+234 808 825 6055', '+234 812 856 1493'],
  email: 'info@tokoacademy.org',
  address: 'Your full address here',
  socialMedia: {
    facebook: 'your-facebook-url',
    instagram: 'your-instagram-url',
    // ... update all links
  }
};
```

### Update External Links

In `src/data/config.ts`:
```typescript
export const externalLinks = {
  applyNow: 'https://tokoacademy.org/apply',
  blog: 'https://tokoacademy.org/blog',
  wordpressForm: 'https://tokoacademy.org/application-form'
};
```

### Customize Courses

Edit `src/data/courses.ts` to add/remove/modify courses.

### Update Testimonials

Edit `src/data/testimonials.ts` to add real testimonials.

## 📦 Deployment

### Deploy to Netlify (Recommended)

1. Push code to GitHub
2. Connect repository to Netlify
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
4. Deploy!

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to GitHub Pages

1. Build the site: `npm run build`
2. Push the `out` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Deploy to Any Static Host

1. Run `npm run build`
2. Upload contents of `/out` directory to your hosting provider
3. Configure your domain DNS

## 🎯 SEO Checklist

✅ All pages have unique titles and meta descriptions
✅ OpenGraph images for social sharing (1200x630)
✅ XML sitemap auto-generated
✅ Robots.txt configured
✅ Structured data (JSON-LD) for Organization
✅ Semantic HTML5 markup
✅ Alt text for images
✅ Mobile-friendly responsive design

## 🚀 Performance Features

- **Static Generation**: All pages pre-rendered at build time
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Ready for Next.js Image component
- **Minimal JavaScript**: Lightweight client-side code
- **CSS Optimization**: Tailwind CSS with PurgeCSS
- **Lazy Loading**: Non-critical images load on demand
- **Prefetching**: Links prefetched on hover
- **Caching**: Static assets cached by default

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔍 Testing

### Lighthouse Scores Target
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Test Checklist
- [ ] Test on mobile devices
- [ ] Test all navigation links
- [ ] Test external links (Apply Now, Blog)
- [ ] Test on slow 3G connection
- [ ] Verify all images load
- [ ] Check form accessibility
- [ ] Test keyboard navigation
- [ ] Validate HTML
- [ ] Test social sharing previews

## 🛠️ Maintenance

### Regular Updates
- Update course information in `src/data/courses.ts`
- Add new testimonials in `src/data/testimonials.ts`
- Update statistics as they grow
- Keep dependencies updated: `npm update`

### Content Updates
All content is in TypeScript files under `src/data/`. No need to touch React components for content changes.

## 📞 Support

For technical issues or questions:
- Email: info@tokoacademy.org
- Phone: +234 808 825 6055

## 📄 License

© 2026 Toko Academy. All rights reserved.

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Add your images to `public/images/`
3. ✅ Update contact information in `src/data/config.ts`
4. ✅ Customize course details in `src/data/courses.ts`
5. ✅ Add real testimonials in `src/data/testimonials.ts`
6. ✅ Test locally: `npm run dev`
7. ✅ Build for production: `npm run build`
8. ✅ Deploy to your hosting platform

**Your website is ready to launch! 🎉**
