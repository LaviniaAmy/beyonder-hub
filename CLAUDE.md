# Beyonder Hub — Claude Code Instructions

## ⚠️ LOCKED SECTIONS — DO NOT MODIFY

The following elements are **permanently locked** and must **never** be changed
unless the user explicitly asks to edit a specific named element.

### Files
- `src/components/BirdCanvas.tsx` — **fully locked**
- `src/pages/Index.tsx` — the hero section and ecosystem intro (detailed below) are **locked**

---

### Locked: Hero section (`src/pages/Index.tsx`)

Everything inside the `<section className="min-h-[345px] md:h-[500px]" ...>` block, including:

- **Sky gradient background** — canvas colours, stops, overlay
- **Legibility overlay** — the semi-transparent dark gradient over the canvas
- **Bird murmuration** (`<BirdCanvas />`) — size, speed, flutter, count, positions
- **Logo** — "Beyonder" wordmark + terra dot, font, size, position (desktop `top: 69` + mobile `pt-14`)
- **Horizon line** — width, opacity, position (`top: 180`)
- **Tagline** — "One place for everything SEND", font size, colour, position (`top: 196` desktop / above search card mobile)
- **Search bar** — desktop two-field bar (`top: 245`) and mobile glass card, all styling and layout
- **Hint chips** — desktop (`top: 307`) and mobile chips, all labels and styling
- **Desktop 3-step strip** — absolute at bottom of hero, all three steps, icons, text, sizing
- **Mobile 3-step strip** — the `md:hidden grid grid-cols-3` block immediately below the hero `</section>`
- **Hero section height** — `min-h-[345px] md:h-[500px]`

---

### Locked: Ecosystem intro (`src/pages/Index.tsx`)

The section immediately after the mobile steps strip:

- **"The Beyonder Ecosystem"** eyebrow label
- **"Everything your family needs, together"** heading
- Supporting paragraph text
- **"Where would you like to start?"** category header row
- **Category grid** — all 5 category cards, icons, labels, subtitles, layout, spacing

---

### Rule

When making any change to `src/pages/Index.tsx` or `src/components/BirdCanvas.tsx`,
only touch the specific element the user has asked about.
Do not adjust spacing, positioning, sizing, colours, or structure of any locked element
as a side-effect of another change.
