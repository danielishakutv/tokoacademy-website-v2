# 📊 Toko Academy Website - Visual Structure

## 🎨 Brand Colors Reference

```
Primary Green:   #7CB342  ████████  Main CTAs, Primary Actions
Accent Yellow:   #FFC107  ████████  Highlights, Kids Section
Accent Magenta:  #E91E63  ████████  Emphasis, Accents
Accent Blue:     #2196F3  ████████  Links, Secondary Elements

Neutral Grays:
Gray 50:         #F9FAFB  ████████  Backgrounds
Gray 100:        #F3F4F6  ████████  Light Backgrounds
Gray 600:        #4B5563  ████████  Secondary Text
Gray 900:        #111827  ████████  Primary Text
```

## 📱 Page Structure Overview

### HOME PAGE (/)
```
┌─────────────────────────────────────┐
│ 📞 Mini Bar (Contact Info + Social) │
├─────────────────────────────────────┤
│ 🏠 Main Nav (Logo + Menu + Apply)   │
├─────────────────────────────────────┤
│                                     │
│    🎬 HERO SLIDER (Full Screen)     │
│    4 Slides with CTAs               │
│                                     │
├─────────────────────────────────────┤
│ ⭐ WHY CHOOSE TOKO ACADEMY          │
│    • Statistics (2K+ learners)      │
│    • 6 Feature Cards                │
├─────────────────────────────────────┤
│ 📚 COURSES OVERVIEW                 │
│    • 10 Course Cards in Grid        │
│    • "View All Courses" CTA         │
├─────────────────────────────────────┤
│ 👶 KIDS & TEENS PROGRAMS            │
│    • Weekend Coding Classes         │
│    • CBT Programs                   │
├─────────────────────────────────────┤
│ 🏢 CORPORATE SERVICES               │
│    • Training Programs              │
│    • Workshops                      │
│    • IT Consultation                │
├─────────────────────────────────────┤
│ 💬 SUCCESS STORIES                  │
│    • Featured Testimonial           │
│    • Testimonial Grid               │
├─────────────────────────────────────┤
│ 🎯 CALL-TO-ACTION BANNER            │
│    • Apply Now Button               │
│    • WhatsApp Chat                  │
├─────────────────────────────────────┤
│ 📋 FOOTER (4 Columns)               │
│    • About                          │
│    • Quick Links                    │
│    • Popular Courses                │
│    • Contact Info                   │
└─────────────────────────────────────┘
```

### ABOUT PAGE (/about)
```
┌─────────────────────────────────────┐
│ Hero Section (Gradient Background)  │
├─────────────────────────────────────┤
│ Mission & Vision (2 Cards)          │
├─────────────────────────────────────┤
│ Our Story (Text Block)              │
├─────────────────────────────────────┤
│ Core Values (6 Cards Grid)          │
├─────────────────────────────────────┤
│ What We Offer (6 Items)             │
├─────────────────────────────────────┤
│ CTA: Join the Community             │
└─────────────────────────────────────┘
```

### COURSES PAGE (/courses)
```
┌─────────────────────────────────────┐
│ Hero Section                        │
├─────────────────────────────────────┤
│ All Courses Grid (10 Courses)       │
│    • Data Analysis                  │
│    • Scratch Programming            │
│    • Website Development            │
│    • Mobile App Development         │
│    • Graphics Design                │
│    • Digital Marketing              │
│    • Microsoft Packages             │
│    • UI/UX Design                   │
│    • Python Programming             │
│    • AI Essentials & Automation     │
├─────────────────────────────────────┤
│ Why Choose Our Courses (4 Features) │
├─────────────────────────────────────┤
│ CTA: Ready to Start Learning        │
└─────────────────────────────────────┘
```

### KIDS PAGE (/kids)
```
┌─────────────────────────────────────┐
│ Hero Section (Magenta-Yellow)       │
├─────────────────────────────────────┤
│ Programs Overview (2 Cards)         │
│    • Weekend Coding (6-16 years)    │
│    • CBT Program (8-18 years)       │
├─────────────────────────────────────┤
│ Benefits (6 Cards)                  │
├─────────────────────────────────────┤
│ Progressive Learning Path           │
│    • Foundation (6-9)               │
│    • Intermediate (10-13)           │
│    • Advanced (14-18)               │
├─────────────────────────────────────┤
│ FAQs (4 Questions)                  │
├─────────────────────────────────────┤
│ CTA: Enroll Your Child              │
└─────────────────────────────────────┘
```

### CORPORATE PAGE (/corporate)
```
┌─────────────────────────────────────┐
│ Hero Section (Blue-Green)           │
├─────────────────────────────────────┤
│ Services Overview (3 Cards)         │
│    • Corporate Training             │
│    • Workshops & Seminars           │
│    • IT Consultation                │
├─────────────────────────────────────┤
│ Training Areas (8 Categories)       │
├─────────────────────────────────────┤
│ Benefits (6 Items)                  │
├─────────────────────────────────────┤
│ How It Works (4 Steps)              │
├─────────────────────────────────────┤
│ Industries We Serve (8 Sectors)     │
├─────────────────────────────────────┤
│ CTA: Request Consultation           │
└─────────────────────────────────────┘
```

### CONTACT PAGE (/contact)
```
┌─────────────────────────────────────┐
│ Hero Section (Green-Yellow)         │
├─────────────────────────────────────┤
│ Contact Details (2 Columns)         │
│    • Phone, Email, Address          │
│    • WhatsApp Link                  │
│    • Social Media Icons             │
│    • Message Form Placeholder       │
├─────────────────────────────────────┤
│ Office Hours (Weekdays/Weekends)    │
├─────────────────────────────────────┤
│ Visit Us (Map Placeholder)          │
└─────────────────────────────────────┘
```

## 🎯 Component Hierarchy

```
App
├── Layout (Root)
│   ├── Header
│   │   ├── Mini Bar
│   │   │   ├── Contact Info
│   │   │   └── Social Icons
│   │   └── Main Nav
│   │       ├── Logo
│   │       ├── Menu Links
│   │       └── Apply Button
│   ├── Main (Page Content)
│   └── Footer
│       ├── About Column
│       ├── Quick Links
│       ├── Popular Courses
│       └── Contact Info
│
└── Pages
    ├── Home (/)
    │   ├── HeroSlider
    │   ├── WhyChooseSection
    │   ├── CoursesSection
    │   ├── KidsSection
    │   ├── ServicesSection
    │   ├── TestimonialsSection
    │   └── CTABanner
    ├── About (/about)
    ├── Courses (/courses)
    ├── Kids (/kids)
    ├── Corporate (/corporate)
    ├── Contact (/contact)
    ├── Privacy (/privacy)
    └── Terms (/terms)
```

## 📏 Responsive Breakpoints

```
Mobile:     < 768px   (1 column layout)
Tablet:     768px+    (2 column layout)
Desktop:    1024px+   (3-4 column layout)
Wide:       1280px+   (Full features)
```

## 🎨 Typography Scale

```
Hero Heading (h1):    4xl / 5xl / 6xl  (responsive)
Section Heading (h2): 3xl / 4xl / 5xl
Card Heading (h3):    2xl / 3xl / 4xl
Body Text:            base / lg
Small Text:           sm / xs
```

## 📊 Section Spacing

```
Section Padding:  py-16 / py-20 / py-24  (responsive)
Card Padding:     p-6 / p-8
Container:        max-w-7xl mx-auto px-4/6/8
```

## 🔘 Button Styles

```
Primary:    Green background, white text
Secondary:  White background, green text, green border
Hover:      Darker shade, slight lift effect
```

## 📱 Navigation States

```
Desktop:    Horizontal menu, sticky header
Mobile:     Hamburger menu, slide-out drawer
Scrolled:   Compressed header with shadow
```

## 🎬 Hero Slider

```
Slides:       4 slides with auto-play (6 seconds)
Controls:     Arrow buttons + dot indicators
CTAs:         2 buttons per slide
Transition:   Fade effect (1 second)
Background:   Gradient overlay on each slide
```

## 📊 Data Sources

```
Courses:      src/data/courses.ts       (10 courses)
Testimonials: src/data/testimonials.ts  (6 testimonials)
Config:       src/data/config.ts        (contact, links)
```

## 🔗 External Links

```
Apply Now:    → WordPress Application Form
Blog:         → WordPress Blog
WhatsApp:     → Direct chat with pre-filled message
Social:       → Facebook, Instagram, X, LinkedIn
```

## 📈 Performance Goals

```
First Paint:        < 1.5s
Time to Interactive: < 3s on 3G
Lighthouse Score:   90+ across all metrics
Image Sizes:        < 200KB per hero image
Total Page Size:    < 1MB per page
```

## 🎨 Animation Effects

```
Fade In:      opacity 0 → 1
Slide Up:     translateY(20px) → 0
Slide Right:  translateX(20px) → 0
Duration:     0.6s ease-out
Hover:        scale(1.05), shadow increase
```

## 📱 Mobile Optimization

```
Touch Targets:    min 44x44px
Font Size:        min 16px (prevent zoom)
Menu:            Drawer navigation
Images:          Lazy loaded
Animations:      Reduced on user preference
```

---

## 🎯 Key User Flows

### Apply for Course
```
Home → "Apply Now" → External WordPress Form
Courses → Course Card → "Apply" → External Form
Any Page → Header "Apply Now" → External Form
```

### Explore Courses
```
Home → "View Courses" → Courses Page
Home → Course Card → "Learn More" → Courses Page (anchor)
```

### Contact
```
Any Page → "Contact" → Contact Page
Contact Page → Phone/Email/WhatsApp Links
```

### Kids Programs
```
Home → Kids Section → "Learn More" → Kids Page
Kids Page → "Enroll Now" → External Form
```

---

This visual guide helps understand the complete structure at a glance!
