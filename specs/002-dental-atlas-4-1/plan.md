# Implementation Plan: Dental Atlas 4.1 Premium Visual Redesign

**Branch**: `codex/dental-atlas-4-1-premium` | **Date**: 2026-11-12 | **Spec**: [spec.md](spec.md)

## Summary

Create a separate `atlas-v4-1/` preview that keeps V4 intact while replacing its inherited presentation layer with a restrained premium clinical system. Use the existing verified data, photos and interaction engine as the baseline; add page-family shells and focused composition rules rather than rewriting booking or price logic.

## Technical Context

**Language/Version**: HTML5, CSS3, browser JavaScript

**Primary Dependencies**: Existing V4 static route tree, verified data/assets, Chromium for visual checks; no new runtime library

**Storage**: Static files and screenshot artifacts only

**Testing**: Playwright/Chromium screenshots, DOM interaction checks, local-link scan, console/network checks and viewport matrix

**Target Platform**: Static preview hosting and modern mobile/desktop browsers

**Project Type**: Static multi-page website preview

**Constraints**: No production deployment, no `main` merge, no changes to V4, verified data, prices, doctors, addresses or DentalPRO configuration

## Design Direction

- Establish a new visual token layer in `atlas-v4-1/assets/atlas-4-1.css`; do not depend on selector-order fights with the existing V2/V6/V7 sheets.
- Use a dark ink/porcelain base with emerald used as a restrained action accent, warm neutral surfaces for trust sections and large editorial type for hierarchy.
- Use asymmetrical image-led compositions for home and doctors, compact editorial service layouts, and a dense-but-readable price table rather than repeating equal cards.
- Use existing clinic/doctor images only; no generated or unverified photography.
- Keep existing V4 JavaScript and booking handoff behavior, adding only scoped behavior needed for the new layouts and focus-safe mobile actions.

## Architecture

1. Copy `atlas-v4/` to `atlas-v4-1/` as a comparison-safe starting point.
2. Scope all new CSS/JS under `body[data-atlas-version="4-1"]` and add a single stylesheet/script pair before legacy styles where practical; avoid modifying `atlas-v4/` files.
3. Add route-family classes (`page-home`, `page-service`, `page-prices`, `page-doctor`, `page-gallery`, `page-contacts`, `page-booking`) and use them for distinct compositions.
4. Add explicit design mockup pages/artifacts under `artifacts/dental-atlas-4-1/mockups/` for home 390, home 1440 and doctor/service composition.
5. Keep `v2.js` and `atlas-v4.js` for verified interactions; add a thin `atlas-4-1.js` layer for active nav, safe-area action bar, gallery/booking focus safeguards and reduced-motion handling.
6. Keep canonical URLs under the separate preview path and ensure metadata is reviewable without indexing production.

## Data and Integration

- Reuse `atlas-v4/data/services_master.json`, `doctors.json`, `clinic-content.json` and existing verified image paths.
- Preserve all visible prices, durations, doctor names, branches and contacts exactly as the V4 baseline unless a source file already contains the value.
- Keep DentalPRO as an external handoff. Do not fabricate slots, doctor availability or booking success; retain the phone fallback for the Spanish Quartals limitation.

## Implementation Phases

1. Create the isolated branch/spec and copy `atlas-v4/` to `atlas-v4-1/`.
2. Build three mockup compositions and capture them at 390/1440 before rolling out.
3. Implement the shared 4.1 visual system and homepage shell.
4. Implement page-family shells for services, prices, doctors, gallery, contacts and booking while preserving behavior.
5. Run visual/interaction regression checks at all required widths, fix confirmed defects, update task checklist, commit and prepare a separate PR.

## Constitution Check

- Verified clinical content: PASS — only existing V4 sources are reused.
- Safe booking handoff: PASS — official channels and explicit limitations only.
- Accessible mobile-first UX: REQUIRED — safe-area actions, focus, touch targets and no overflow are acceptance gates.
- SEO without duplication: REQUIRED — new path has distinct metadata; V4 stays available for comparison.
- Reviewable release: REQUIRED — separate branch/preview; no production or `main` changes.

