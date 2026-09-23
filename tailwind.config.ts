import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  /*
   * Class-based, not media-based: the theme is a choice somebody makes and we
   * remember, with the system preference as the starting point rather than the
   * final word. `ThemeScript` in the root layout sets the class before the
   * first paint, so there is no flash of the wrong theme.
   */
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /*
         * Semantic tokens, defined as CSS variables in globals.css so they
         * flip with the theme. New work should reach for these — `bg-surface`,
         * `text-ink-muted` — rather than for a fixed grey, because a fixed
         * grey is a colour that only works on one of the two themes.
         *
         * `<alpha-value>` is what lets `text-ink/70` keep working.
         */
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          sunken: 'rgb(var(--surface-sunken) / <alpha-value>)',
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
          inverted: 'rgb(var(--surface-inverted) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          subtle: 'rgb(var(--ink-subtle) / <alpha-value>)',
          inverted: 'rgb(var(--ink-inverted) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--line) / <alpha-value>)',
          strong: 'rgb(var(--line-strong) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          soft: 'rgb(var(--brand-soft) / <alpha-value>)',
        },
        // Toko Academy Brand Colors (from logo)
        /*
         * Deepened from the logo's #7CB342 so that text can actually be read.
         *
         * White on #7CB342 measures 2.5:1, and #7CB342 text on white measures
         * the same — against a WCAG AA requirement of 4.5:1. That was every
         * primary button on the site and every green figure and link on a
         * white card, which is most of the green on the page. For an audience
         * reading on inexpensive phones, frequently outdoors, that is not a
         * checklist item; it is whether the words are legible.
         *
         * #4A7C2A measures 4.99:1 against white both ways. It is the same
         * green, deeper — the logo itself is an image and is untouched, so the
         * brand mark keeps its original colour.
         */
        'toko-green': {
          DEFAULT: '#4A7C2A',
          light: '#9CCC65',
          dark: '#3A6120',
        },
        'toko-yellow': {
          DEFAULT: '#FFC107',
          light: '#FFD54F',
          dark: '#FFA000',
        },
        'toko-magenta': {
          DEFAULT: '#E91E63',
          light: '#F06292',
          dark: '#C2185B',
        },
        'toko-blue': {
          DEFAULT: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2',
        },
        // Neutrals
        'toko-gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      /*
       * One typeface, self-hosted by next/font and preloaded — no request to
       * Google, no render-blocking stylesheet, and a system stack behind it so
       * text is readable from the first paint whatever happens to the font.
       * A variable font means every weight is one file.
       */
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['var(--font-display)', 'var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
      },
      boxShadow: {
        'toko': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'toko-lg': '0 10px 40px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
