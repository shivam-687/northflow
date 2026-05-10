# NorthFlow — Web Tech Stack & Architecture

# Purpose of This File

This document defines:
- frontend architecture
- backend stack
- database structure
- deployment strategy
- engineering conventions
- folder structure
- scaling direction

The goal is:
- fast development
- maintainable architecture
- clean developer experience
- modern scalable foundation

---

# Product Requirements

NorthFlow should be:
- mobile-first
- fast
- lightweight
- smooth
- offline-friendly later
- realtime-ready
- AI-integration ready

The stack should optimize for:
- developer velocity
- simplicity
- scalability
- clean UX

---

# Frontend Stack

## Framework
Next.js (App Router)

Why:
- modern React architecture
- server components
- fast routing
- optimized rendering
- strong ecosystem
- Vercel-native deployment

---

# Language
TypeScript

Why:
- scalability
- safer refactoring
- better DX
- predictable APIs

---

# Styling
Tailwind CSS

Why:
- fast UI iteration
- consistent spacing system
- easy dark theme support
- component-driven styling

---

# Component System
shadcn/ui

Why:
- accessible primitives
- highly customizable
- works well with Tailwind
- minimal visual opinion

---

# Icons
Lucide Icons

Why:
- minimal outline style
- lightweight
- matches NorthFlow visual direction

---

# Animations
Framer Motion

Use for:
- soft transitions
- fades
- subtle movement
- sheet animations
- screen transitions

Avoid:
- flashy motion
- bounce-heavy animation
- gamified interactions

---

# State Management

## MVP Recommendation
Zustand

Why:
- lightweight
- simple mental model
- minimal boilerplate
- scalable enough for MVP

---

# Data Fetching

## Recommendation
TanStack Query (React Query)

Use for:
- caching
- optimistic updates
- realtime sync
- server state

---

# Backend Stack

## Backend Platform
Supabase

NorthFlow will use Supabase for:
- authentication
- PostgreSQL database
- realtime updates
- storage
- edge functions
- row-level security

This significantly reduces backend complexity for MVP.

---

# Authentication

## Provider
Supabase Auth

Supported login methods:
- GitHub
- Google
- Email/password

GitHub login should feel primary because product is developer-focused.

---

# Database

## Database Engine
PostgreSQL via Supabase

Why:
- relational structure fits product well
- strong querying capabilities
- scalable
- easy analytics later

---

# Core Database Models

# users

Purpose:
store account information.

Fields:
- id
- name
- email
- avatar_url
- timezone
- created_at

---

# goals

Purpose:
store directional goals.

Fields:
- id
- user_id
- title
- description
- status
- started_at
- completed_at
- archived_at
- created_at

Statuses:
- active
- future
- paused
- completed
- archived

Important rule:
ONLY ONE active goal per user.

---

# supporting_themes

Purpose:
support identity-oriented sub-focuses.

Examples:
- System Design
- Leadership
- Deep Work

Fields:
- id
- goal_id
- name
- created_at

---

# activities

Purpose:
store daily meaningful work logs.

Fields:
- id
- user_id
- goal_id
- content
- tag
- created_at

Tags:
- goal
- learning
- admin
- noise

---

# reflections

Purpose:
store emotional reflections.

Fields:
- id
- user_id
- mood
- note
- created_at

---

# weekly_summaries

Purpose:
AI-generated weekly awareness summaries.

Fields:
- id
- user_id
- summary_text
- alignment_score
- created_at

---

# Future Tables

## github_activity
GitHub integration sync.

## deep_work_sessions
Focus tracking.

## ai_insights
AI-generated behavioral insight.

---

# Realtime Features

Future realtime usage:
- live timeline updates
- reflection sync
- collaborative accountability features

Supabase realtime is sufficient for MVP.

---

# File Storage

## Use Supabase Storage

For:
- avatars
- exported reports
- attachments later

---

# API Architecture

## Recommendation
Use:
- Next.js Route Handlers
- Server Actions where appropriate
- Supabase client SDK

Avoid:
- overly complex backend abstraction for MVP

---

# Folder Structure

/app
/components
/features
/hooks
/lib
/services
/types
/styles
/utils

---

# Suggested Feature Structure

/features
  /today
  /goal
  /reflection
  /weekly
  /settings

Each feature contains:
- components
- hooks
- services
- types
- state

---

# UI Component Structure

/components/ui

Reusable primitives:
- buttons
- pills
- cards
- sheets
- navigation
- inputs
- timeline items

---

# Deployment

## Frontend
Vercel

Why:
- native Next.js optimization
- preview deployments
- edge support
- easy scaling

---

# Backend
Supabase Cloud

---

# Monitoring & Analytics

Future recommendations:
- PostHog
- Sentry
- Vercel Analytics

Avoid heavy analytics overload inside product.

---

# AI Integration Strategy

NorthFlow will eventually use AI for:
- reflection summaries
- weekly insights
- emotional pattern awareness
- productivity narrative generation
- focus pattern detection

AI should feel:
- subtle
- thoughtful
- non-invasive

Avoid:
- chatbot-first experience
- loud AI assistant behavior

---

# Performance Goals

NorthFlow should feel:
- instant
- lightweight
- fluid
- responsive

Goals:
- fast first load
- optimistic updates
- minimal loading states
- smooth animations

---

# Security

Use:
- Supabase Row Level Security (RLS)
- protected API routes
- secure auth sessions

Reflection and personal data should feel:
private and safe.

---

# Mobile-First Rules

NorthFlow is designed:
mobile-first.

All screens should:
- work naturally on phones
- support keyboard interactions
- preserve bottom safe area
- feel native-like

---

# Future Scaling Direction

Potential future architecture:
- AI processing service
- event-driven activity pipeline
- vector search for reflections
- recommendation engine
- career insight engine

Current MVP should remain:
simple and focused.

---

# Engineering Philosophy

NorthFlow engineering should prioritize:
- simplicity
- readability
- calm developer experience
- maintainability
- intentional architecture

Avoid:
- premature complexity
- over-engineering
- unnecessary abstractions

---

# Most Important Engineering Rule

Every technical decision should answer:

> “Does this help preserve product clarity and simplicity?”

If not:
reconsider it.

