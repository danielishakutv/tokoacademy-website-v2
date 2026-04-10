# ✅ Launch Checklist - Toko Academy Website

Use this checklist to ensure everything is ready before going live!

## 📋 Pre-Launch Checklist

### ⚙️ 1. Initial Setup (15 minutes)

- [ ] Node.js installed (version 18+)
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server runs successfully (`npm run dev`)
- [ ] Website loads at http://localhost:3000

### 🖼️ 2. Images & Assets (30 minutes)

#### Hero Slider Images (Required)
- [ ] `public/images/hero/slide1.jpg` added (1920x1080, <200KB)
- [ ] `public/images/hero/slide2.jpg` added (1920x1080, <200KB)
- [ ] `public/images/hero/slide3.jpg` added (1920x1080, <200KB)
- [ ] `public/images/hero/slide4.jpg` added (1920x1080, <200KB)

#### Social & Icons (Required)
- [ ] `public/og-image.png` added (1200x630, <100KB)
- [ ] `public/favicon.ico` added
- [ ] `public/apple-touch-icon.png` added (180x180)
- [ ] `public/icon-192.png` added (192x192)
- [ ] `public/icon-512.png` added (512x512)

#### Image Optimization
- [ ] All images compressed (use TinyPNG.com)
- [ ] All images in correct dimensions
- [ ] All images under target file sizes

### 📝 3. Content Updates (20 minutes)

#### Contact Information (`src/data/config.ts`)
- [ ] Phone numbers correct: `+234 808 825 6055`, `+234 812 856 1493`
- [ ] Email correct: `info@tokoacademy.org`
- [ ] Physical address updated (if different)
- [ ] Social media URLs verified:
  - [ ] Facebook URL
  - [ ] Instagram URL
  - [ ] X (Twitter) URL
  - [ ] LinkedIn URL
  - [ ] WhatsApp number

#### External Links (`src/data/config.ts`)
- [ ] WordPress application form URL correct
- [ ] WordPress blog URL correct
- [ ] Links tested and working

#### Courses (`src/data/courses.ts`)
- [ ] All 10 courses reviewed
- [ ] Course descriptions accurate
- [ ] Duration/level information correct
- [ ] Icons appropriate

#### Testimonials (`src/data/testimonials.ts`)
- [ ] Real student testimonials added
- [ ] Statistics updated (learners count, success rate, etc.)
- [ ] Names and roles verified

### 🧪 4. Local Testing (30 minutes)

#### Functionality Tests
- [ ] All navigation links work
- [ ] "Apply Now" button links to correct form
- [ ] Hero slider auto-plays and controls work
- [ ] Mobile menu opens/closes correctly
- [ ] All course cards link correctly
- [ ] Footer links functional
- [ ] Social media icons link correctly
- [ ] WhatsApp button works with pre-filled message

#### Mobile Responsive
- [ ] Tested on mobile size (320px+)
- [ ] Tested on tablet size (768px+)
- [ ] Tested on desktop size (1024px+)
- [ ] Text readable on all sizes
- [ ] Images display correctly
- [ ] Buttons touchable (≥44x44px)

#### Cross-Browser
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari (if available)
- [ ] Tested in Edge

#### Performance
- [ ] Pages load in < 3 seconds
- [ ] Images load progressively
- [ ] No console errors
- [ ] Animations smooth

### 🏗️ 5. Build for Production (10 minutes)

- [ ] Run `npm run build` successfully
- [ ] No build errors
- [ ] `/out` directory created
- [ ] All pages in `/out` directory
- [ ] Test production build (`npm run start`)

### 🚀 6. Deployment (30-60 minutes)

#### Choose Deployment Method
- [ ] Selected hosting platform (Netlify/Vercel/Other)
- [ ] Account created/logged in
- [ ] Repository connected (if using Git)

#### Netlify Deployment
- [ ] Repository pushed to GitHub
- [ ] Site imported to Netlify
- [ ] Build command: `npm run build`
- [ ] Publish directory: `out`
- [ ] Site deployed successfully
- [ ] Custom domain configured (optional)

#### Vercel Deployment
- [ ] Vercel CLI installed
- [ ] Deployed with `vercel --prod`
- [ ] Domain configured (optional)

#### Manual Deployment
- [ ] `/out` folder uploaded to hosting
- [ ] Files in correct web root
- [ ] `.htaccess` configured (if needed)

### 🌐 7. Domain & DNS (If using custom domain)

- [ ] Domain purchased/available
- [ ] DNS A/CNAME records configured
- [ ] HTTPS/SSL certificate active
- [ ] Domain propagated (wait 24-48 hours)
- [ ] Both www and non-www versions work

### 🔍 8. Post-Deployment Verification

#### Live Site Tests
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Forms link correctly (WordPress)
- [ ] Images display
- [ ] Mobile version works
- [ ] HTTPS enabled (green padlock)

#### SEO & Social
- [ ] Meta titles show correctly in browser tabs
- [ ] Social sharing preview looks good (use Facebook Debugger)
- [ ] Sitemap accessible: `yourdomain.com/sitemap.xml`
- [ ] Robots.txt accessible: `yourdomain.com/robots.txt`
- [ ] Google Search Console submitted (optional)

### 📊 9. Analytics & Monitoring (Optional)

- [ ] Google Analytics setup
- [ ] Facebook Pixel installed (if needed)
- [ ] Uptime monitoring configured
- [ ] Error tracking enabled

### 📱 10. Final Quality Checks

#### Content Review
- [ ] No spelling/grammar errors
- [ ] All information accurate
- [ ] Contact details correct
- [ ] Copyright year correct (2026)

#### Performance Check
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Test on slow connection (3G)
- [ ] Check PageSpeed Insights
- [ ] Total page size reasonable

#### Accessibility
- [ ] Images have alt text
- [ ] Links have descriptive text
- [ ] Proper heading hierarchy
- [ ] Keyboard navigation works
- [ ] Color contrast sufficient

### 🎉 11. Launch Day!

- [ ] Announce on social media
- [ ] Email announcement to stakeholders
- [ ] Update business cards/materials
- [ ] Add to Google My Business
- [ ] Share with team

### 📈 12. Post-Launch (First Week)

- [ ] Monitor analytics
- [ ] Check for broken links
- [ ] Gather user feedback
- [ ] Monitor uptime
- [ ] Check form submissions working
- [ ] Review mobile traffic

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Images Not Showing
- Check file paths are correct
- Verify images exist in `public/images/`
- Check file names match exactly (case-sensitive)
- Ensure images optimized

### Links Not Working
- Test external links in incognito mode
- Verify URLs in `src/data/config.ts`
- Check for trailing slashes

### Site Loading Slowly
- Optimize images further
- Enable CDN (Netlify/Vercel automatic)
- Check hosting server location

## 📞 Need Help?

**Technical Issues:**
- Review documentation files
- Check error messages
- Search Next.js documentation

**Contact Support:**
- Email: info@tokoacademy.org
- Phone: +234 808 825 6055

## ✅ Final Pre-Launch Sign-Off

Before going live, confirm:

- [ ] All checklist items above completed
- [ ] Stakeholder approval received
- [ ] Content reviewed and approved
- [ ] Backup of files created
- [ ] Team members notified
- [ ] Social media posts prepared

**Launch Date**: _______________

**Launched By**: _______________

**Notes**: 
_________________________________
_________________________________
_________________________________

---

## 🎊 Congratulations!

Your Toko Academy website is now live!

### Next Steps:
1. ✅ Monitor performance first 48 hours
2. ✅ Gather user feedback
3. ✅ Plan regular content updates
4. ✅ Track enrollment conversions
5. ✅ Celebrate the launch! 🎉

---

**Website Built With**: Next.js 14, TypeScript, Tailwind CSS
**Optimized For**: Speed, SEO, Mobile, Low-Bandwidth
**Ready For**: 2,000+ concurrent users
**Designed For**: Global reach

**You're ready to transform lives through education! 🚀**


HOME PAGES
- https://tokoacademy.org/home-v1-original
- https://tokoacademy.org/home-v2-hybrid


cd /home/tokoacademy/apps/tokoacademy-website-v2 && git pull origin master && npm ci && npm run build && pm2 restart tokoacademy-web --update-env