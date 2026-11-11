# Implementation Plan: Dental Atlas 4.0

**Branch**: `codex/dental-atlas-4-improved` | **Date**: 2026-11-12 | **Spec**: [spec.md](spec.md)

## Summary

Build a separate `atlas-v4/` static preview by reusing the verified multi-page `v2/` information architecture and adding a small enhancement layer for indexable metadata, safe booking context, responsive navigation, gallery lightbox, contact/map fallback and mobile-safe CTAs. The existing `atlas/` and `v2/` trees remain untouched.

## Technical Context

**Language/Version**: HTML5, CSS3, browser JavaScript

**Primary Dependencies**: Existing static assets and `v2` data/engine; no new runtime library

**Storage**: Static files only

**Testing**: Existing Python verification scripts where applicable, HTML/URL scans, Chromium screenshots and browser console checks

**Target Platform**: GitHub Pages-style static hosting and modern mobile/desktop browsers

**Project Type**: Static multi-page web preview

**Performance Goals**: First meaningful content visible quickly on mobile; no blocking dependency added; lazy images retain intrinsic dimensions

**Constraints**: No production deployment, no main merge, no invented clinical data, no fake DentalPRO booking, no unverified contacts

**Scale/Scope**: Two branches, 10 service categories, 254 verified price-list positions, five verified doctor profiles, clinic pages, gallery and booking handoff

## Constitution Check

- Verified clinical content: PASS — reuse only existing source data and labels.
- Safe booking handoff: PASS — external links and explicit limitation states; no slot simulation.
- Accessible mobile-first UX: PASS — overlay rules cover safe-area, keyboard, focus, touch and overflow checks.
- SEO without duplication: PASS — unique route metadata and canonical URLs in the new path.
- Reviewable release: PASS — separate branch/path; current preview and production unchanged.

## Project Structure

```text
atlas-v4/
├── index.html
├── assets/
│   ├── v2.css, v2.js, v2-data.js, reference-v6.css, v7-master.css
│   ├── atlas-v4.css
│   └── atlas-v4.js
├── data/
├── ispanskie/
│   ├── index.html
│   ├── directions/index.html
│   ├── services/*.html
│   ├── prices/index.html
│   ├── doctors/*.html
│   ├── gallery/index.html
│   ├── booking/index.html
│   └── contacts/index.html
└── prokshino/ (same route families)
```

**Structure Decision**: Keep the proven v2 static route tree, copy it to a new path, and add enhancement assets rather than rewriting the current preview or introducing a backend.

## Implementation Phases

1. Copy the existing multi-page preview into `atlas-v4/` and add unique indexable metadata/canonical URLs.
2. Add the enhancement layer for navigation, state, gallery, booking, unavailable states and responsive presentation.
3. Add gallery and booking route pages for both branches.
4. Run static scans and browser checks at all required widths, fix regressions, and record screenshots.
