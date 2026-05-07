# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Next.js with Turbopack)
npm run build     # production build
npm run lint      # ESLint
```

No test framework is configured yet.

## Stack

- **Next.js 16** (App Router) with **React 19**
- **TypeScript** (strict mode via tsconfig)
- **Tailwind CSS v4** (configured via PostCSS)

## Architecture

This is an early-stage Next.js App Router project. All application code lives under `src/app/`:

- `layout.tsx` — root layout with Geist font and global CSS
- `page.tsx` — home page (currently the default scaffold)
- `globals.css` — Tailwind base styles and CSS custom properties

App Router conventions apply: files named `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` etc. are route segments. Server Components are the default; add `"use client"` only when browser APIs or interactivity are needed.
