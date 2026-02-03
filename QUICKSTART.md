# 🚀 Quick Start - Toko Academy Website

Welcome! Follow these steps to get your website running:

## Step 1: Install Dependencies (2 minutes)

Open terminal/command prompt in this folder and run:

```bash
npm install
```

Wait for all packages to install...

## Step 2: Start Development Server (1 minute)

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

You should see your website running! 🎉

## Step 3: Add Your Images (30 minutes)

1. Go to `public/images/hero/` folder
2. Add these 4 images (1920x1080 pixels):
   - `slide1.jpg`
   - `slide2.jpg`
   - `slide3.jpg`
   - `slide4.jpg`

3. Go to `public/` folder
4. Add these files:
   - `og-image.png` (1200x630) - for social sharing
   - `favicon.ico` - browser tab icon
   - `apple-touch-icon.png` (180x180)
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)

> **Tip**: Use https://tinypng.com to compress images before adding them!

## Step 4: Update Your Content (20 minutes)

### Contact Information
Open `src/data/config.ts` and update:
- Phone numbers
- Email address
- Physical address
- Social media URLs

### External Links
In the same file, update:
- WordPress application form URL
- Blog URL

### Courses
Open `src/data/courses.ts` to:
- Add/remove courses
- Update course details

### Testimonials
Open `src/data/testimonials.ts` to:
- Add real student testimonials
- Update statistics (number of learners, etc.)

## Step 5: Build for Production (5 minutes)

```bash
npm run build
```

This creates optimized files in the `/out` folder.

## Step 6: Deploy Your Website (30 minutes)

Choose one of these options:

### Option A: Netlify (Easiest)
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import from Git"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `out`
7. Click "Deploy"!

### Option B: Vercel
1. Install Vercel: `npm install -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts

### Option C: Traditional Hosting
1. Upload contents of `/out` folder to your web host
2. Place in `public_html` or web root folder

## 🎉 That's It!

Your website is now live!

## Next Steps

- Test all pages and links
- Submit sitemap to Google Search Console
- Set up Google Analytics (optional)
- Share with your team!

## Need Help?

- See `SETUP.md` for detailed configuration
- See `DEPLOYMENT.md` for deployment options
- See `CONTENT-GUIDE.md` for updating content
- Email: info@tokoacademy.org

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Preview production build
npm run lint     # Check code quality
```

## Troubleshooting

**Port already in use?**
```bash
npx kill-port 3000
npm run dev
```

**Module not found?**
```bash
rm -rf node_modules
npm install
```

**Changes not showing?**
```bash
rm -rf .next
npm run dev
```

---

**Ready to launch?** Let's go! 🚀
