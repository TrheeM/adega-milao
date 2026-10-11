# Design — Adega Milão

The adega as a lit back-bar: real bottle photos standing loose on brass shelves, paper price tags on the shelf edge, and a paper comanda that prints the WhatsApp question. No rounded cards.

## Color (roles are strict)

| Token | Value | Role |
|---|---|---|
| `--oak` | `#140c07` | Page ground (charred oak) |
| `--oak-2` / `--cask` | `#1d130b` / `#2a1b10` | Raised surfaces (offer rows, store cards) |
| `--amber` / `--amber-hi` | `#e4a53c` / `#f6cf7d` | Only accent: CTAs, prices, active toggles/cards |
| `--amber-ink` | `#1a0f05` | Text on amber |
| `--foam` / `--muted` / `--faint` | `#f5ecdc` / 68% / 44% | Text tiers |
| `--ice` | `#bfe6f5` | Cold cues only (delivery badge, cup glow) |
| `--paper` / `--paper-ink` | `#efe4cc` / `#24170c` | Shelf tickets and the comanda only |
| Hero theme | `--bg-inner/mid/outer` | Per featured bottle: amber (White Horse), emerald (Tanqueray), magenta (Ballena); GSAP-tweened |

## Type

- Display: **Bodoni Moda** (opsz), 500 for headings, 600–700 for prices. Hero titles `clamp(3.4rem, 8.2vw, 9.8rem)`, line-height .84.
- Text/UI: **Schibsted Grotesk** 400–800.
- Receipt: **Courier Prime**, only inside the comanda.
- Prices: `R$` small sans + integer in Bodoni + superscript cents.

## Components

- **Shelf item**: transparent product photo (no box) under a warm light cone + contact shadow → brass ledge (8px gradient) → small paper price tag hanging from the ledge (price or "Consulte o preço", red "Oferta" flag) → name, size + style on the dark ground → amber outline `Tem disponível?` pill, persisted "Você já perguntou" mark.
- **Hero picker**: three cut-out bottles with name + price, no card; active = full opacity + amber underline.
- **Offers**: hairline-ruled rows, no panels. Lead offer = big photo on a pool of light.
- **Filter toggles / chips / search**: 6px radius, amber pressed state.
- **Buttons**: amber pill (`.btn-wa`), ghost pill (`.btn-ghost`), amber outline pill (`.ask`). All `scale(.97)` on press.
- **Comanda**: paper, zig-zag bottom mask, dotted leaders, 1.2° tilt on desktop.
- Radii: 2px paper tags/flags, 6px controls, 10px dialog, pills for buttons only. No rounded panels or cards anywhere.

## Motion

- Page load (one orchestrated sequence, GSAP timeline, expo.out): title lines blur-rise, bottle turns in on the Y axis from -200° with blur, picker bottles spring up, side title slides in, brand seal spins in.
- Scroll (ScrollTrigger, once): headings blur-rise; lead offer bottle rises onto its light pool then drifts (scrub parallax); shelves get "stocked" (brass ledge draws in, bottles land with back.out, paper tags swing with elastic.out); map unrolls with clip-path.
- Brand in motion: spinning type seal around the bulldog in the hero; logo ticker under the hero that drifts and speeds up with scroll velocity.

- Signature switch: hero bottle turntable on the Y axis (two-faced photo: front + mirrored shaded back; 0→360 power2.in + 15px blur, swap, →720 back.out(0.7); garnish implode → swap → explode back.out(1.5); flavored-ice bars recolor; background + glow tween 1.5s).
- Cursor: bottle tilts (40°/20°), garnish repelled within 400px, parallax ×60 / ×−30 / ×−15.
- Copão: liquid fills via SVG attr tweens, one big flavored-ice bar drops in with bounce (like the real sachet ice), comanda line prints in steps.
- `prefers-reduced-motion`: no intro, reveals, float, repulsion, bubbles, seal spin or ticker; instant fills.

## 3D

Only the hero garnish is 3D (Three.js r169, self-hosted, lazy-loaded after `load`): big flavored-ice bars (copão ice, colored per featured drink), clear normal ice cubes, citrus wheels / GLB cherry, mint leaves. Two canvases (behind and in front of the bottle photo). Cherry model: `assets/models/cherry.glb` (Draco, decoder self-hosted).

## Assets & provenance

- `assets/img/logo-milao.png`, `favicon-64.png`, `apple-touch-icon.png`: cropped from the user's screenshot of the @adega_milao Instagram profile.
- `assets/img/ig-*.jpg`: cropped from the user's screenshot of the @adega_milao Instagram grid (store's own flyers).
- `assets/img/bubble.png`, `assets/models/cherry.glb`: from the GetLayers "Soda" asset pack linked in the user's prompt.
- `assets/img/products/*.webp`: retailer catalog photos (Zona Sul, Savegnago, Prezunic VTEX catalogs; Hits Power from the distributor), background removed with rembg (isnet), holes filled, 1px choke, 560px tall (`-lg` 1100px for hero). `gin-opera.webp` masked by hand from the store's own Combo Gin flyer (no online photo exists).
