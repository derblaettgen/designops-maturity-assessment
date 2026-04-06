# DESIGN.md – adesso SE

> Visual language reference for AI coding agents.
> Drop into your project root and build UI that feels like adesso — precise, professional, trustworthy.

---

## Brand Character

adesso is a leading German IT consultancy. The visual language reflects **structured confidence**: clean, direct, corporate-blue authority — not cold, not flashy. The tone is professional without being sterile. Whitespace earns its place. Typography does the heavy lifting. Color is used with restraint and purpose.

**Keywords:** Trustworthy · Precise · Structured · Human · German Engineering Quality

---

## Color Palette

### Primitive Tokens

| Token | Value | Description |
|---|---|---|
| `--color-blue-900` | `#001A3D` | Deepest blue, backgrounds |
| `--color-blue-800` | `#00336A` | Dark blue, hover states |
| `--color-blue-600` | `#004C93` | **Primary brand blue** |
| `--color-blue-400` | `#009FE3` | Accent / interactive blue |
| `--color-blue-100` | `#E6EFF8` | Light blue tint |
| `--color-blue-50` | `#F2F7FC` | Extra light, backgrounds |
| `--color-teal-600` | `#009688` | Teal dark |
| `--color-teal-400` | `#00B4A0` | Teal, success / positive |
| `--color-orange-500` | `#ED6B22` | Orange, benchmark / warning |
| `--color-dark` | `#1A1D2B` | Near-black, topbar/footer |
| `--color-gray-900` | `#212529` | Primary text |
| `--color-gray-700` | `#4A5568` | Secondary text |
| `--color-gray-500` | `#718096` | Muted text, labels |
| `--color-gray-400` | `#A0AEC0` | Placeholders, disabled |
| `--color-gray-300` | `#CBD5E0` | Borders, dividers |
| `--color-gray-200` | `#E2E8F0` | Subtle borders |
| `--color-gray-100` | `#F7FAFC` | Page background |
| `--color-white` | `#FFFFFF` | Surface, cards |
| `--color-red-500` | `#E53E3E` | Error / danger |

### Semantic Tokens

```css
:root {
  /* Brand */
  --color-brand:          #004C93;
  --color-brand-dark:     #00336A;
  --color-brand-deeper:   #001A3D;
  --color-brand-light:    #E6EFF8;
  --color-brand-lightest: #F2F7FC;

  /* Interactive */
  --color-accent:         #009FE3;
  --color-success:        #00B4A0;
  --color-success-dark:   #009688;
  --color-warning:        #ED6B22;
  --color-danger:         #E53E3E;

  /* Surfaces */
  --color-surface:        #FFFFFF;
  --color-bg:             #F7FAFC;
  --color-dark-surface:   #1A1D2B;

  /* Text */
  --color-text-primary:   #212529;
  --color-text-secondary: #4A5568;
  --color-text-muted:     #718096;
  --color-text-disabled:  #A0AEC0;

  /* Borders */
  --color-border:         #E2E8F0;
  --color-border-strong:  #CBD5E0;
}
```

### Usage Rules

- **Brand blue `#004C93`** is for primary actions, active navigation, key headings, and hero backgrounds. Never use it as a large page background in a light-mode context without sufficient contrast.
- **Accent blue `#009FE3`** is for interactive highlights, badges, links, and selected states. Always paired with white text.
- **Teal `#00B4A0`** signals success, positive metrics, and CTAs that confirm completion.
- **Orange `#ED6B22`** is for benchmarks, secondary data points, and cautionary callouts — not errors.
- **Red `#E53E3E`** is strictly for errors and destructive states. Not decorative.
- Avoid mixing blue + teal + orange in the same component. Max 2 accent colors per UI region.

---

## Typography

### Font Family

**Primary:** Inter (Google Fonts)
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

Inter is the sole typeface. No serif fallback. No display font. Weight and size create all hierarchy.

### Scale

| Role | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| Display | `clamp(1.5rem, 4.5vw, 2.3rem)` | 900 | 1.15 | -0.02em |
| H1 | `1.5rem` (24px) | 800 | 1.2 | -0.01em |
| H2 | `1.3rem` (20.8px) | 800 | 1.25 | 0 |
| H3 | `1rem` (16px) | 700 | 1.35 | 0 |
| Body Large | `0.92rem` (14.7px) | 400 | 1.55 | 0 |
| Body | `0.87rem` (13.9px) | 400 | 1.6 | 0 |
| Label | `0.75rem` (12px) | 600 | 1.4 | 0.02em |
| Caption | `0.7rem` (11.2px) | 500 | 1.4 | 0.05em |
| Badge / Tag | `0.68rem` (10.9px) | 700 | 1 | 0.08em |
| Overline | `0.68rem` (10.9px) | 700 | 1 | 0.15em + uppercase |

### Typography Rules

- **Heavy weights (800–900) for headlines only.** Body text never exceeds 600.
- **Overlines and labels** use uppercase + wide letter-spacing to signal metadata, not hierarchy.
- `-webkit-font-smoothing: antialiased` always on.
- Line lengths: cap body text at 65–70ch. Never full-width.
- Don't use italic except for hints and helper text.

---

## Spacing

Base unit: `4px`. All spacing is a multiple of 4.

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-7:  28px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

**Content max-width:** `780px` for single-column reading. `1100px` for dashboard/data layouts.

---

## Elevation & Shadow

adesso UIs are **flat by default**. Shadows signal interactivity and depth — not decoration.

```css
:root {
  --shadow-sm:  0 1px 4px rgba(0, 76, 147, 0.05);
  --shadow-md:  0 2px 16px rgba(0, 76, 147, 0.07);
  --shadow-lg:  0 8px 40px rgba(0, 76, 147, 0.10);
  --shadow-xl:  0 12px 48px rgba(0, 76, 147, 0.14);
}
```

- Cards at rest: `--shadow-md`
- Cards on hover: `--shadow-lg`
- Modals / dropdowns: `--shadow-xl`
- Never stack multiple shadows on one element.
- Blue-tinted shadows only. No black/gray generic box-shadows.

---

## Border Radius

```css
:root {
  --radius-sm:   6px;   /* chips, badges, small inputs */
  --radius-md:   10px;  /* buttons, inputs, small cards */
  --radius-lg:   14px;  /* cards, panels */
  --radius-full: 9999px; /* pills, avatars */
}
```

adesso UI is **softly rounded** — not square, not bubbly. `--radius-lg` is the default card radius.

---

## Motion

```css
:root {
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter:    cubic-bezier(0, 0, 0.2, 1);
  --ease-exit:     cubic-bezier(0.4, 0, 1, 1);

  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --duration-slow:   400ms;
  --duration-layout: 500ms;
}
```

- **All interactive states** (hover, focus, active) use `--duration-fast` with `--ease-standard`.
- **Entrances** (cards, modals sliding in) use `--duration-slow` with `--ease-enter`.
- **Progress and data bars** use `--duration-layout` with `--ease-standard`.
- Never animate color changes alone — always pair with transform or opacity.
- No infinite animations unless they serve a functional purpose.

---

## Components

### Buttons

```
Primary:   bg #004C93, text white, radius --radius-md, padding 14px 28px
           hover: bg #00336A, translateY(-1px), shadow-lg
           font: 0.88rem / 700

Ghost:     bg transparent, border 2px #E2E8F0, text #718096
           hover: border #004C93, text #004C93

CTA:       bg linear-gradient(135deg, #00B4A0, #009688), text white
           hover: translateY(-2px), shadow with teal tint
           padding: 16px 36px, font: 0.95rem
```

Rules:
- Buttons always have `font-family: inherit` and `font-weight: 700`.
- Icons in buttons: 8px gap, SVG 16×16.
- No disabled state without `opacity: 0.5` + `cursor: not-allowed`.

### Cards

```
Background: white
Border:     2px solid transparent (default) → brand-light on hover
Radius:     --radius-lg
Shadow:     --shadow-md (rest) → --shadow-lg (hover)
Padding:    24px
Transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s
```

Answered/active state: `border-left: 4px solid #00B4A0`
Error state: `border-color: #E53E3E` + shake animation

### Form Inputs (Select, Textarea)

```
Border:       2px solid #E2E8F0
Radius:       --radius-md
Padding:      14px 16px
Font:         0.87rem, inherit family
Focus:        border-color #004C93 + box-shadow 0 0 0 3px rgba(0,76,147,0.08)
Filled state: border-color #00B4A0
```

### Likert Scale

5 options, horizontal flex layout. Each option:
- Default: border 2px `#E2E8F0`, white bg
- Hover: border `#004C93`, `#E6EFF8` bg, `translateY(-3px)`, subtle shadow
- Selected: border + bg `#004C93`, white text, `translateY(-3px)`, stronger blue shadow

Number label: `1.4rem / 800`. Text label: `0.58rem / 500`, centered, min-height 2.5em.

### Chips (Multi-select)

Pill shape (`border-radius: 9999px`), `padding: 9px 16px`, `font: 0.82rem / 500`.
- Default: border `#E2E8F0`, bg white, text `#718096`
- Hover: border + text `#004C93`, bg `#E6EFF8`
- Selected: border + bg `#004C93`, text white

Small dot indicator (8×8px) inside each chip, transitions from outlined to filled on selection.

### Progress Bar

```
Track:  5px height, bg #E2E8F0, border-radius 3px
Fill:   linear-gradient(90deg, #004C93, #009FE3, #00B4A0)
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1)
```

### Badges / Status Pills

```css
.badge-red:    { background: #FEE2E2; color: #B91C1C; }
.badge-orange: { background: #FEF3C7; color: #92400E; }
.badge-yellow: { background: #FEF9C3; color: #854D0E; }
.badge-green:  { background: #DCFCE7; color: #166534; }
.badge-blue:   { background: #DBEAFE; color: #1E40AF; }

/* Base */
padding: 3px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;
```

### Hero / Dark Sections

```
Background: linear-gradient(160deg, #004C93 0%, #00336A 55%, #001A3D 100%)
Text:       white, body at opacity 0.8
Decorative: radial-gradient circle, rgba(0,159,227,0.12), blurred, positioned off-canvas
```

Topbar / Footer: `#1A1D2B` background. Footer text: `#A0AEC0`. Links: `#009FE3`.

### Data Visualization (Dashboard)

- **Radar charts:** brand blue fill at 15% opacity, solid 2px border. Market avg: dashed gray. Top performer: dashed teal.
- **Bar charts:** rounded bars (`border-radius: 8px`). Color-coded by performance level (red → yellow → green → blue).
- **KPI cards:** `border-top: 3px solid [metric color]`. Value: large (2em), bold (900). Label: muted, small.
- **Dimension bars:** Blue-tinted track (`#F7FAFC`), filled with `col(score)` function output. Benchmark markers as absolute positioned lines.

---

## Layout Patterns

### Single-column Form/Survey

```
max-width: 780px
margin: 0 auto
padding: 28px 24px 60px
```

Cards stack vertically with `14px` gap. Navigation (prev/next) sits at the bottom of each section, space-between layout.

### Dashboard Grid

```
Two-column: grid-template-columns: 1fr 1fr; gap: 20px;
KPI row: grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px;
Breakpoint (≤700px): all grids collapse to 1fr
```

### Sticky Progress Bar

Fixed to top on scroll. `z-index: 200`. Adds stronger shadow class when `window.scrollY > 10`.

---

## Animation Patterns

### Card entrance

```css
@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Staggered: nth-child delay increments of 40ms */
```

### Step transition

```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
duration: 500ms, ease-standard
```

### Error shake

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-5px); }
  60%       { transform: translateX(5px); }
}
duration: 400ms
```

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for all body text.
- Focus states: `box-shadow: 0 0 0 3px rgba(0, 76, 147, 0.25)` on all interactive elements.
- All form inputs have associated labels.
- Required fields marked with `*` in brand red (`#E53E3E`).
- `aria-label` on icon-only buttons.
- Smooth scroll only for navigation — never for content-critical transitions.

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `#004C93` for primary actions | Use brand blue as a page fill background |
| Use Inter at 800–900 for headlines | Mix serif or display fonts |
| Use teal for positive/success states | Use teal decoratively |
| Use `translateY(-2px)` on hover for lift | Use `scale()` for card hover |
| Keep shadows blue-tinted | Use generic `rgba(0,0,0,x)` shadows |
| Use generous whitespace | Stack too many elements without breathing room |
| Use rounded bars in charts | Use flat, square chart elements |
| Keep body text below 65ch | Let text run full viewport width |