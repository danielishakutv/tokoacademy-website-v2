# Toko Academy Website - Deployment Guide

## 🚀 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Updated all contact information in `src/data/config.ts`
- [ ] Added real testimonials in `src/data/testimonials.ts`
- [ ] Customized course details in `src/data/courses.ts`
- [ ] Added hero slider images to `public/images/hero/`
- [ ] Added social sharing image (`og-image.png`) to `public/`
- [ ] Added favicon and icons to `public/`
- [ ] Updated WordPress form URL in `src/data/config.ts`
- [ ] Tested locally with `npm run dev`
- [ ] Built successfully with `npm run build`
- [ ] Verified all pages in `/out` directory

## Option 1: Netlify (Recommended for Beginners)

### Why Netlify?
- Free tier available
- Automatic HTTPS
- CDN included
- Easy custom domain setup
- Automatic deployments from Git

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - Click "Deploy site"

4. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Add custom domain: `tokoacademy.org`
   - Follow DNS configuration instructions

## Option 2: Vercel (Made by Next.js Creators)

### Why Vercel?
- Optimized for Next.js
- Free tier available
- Global CDN
- Automatic HTTPS
- Preview deployments

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Follow prompts**
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

4. **Custom Domain**
   - Go to project settings on vercel.com
   - Add domain: `tokoacademy.org`
   - Update DNS records as instructed

## Option 3: GitHub Pages (Free)

### Steps:

1. **Build the site**
   ```bash
   npm run build
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d out"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch → `gh-pages`
   - Save

6. **Custom Domain**
   - Add `CNAME` file to `public/` with your domain
   - Configure DNS with GitHub's IPs

## Option 4: Traditional Web Hosting (cPanel, etc.)

### Steps:

1. **Build the site**
   ```bash
   npm run build
   ```

2. **Upload files**
   - Zip the entire `/out` directory
   - Upload via FTP or cPanel File Manager
   - Extract to `public_html` or your web root

3. **Configure .htaccess** (if needed)
   Create `.htaccess` in web root:
   ```apache
   # Enable GZIP compression
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
   </IfModule>

   # Browser caching
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType image/webp "access plus 1 year"
     ExpiresByType text/css "access plus 1 month"
     ExpiresByType application/javascript "access plus 1 month"
   </IfModule>
   ```

## Option 5: AWS S3 + CloudFront

### Why AWS?
- Highly scalable
- Global CDN with CloudFront
- Pay as you go
- Professional grade

### Steps:

1. **Create S3 Bucket**
   - Name: `tokoacademy.org`
   - Enable static website hosting
   - Set bucket policy for public read

2. **Build and Upload**
   ```bash
   npm run build
   aws s3 sync out/ s3://tokoacademy.org --delete
   ```

3. **Create CloudFront Distribution**
   - Origin: Your S3 bucket
   - Enable HTTPS
   - Set default root object: `index.html`

4. **Configure DNS**
   - Point domain to CloudFront distribution

## 📊 Post-Deployment

### 1. Verify Deployment
- [ ] Check homepage loads correctly
- [ ] Test all navigation links
- [ ] Verify external links (Apply Now, Blog)
- [ ] Test on mobile device
- [ ] Check social sharing preview

### 2. Set up Analytics
Add Google Analytics to `src/app/layout.tsx`:
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"
  strategy="afterInteractive"
/>
```

### 3. Submit to Search Engines
- Submit sitemap to Google Search Console: `https://tokoacademy.org/sitemap.xml`
- Submit to Bing Webmaster Tools

### 4. Test Performance
- Run Lighthouse audit
- Test on [PageSpeed Insights](https://pagespeed.web.dev/)
- Test on slow connection

### 5. Set up Monitoring
- Use UptimeRobot or similar for uptime monitoring
- Enable Netlify/Vercel analytics if available

## 🔄 Continuous Deployment

### Automatic Deployments (Netlify/Vercel)

Once connected to Git:
1. Make changes locally
2. Commit and push to GitHub
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```
3. Site automatically rebuilds and deploys!

### Manual Deployments

For manual updates:
1. Make changes
2. Build: `npm run build`
3. Upload `/out` contents to hosting

## 🛡️ Security

### HTTPS/SSL
- Netlify/Vercel: Automatic
- Traditional hosting: Use Let's Encrypt or hosting provider SSL
- AWS: Use ACM (AWS Certificate Manager)

### Security Headers (Recommended)

Add to Netlify: Create `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 📧 Email Configuration

Set up email for `info@tokoacademy.org`:
1. Use hosting provider's email service
2. Or use Google Workspace / Microsoft 365
3. Configure MX records in DNS

## 🎯 DNS Configuration

### For tokoacademy.org:

**A Records** (if using static IP):
```
@    A    YOUR_IP_ADDRESS
www  A    YOUR_IP_ADDRESS
```

**CNAME Records** (if using Netlify/Vercel):
```
www  CNAME  your-site.netlify.app
```

**MX Records** (for email):
```
@  MX  10  mail.yourhost.com
```

## 🆘 Troubleshooting

### Site not loading after deployment
- Check build logs for errors
- Verify publish directory is set to `out`
- Ensure all files were uploaded

### Images not showing
- Check image paths are correct
- Verify images exist in `public/images/`
- Check file permissions on server

### Links not working
- Ensure all internal links use Next.js Link component
- Check external links are complete URLs

### Slow loading
- Optimize images (compress, use WebP)
- Enable CDN if not already
- Check hosting server location

## 📞 Need Help?

Contact Toko Academy:
- Email: info@tokoacademy.org
- Phone: +234 808 825 6055

---

## 🎉 Congratulations!

Your Toko Academy website is now live and ready to serve students worldwide!

### Next Steps:
1. Share the URL with your team
2. Start promoting on social media
3. Monitor analytics and user feedback
4. Continue updating content regularly
