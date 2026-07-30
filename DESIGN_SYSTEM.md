# VigiTrust Design System

## Colour palette

| Token | HEX | Usage |
| --- | --- | --- |
| `--vt-red` | `#C41E3A` | Primary CTA, logo accent, active nav |
| `--vt-red-dark` | `#9E1830` | Button hover/pressed |
| `--vt-red-soft` | `#F8E9EC` | Soft chips, selected states |
| `--vt-navy` | `#0B1F33` | Hero/dark sections, utility bar |
| `--vt-navy-mid` | `#123A56` | Secondary dark panels |
| `--vt-azure` | `#1B4F72` | Links on light surfaces |
| `--vt-cyan` | `#7BA8B0` | Eyebrows/icons on dark |
| `--vt-ink` | `#0A1620` | Headings and body |
| `--vt-slate` | `#3A4F5E` | Secondary text |
| `--vt-muted` | `#5A6F7E` | Captions / meta |
| `--vt-border` | `#D2DCE4` | Dividers, input rings |
| `--vt-mist` | `#F4F7F9` | Page background |
| `--vt-paper` | `#FFFFFF` | Cards, header |
| `--vt-success` | `#1B7A4B` | Success states |
| `--vt-price` | `#7A7F24` | Course prices |

Focus ring: `2px solid #C41E3A` with `3px` offset.

## Typography

**Font:** Inter (400 / 500 / 600 / 700)

| Role | Class / rule |
| --- | --- |
| Display H1 | `.type-display` — clamp 2.25–3.75rem / 1.1 / 700 |
| H2 | `.type-h2` — clamp 1.75–2.5rem / 1.15 / 700 |
| H3 | `.type-h3` — 1.25–1.5rem / 1.25 / 600 |
| Body | base 1.0625rem / 1.65 |
| Body large | `.type-body-lg` |
| Meta | `.type-meta` |
| Eyebrow | `.type-eyebrow` |

## Spacing & layout

- Section: `.section-pad` → `py-16 md:py-20 lg:py-28`
- Container: `.container-vt` → `max-w-7xl`
- Card radius: 10px · Controls: 6px · Large panels: 14px
- Shadow: `--shadow-soft`

## Motion

CSS transitions only (`180ms ease`). Respect `prefers-reduced-motion`.
