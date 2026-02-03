# Toko Academy Website v2

A production-ready, super-fast, lightweight, fully responsive static website for Toko Academy built with Next.js (App Router) and Static Site Generation (SSG).

## Features

- ⚡️ **Lightning Fast**: Next.js SSG with optimized images and minimal JavaScript
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- 🎨 **Modern Design**: Clean, bold typography with sharp edges inspired by modern web standards
- ♿️ **Accessible**: Semantic HTML5 with ARIA attributes
- 🔍 **SEO Optimized**: Complete metadata, OpenGraph tags, and JSON-LD structured data
- 🌍 **Low-Bandwidth Friendly**: Optimized for regions with poor internet connectivity
- 🎯 **Static Export**: 100% static HTML for ultra-fast hosting anywhere

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom brand tokens
- **Language**: TypeScript
- **Deployment**: Static export ready for any hosting platform

## Brand Colors

- **Green**: #7CB342 (Primary)
- **Yellow**: #FFC107 (Accent)
- **Magenta**: #E91E63 (Accent)
- **Blue**: #2196F3 (Accent)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This generates a fully static website in the `/out` directory.

### Preview Production Build

```bash
npm run start
```

## Project Structure

```
├── public/              # Static assets (images, logo, etc.)
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # Reusable React components
│   ├── data/           # Static data (courses, testimonials, etc.)
│   └── types/          # TypeScript type definitions
├── tailwind.config.ts  # Tailwind configuration with brand colors
└── next.config.js      # Next.js configuration
```

## Contact Information

- **Phone**: +234 808 825 6055, +234 812 856 1493
- **Website**: https://tokoacademy.org
- **Logo**: https://tokoacademy.org/logo/ta_logo_png.png

## Deployment

The site is configured for static export and can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

Simply upload the contents of the `/out` directory after building.

## Performance Optimizations

- Image optimization with WebP/AVIF formats
- Lazy loading for non-critical images
- Preloading of key assets
- Minimal client-side JavaScript
- System fonts for instant text rendering
- Responsive images with srcset

## License

© 2026 Toko Academy. All rights reserved.
