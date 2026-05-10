# NorthFlow — Design System & UI Guidelines

## Core Design Philosophy

NorthFlow should feel:
- calm
- reflective
- intelligent
- premium
- developer-first
- emotionally grounded

The UI should NEVER feel:
- corporate
- dashboard-heavy
- startup-noisy
- gamified
- productivity-hustle focused
- analytics overloaded

NorthFlow is:
> A quiet workspace for engineering clarity.

---

# Emotional Tone

| Emotion | Why |
|---|---|
| Calm | Developers already feel mentally overloaded |
| Focused | Product should reduce mental fragmentation |
| Honest | Avoid fake productivity energy |
| Reflective | Encourage awareness, not pressure |
| Premium | Simplicity should feel intentional |
| Technical | Built for engineers, not generic consumers |

---

# Visual Inspiration

Primary inspirations:
- Apple Human Interface
- Linear
- Arc Browser
- Raycast
- GitHub Dark UI
- Apple Journal

NorthFlow should visually feel like:
> Apple designed a self-awareness tool for software engineers.

---

# Typography System

## Primary Font
Inter

## Monospace Accent
JetBrains Mono

Used for:
- timestamps
- metadata
- labels
- percentages
- tags
- tiny section headers

---

# Typography Scale

## Display Heading
- 40–44px
- Weight: 600
- Line Height: 1.1

## Primary Heading
- 32px
- Weight: 600
- Line Height: 1.15

## Body Large
- 20px
- Weight: 500

## Body Default
- 16px
- Weight: 500
- Line Height: 1.5

## Secondary Text
- 14px
- Weight: 400

## Tiny Metadata
- 12px
- JetBrains Mono
- Uppercase
- Letter spacing: 0.08em

---

# Color System

## Background
#0B0D10

## Base Surface
#111418

## Elevated Surface
#171B21

## Border
rgba(255,255,255,0.06)

## Primary Text
#F5F7FA

## Secondary Text
#98A2B3

## Disabled Text
#667085

---

# Accent Colors

## Primary Accent
Muted Purple
#7C5CFF

## Semantic Colors

| Meaning | Color |
|---|---|
| Goal | #8B5CF6 |
| Learning | #22C55E |
| Admin | #6B7280 |
| Noise | #F59E0B |

Avoid:
- neon colors
- saturated gradients
- strong red warnings

---

# Spacing System

Core spacing scale:

4
8
12
16
24
32
48
64

---

# Layout Rules

## Horizontal Padding
20px

## Major Section Gap
32px

## Internal Component Gap
12–16px

---

# Radius System

## Major Cards
20px

## Pills / Buttons
12px

---

# Shadow Philosophy

Very subtle.

Example:

box-shadow:
0 1px 2px rgba(0,0,0,0.2),
0 8px 24px rgba(0,0,0,0.18);

---

# Card Philosophy

Only ONE visually elevated card should exist per screen.

If everything becomes a card:
nothing feels important.

Use:
- typography
- spacing
- rhythm
- subtle grouping

instead of card overload.

---

# Motion System

Motion should feel:
- soft
- intelligent
- calm
- responsive

Avoid:
- bounce
- flashy animation
- gamification energy

## Animation Timing
- Fast interactions: 120ms
- Screen transitions: 180–220ms

## Allowed Motion
- fade
- opacity transition
- slight upward movement
- soft scale

---

# Navigation System

Bottom navigation tabs:
- Today
- Week
- Goal
- Settings

Style:
- muted inactive states
- subtle active indicator
- blurred glass-like background
- thin iconography

---

# Icon Guidelines

Use:
- minimal outlined icons
- thin strokes
- rounded geometry
- monochrome style

Avoid:
- colorful icons
- filled cartoon icons
- heavy icon packs

Preferred style:
- SF Symbols direction
- Lucide icons

---

# Input Philosophy

Inputs should feel:
- lightweight
- invisible until focus
- calm
- native-like

Quick-add input is the most important interaction in the app.

---

# Design Rule

Every UI decision should answer:

> “Does this reduce mental noise?”

If not:
remove it.
