# MathBot – Color System

_Last updated: 2025-04-11_

> Read this file whenever working on UI components, pages, or styling.
> All colors are defined here. Never hardcode hex values outside this file.
> Use Tailwind CSS classes or CSS variables from this reference.

---

## Brand colors

### Primary — Green (Xanh lá)
The main brand color. Used for active states, primary buttons, accents, and key UI elements.

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `primary-50` | `#f0fdf9` | `green-50` | Page background, card hover bg |
| `primary-100` | `#d1fae5` | `green-100` | Badge bg, border, section bg |
| `primary-200` | `#a7f3d0` | `green-200` | Hover states |
| `primary-400` | `#34d399` | `emerald-400` | Icons, decorative |
| `primary-500` | `#10b981` | `emerald-500` | — |
| `primary-600` | `#059669` | `emerald-600` | **Main primary** — buttons, active nav, links |
| `primary-700` | `#047857` | `emerald-700` | Button hover |
| `primary-800` | `#065f46` | `emerald-800` | Text on green backgrounds |
| `primary-900` | `#064e3b` | `emerald-900` | Dark text on light green |

### Secondary — Blue (Xanh dương)
Used as gradient partner with green. Secondary buttons, info states, blue accents.

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `secondary-50` | `#e0f2fe` | `sky-100` | Badge bg, section bg |
| `secondary-400` | `#38bdf8` | `sky-400` | Icons |
| `secondary-600` | `#0891b2` | `cyan-600` | **Main secondary** — gradient end, links |
| `secondary-700` | `#0e7490` | `cyan-700` | Hover |
| `secondary-800` | `#075985` | `sky-800` | Text on blue backgrounds |

---

## Gradient

The signature MathBot gradient — used on hero cards, buttons, avatars, progress bars.

```css
/* Primary gradient */
background: linear-gradient(135deg, #059669, #0891b2);

/* Light gradient (backgrounds, section headers) */
background: linear-gradient(135deg, #f0fdf9, #e0f2fe);

/* Hero gradient (landing page, exam hero) */
background: linear-gradient(135deg, #059669 0%, #0891b2 50%, #6366f1 100%);
```

```tsx
/* Tailwind */
className="bg-gradient-to-br from-emerald-600 to-cyan-600"
className="bg-gradient-to-br from-green-50 to-blue-50"
```

---

## Semantic colors

### Score / accuracy badges

| Score | Background | Text | Tailwind bg | Tailwind text |
|-------|-----------|------|-------------|---------------|
| High ≥ 75% | `#d1fae5` | `#065f46` | `bg-green-100` | `text-emerald-800` |
| Medium 50–74% | `#fef3c7` | `#92400e` | `bg-amber-100` | `text-amber-800` |
| Low < 50% | `#fee2e2` | `#991b1b` | `bg-red-100` | `text-red-800` |

### Status

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Success | `#d1fae5` | `#065f46` | `#059669` |
| Warning | `#fef3c7` | `#92400e` | `#f59e0b` |
| Error | `#fee2e2` | `#991b1b` | `#ef4444` |
| Info | `#e0f2fe` | `#075985` | `#0891b2` |

---

## Topic colors

Each Math topic has a dedicated color dot in the sidebar and topic cards.

| Topic | Color | Hex | Tailwind |
|-------|-------|-----|----------|
| Đạo hàm | Green | `#059669` | `emerald-600` |
| Tích phân | Blue | `#0891b2` | `cyan-600` |
| Hàm số | Amber | `#f59e0b` | `amber-400` |
| Xác suất | Red | `#ef4444` | `red-400` |
| Số phức | Red | `#ef4444` | `red-400` |
| Logarit | Blue | `#0891b2` | `cyan-600` |
| Hình học KG | Indigo | `#6366f1` | `indigo-500` |
| Dãy số | Green | `#059669` | `emerald-600` |
| Giới hạn | Indigo | `#6366f1` | `indigo-500` |
| Hình học GT | Amber | `#f59e0b` | `amber-400` |
| Thể tích | Green | `#059669` | `emerald-600` |

---

## Neutral colors

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `gray-50` | `#f8fafc` | `slate-50` | Admin page background |
| `gray-100` | `#f1f5f9` | `slate-100` | Dividers, subtle bg |
| `gray-200` | `#e2e8f0` | `slate-200` | Borders in admin |
| `gray-400` | `#9ca3af` | `gray-400` | Placeholder text, muted |
| `gray-600` | `#6b7280` | `gray-500` | Secondary text |
| `gray-700` | `#374151` | `gray-700` | Body text |
| `gray-900` | `#0f172a` | `slate-900` | Headings, primary text |

---

## Borders

```css
/* Default border — all cards, inputs, dividers */
border: 0.5px solid #d1fae5;       /* green tint */

/* Admin panel borders */
border: 0.5px solid #e2e8f0;       /* neutral gray */

/* Input focus */
border: 1.5px solid #059669;

/* Danger zone */
border: 0.5px solid #fecaca;
```

---

## Sidebar specific

```css
/* Sidebar background */
background: #ffffff;
border-right: 0.5px solid #d1fae5;

/* Logo header background */
background: linear-gradient(135deg, #f0fdf9, #e0f2fe);

/* Active nav item */
background: linear-gradient(135deg, #d1fae5, #e0f2fe);
color: #059669;

/* Hover nav item */
background: #f0fdf9;
color: #059669;

/* Admin sidebar background */
background: #0f172a;
/* Admin active item */
background: linear-gradient(135deg, rgba(5,150,105,0.2), rgba(8,145,178,0.2));
color: #34d399;
```

---

## App backgrounds

| Page | Background | Notes |
|------|-----------|-------|
| Student app | `#f0fdf9` | Xanh lá nhạt |
| Admin panel | `#f8fafc` | Trắng xám nhẹ |
| Cards / surfaces | `#ffffff` | Trắng thuần |
| Auth page left panel | `linear-gradient(160deg, #059669, #7F77DD, #5DCAA5)` | Gradient |

---

## Typography colors

```css
/* Headings */
color: #0f172a;   /* slate-900 */

/* Body text */
color: #374151;   /* gray-700 */

/* Secondary / muted */
color: #6b7280;   /* gray-500 */

/* Placeholder */
color: #9ca3af;   /* gray-400 */

/* Link / accent */
color: #059669;   /* emerald-600 */

/* On colored backgrounds (green) */
color: #065f46;   /* emerald-800 */

/* On colored backgrounds (blue) */
color: #075985;   /* sky-800 */
```

---

## Tailwind config

Add to `tailwind.config.ts` for custom tokens:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf9',
          100: '#d1fae5',
          200: '#a7f3d0',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
        },
        secondary: {
          50:  '#e0f2fe',
          600: '#0891b2',
          700: '#0e7490',
          800: '#075985',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #059669, #0891b2)',
        'brand-gradient-light': 'linear-gradient(135deg, #f0fdf9, #e0f2fe)',
        'hero-gradient': 'linear-gradient(135deg, #059669 0%, #0891b2 50%, #6366f1 100%)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Quick reference

```tsx
// Primary button
className="bg-gradient-to-br from-emerald-600 to-cyan-600 text-white"

// Ghost button
className="bg-white border border-green-100 text-emerald-600"

// Active nav item
className="bg-gradient-to-r from-green-100 to-blue-50 text-emerald-600 font-semibold"

// Card
className="bg-white border border-green-100 rounded-2xl"

// Page background
className="bg-green-50/60"   // or bg-[#f0fdf9]

// Score badge — high
className="bg-green-100 text-emerald-800"

// Score badge — medium
className="bg-amber-100 text-amber-800"

// Score badge — low
className="bg-red-100 text-red-800"

// Math formula block
className="bg-green-50 border-l-4 border-emerald-600 rounded-r-xl font-mono text-emerald-800"
```