# Content Management Guide for Toko Academy Website

This guide helps non-technical team members update website content without touching code.

## 📝 Quick Content Updates

### Update Course Information

**File**: `src/data/courses.ts`

To add a new course:
```typescript
{
  id: 'new-course-id',
  title: 'New Course Name',
  description: 'Brief description of what students will learn',
  icon: '📚', // Choose an emoji icon
  duration: '12 weeks',
  level: 'Beginner to Advanced',
  category: 'Category Name'
}
```

To modify existing course: Find the course by title and update the fields.

### Update Testimonials

**File**: `src/data/testimonials.ts`

To add a new testimonial:
```typescript
{
  id: '7',
  name: 'Student Name',
  role: 'Their Job Title',
  content: 'Their testimonial quote here',
  course: 'Course they took (optional)'
}
```

### Update Statistics

**File**: `src/data/testimonials.ts`

Find the `statistics` array:
```typescript
export const statistics: Statistic[] = [
  {
    value: '2,000+',  // Update this number
    label: 'Learners Trained'
  },
  // ... update others as needed
];
```

### Update Contact Information

**File**: `src/data/config.ts`

```typescript
export const contactInfo = {
  phones: ['+234 808 825 6055', '+234 812 856 1493'],
  email: 'info@tokoacademy.org',
  address: 'Your full address',
  socialMedia: {
    facebook: 'https://facebook.com/tokoacademy',
    instagram: 'https://instagram.com/tokoacademy',
    twitter: 'https://twitter.com/tokoacademy',
    linkedin: 'https://linkedin.com/company/tokoacademy',
    whatsapp: 'https://wa.me/2348088256055'
  }
};
```

### Update External Links

**File**: `src/data/config.ts`

```typescript
export const externalLinks = {
  applyNow: 'https://tokoacademy.org/apply',
  blog: 'https://tokoacademy.org/blog',
  wordpressForm: 'https://tokoacademy.org/application-form'
};
```

## 🖼️ Update Images

### Hero Slider Images

1. Prepare 4 images (1920x1080 pixels)
2. Name them: `slide1.jpg`, `slide2.jpg`, `slide3.jpg`, `slide4.jpg`
3. Place in: `public/images/hero/`
4. Optimize images before uploading (use TinyPNG.com)

### Social Sharing Image

1. Create image (1200x630 pixels)
2. Name it: `og-image.png`
3. Place in: `public/`

### Logo

The logo is pulled from: `https://tokoacademy.org/logo/ta_logo_png.png`

To use a local logo:
1. Place logo in `public/`
2. Update `src/components/layout/Header.tsx` line with logo image

## 📄 Update Page Content

### Update About Page

**File**: `src/app/about/page.tsx`

Look for sections like:
```typescript
<p className="text-lg text-toko-gray-600 leading-relaxed">
  Your mission statement text here
</p>
```

### Update Hero Slider Text

**File**: `src/components/home/HeroSlider.tsx`

Find the `slides` array and update:
```typescript
{
  id: 1,
  title: 'Your Headline',
  subtitle: 'Your Subtitle',
  description: 'Your description text',
  // ... other properties
}
```

## 🔄 Publishing Changes

### Using Git (Recommended)

1. Save your changes
2. Open terminal/command prompt
3. Run:
   ```bash
   git add .
   git commit -m "Updated courses/testimonials/content"
   git push
   ```
4. Site automatically rebuilds (if using Netlify/Vercel)

### Manual Method

1. Save your changes
2. Run: `npm run build`
3. Upload `/out` folder contents to your hosting

## ✅ Testing Changes Locally

Before publishing:

1. Save your changes
2. Run: `npm run dev`
3. Open: http://localhost:3000
4. Check that changes appear correctly
5. Test on mobile view (resize browser)

## 🚫 What NOT to Change

**Avoid editing these unless you know what you're doing:**
- Files ending in `.tsx` except data files
- `tailwind.config.ts`
- `next.config.js`
- `package.json`
- Any files in `node_modules/`

## 📱 Social Media Integration

### Facebook Pixel (if needed)

Add to `src/app/layout.tsx` before closing `</head>`:
```tsx
<Script id="facebook-pixel">
  {`!function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');`}
</Script>
```

### Google Analytics

Add to `src/app/layout.tsx` before closing `</head>`:
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR_GA_ID');
  `}
</Script>
```

## 🎨 Color Reference

Brand colors used throughout the site:
- **Primary Green**: `#7CB342` - Main call-to-action buttons
- **Accent Yellow**: `#FFC107` - Highlights and accents
- **Accent Magenta**: `#E91E63` - Kids section, emphasis
- **Accent Blue**: `#2196F3` - Links, secondary elements

## 📧 Email Setup

To receive form submissions (when forms are added):
1. Set up email forwarding for `info@tokoacademy.org`
2. Or integrate with form service like Formspree
3. Update email in contact information

## 🆘 Common Issues

### "Module not found" error
```bash
npm install
```

### Changes not showing
```bash
# Clear cache and rebuild
rm -rf .next
npm run dev
```

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

## 📞 Need Help?

- Technical Issues: Contact your web developer
- Content Questions: Review this guide
- Urgent Issues: info@tokoacademy.org

## 🔐 Backup Checklist

Before major changes:
- [ ] Create Git commit
- [ ] Note what you're changing
- [ ] Test locally first
- [ ] Keep backup of changed files

## 📚 Resources

- **Markdown Guide**: https://www.markdownguide.org/
- **Image Optimization**: https://tinypng.com/
- **Emoji List**: https://emojipedia.org/
- **Color Picker**: https://htmlcolorcodes.com/

---

Remember: **Always test locally before publishing!**

Run `npm run dev` and check http://localhost:3000 before deploying changes.
