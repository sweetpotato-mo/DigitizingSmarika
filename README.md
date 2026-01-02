# Digitizing Smarika

A trilingual Next.js reading application with support for English, Nepali (नेपाली), and Newari (नेपाल भाषा).

## Features

- **Trilingual Support**: Switch between English (EN), Nepali (ने), and Newari (न्ये)
- **Markdown Reader**: Reads content from Markdown files
- **Continuous Scroll**: 750px centered column with serif typography (Lora/Playfair)
- **6 Articles**: Placeholder articles with trilingual titles
- **Navigation**: HOME button linking to tokhachaku.com

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js App Router structure
  - `layout.tsx` - Root layout with navigation
  - `page.tsx` - Home page with article list
  - `article/[slug]/page.tsx` - Article reader page
- `components/` - React components
  - `Reader.tsx` - Markdown reader component
  - `LanguageSwitcher.tsx` - Language selection pill
  - `NavBar.tsx` - Navigation bar with HOME button
- `public/articles/` - Markdown article files (18 files: 6 articles × 3 languages)

## Articles

1. Origins of the Hook
2. Heritage of Chaku
3. Craftsmanship Tradition
4. Cultural Significance
5. Modern Adaptations
6. Preserving Legacy

Each article is available in three languages: English, Nepali, and Newari.

