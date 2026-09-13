---
name: Barenchi
description: Premium white software company — cinematic software-film hero, oversized software slogan, brown as a restrained accent.
colors:
  paper: "#E5F3FA"
  ink: "#171717"
  muted: "#6B4A35"
  ghost: "#6B4A35"
  brand: "#6B4A35"
  leather: "#6B4A35"
  line: "rgba(23, 23, 23, 0.12)"
  line-strong: "rgba(23, 23, 23, 0.22)"
  scroll: "rgba(23, 23, 23, 0.28)"
  hairline: "rgba(23, 23, 23, 0.06)"
  hairline-mid: "rgba(23, 23, 23, 0.10)"
  atmosphere: "rgba(23, 23, 23, 0.045)"
  atmosphere-axis: "rgba(23, 23, 23, 0.07)"
  soft: "#E5F3FA"
  metal-black: "#121211"
  metal-graphite: "#2A2926"
  metal-frame: "#3C3B37"
  metal-aluminum: "#6E6C66"
  engine-glass: "#0E0E0C"
  engine-warm: "#F0E6D4"
  engine-screen: "#141311"
  studio-high: "#E8E4DC"
  studio-low: "#CFC8BC"
  key-light: "#FFF8F0"
  hero-veil-strong: "rgba(23, 23, 23, 0.76)"
  hero-veil-mid: "rgba(23, 23, 23, 0.28)"
  hero-veil-edge: "rgba(23, 23, 23, 0.34)"
  hero-veil-top: "rgba(23, 23, 23, 0.36)"
  hero-veil-bottom: "rgba(23, 23, 23, 0.52)"
typography:
  manifesto:
    fontFamily: "Instrument Serif, Times New Roman, serif"
    fontSize: "clamp(48px, 5.8vw, 88px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  display:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "clamp(42px, 5vw, 76px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  hero-overlay:
    fontFamily: "Instrument Serif, Times New Roman, serif"
    fontSize: "clamp(48px, 5.8vw, 88px)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.03em"
  hero-overlay-mobile:
    fontFamily: "Instrument Serif, Times New Roman, serif"
    fontSize: "clamp(36px, 10vw, 52px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
  section:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.6rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  fact:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "clamp(26px, 3vw, 40px)"
    fontWeight: 400
    letterSpacing: "-0.04em"
    lineHeight: 1
  display-md:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 400
  card:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 400
  display-sm:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
  lead:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  meta:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  ui:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  compact:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  marker:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.18em"
  inner:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "2.2rem"
    fontWeight: 400
  inner-lg:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "4rem"
    fontWeight: 400
rounded:
  none: "0px"
  sm: "2px"
  pill: "999px"
spacing:
  gutter-sm: "20px"
  gutter-lg: "32px"
  section: "96px"
  max: "1180px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "13px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "13px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "13px 20px"
  nav-cta:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
---

# Barenchi design system

## Product
Barenchi builds digital products around real businesses. The site must read as a software company, not a SaaS template.

## Visual world
White first, brown second. The page field is the hero film’s studio white (`#E5F3FA`) so the robot sits in the site, not on a pasted image. Ink type (`#171717`). Brown (`#6B4A35`) is a 5–10% accent: numbers, hairlines, selected states, hover, and small CTAs. It never paints section backgrounds, large cards, or full-screen fields. No second accent. The cool field is sampled from the film, not used as a blue brand color.

Instrument Sans carries the site. Instrument Serif is the manifesto voice: the hero slogan, and the centered Solutions lockup `Your business.` / `Our technology.` The header is a three-part bar: the mark on the left, a centered **light capsule** (active item an ink pill), Let’s talk on the right. Pill radii belong only to that capsule.

The first viewport is the only visually rich surface: the software film, ungraded, on the same studio white as the rest of the page. Instrument Serif slogan: `Custom` over `software` on the left, `for your business.` on the right. Talk to us is an orb-and-serif lockup, not a filled rectangle. The video is atmospheric, not interactive, and has no baked-in text.

Every section after the hero returns to paper, type, hairline borders, and brown as a whisper. Solutions opens on a centered serif manifesto, then a capability control that opens one specimen still, copy, and Talk to us. Approach is a type field: why this house, not another catalog. Process is a numbered sequence on paper. The closing CTA stays on paper — the primary button is the brown accent.

## Motion
Easing `[0.16, 1, 0.3, 1]`. The authored moment is the slogan rising in the center of the fitted film. `prefers-reduced-motion` holds the poster frame and shows all interface content already in place.

## Layout
Fixed nav at 76px. Hero is the film on studio white: `Custom` over `software` on the left, `for your business.` on the right. Talk to us sits low-right. No supporting paragraph on the film. On small screens the slogan stacks left.

## Do not
Do not use brown as a section, card, or full-screen background. Do not add photography of people, or video, outside the hero. Solutions may carry three treated specimen stills — no faces, no offices, no stock handshake. Do not introduce a second accent color. Do not bake typography, logos, or metrics into the video. Do not invent client names or social-proof numbers. Do not set body text lighter than `#6B4A35` on paper. Pill radii belong only to the header capsule. Do not set `scroll-behavior: smooth` — it cancels the ScrollToPlugin tweens. Do not put a kicker above headings.
