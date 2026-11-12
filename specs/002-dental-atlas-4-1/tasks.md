# Tasks: Dental Atlas 4.1 Premium Visual Redesign

**Input**: Design documents from `specs/002-dental-atlas-4-1/`

**Prerequisites**: `spec.md` and `plan.md`

## Phase 1: Setup

- [x] T001 Create isolated `atlas-v4-1/` from `atlas-v4/` without editing `atlas-v4/`, `v2/`, `atlas/`, `main` or production.
- [x] T002 [P] Create `specs/002-dental-atlas-4-1/` design artifacts and document the selected visual direction.

## Phase 2: Three design mockups

- [x] T003 [P] Build the 390 px homepage mockup in `atlas-v4-1/mockups/home-390.html` using confirmed imagery and content.
- [x] T004 [P] Build the 1440 px homepage mockup in `atlas-v4-1/mockups/home-1440.html` using the same visual system.
- [x] T005 [P] Build the doctor/service composition mockup in `atlas-v4-1/mockups/doctor-service.html`.
- [x] T006 Capture mockup screenshots and compare them with V4 for hierarchy, distinctiveness, readability and booking visibility.

## Phase 3: Shared visual foundation

- [x] T007 Add scoped tokens and layout primitives in `atlas-v4-1/assets/atlas-4-1.css` without relying on legacy override order.
- [x] T008 Add scoped interaction enhancements in `atlas-v4-1/assets/atlas-4-1.js` for active navigation, safe-area actions, focus restoration, reduced motion and booking context.
- [x] T009 Update `atlas-v4-1` metadata/canonicals and route markers so the preview is distinct from V4 and not accidentally indexed as production.

## Phase 4: User Story 1 — Homepage (P1)

- [x] T010 [US1] Recompose both branch homepages with image-led hero, branch/location proposition, primary booking action, trust signals and deliberate section order.
- [x] T011 [US1] Replace repetitive card-only presentation for services, doctors, gallery, prices and contacts while preserving links and verified data.
- [x] T012 [US1] Add desktop fixed booking action and mobile safe-area bottom action without obscuring content.

## Phase 5: User Story 2 — Internal pages (P1)

- [x] T013 [US2] Apply a focused service/direction layout with clear purpose, price context, return path and booking action across both branches.
- [x] T014 [US2] Recompose prices pages as readable interactive tables with preserved search/filter behavior and distinct price/duration columns.
- [x] T015 [US2] Recompose doctor index/profile pages around real portraits, confirmed fields, branch context and booking action.
- [x] T016 [US2] Recompose gallery and contacts pages with editorial image treatment, verified details and useful empty/error states.

## Phase 6: User Story 3 — Booking (P1)

- [x] T017 [US3] Restyle booking dialog/pages to support branch/service context, official DentalPRO handoff, phone and verified messengers.
- [x] T018 [US3] Preserve and test the Spanish Quartals limitation state; do not show fabricated slots or success confirmations.
- [x] T019 [US3] Verify keyboard, touch, focus return, Escape/backdrop close and mobile action-bar behavior.

## Phase 7: Validation and release (P2)

- [x] T020 [P] Run static local-link, metadata, image and asset scans for all `atlas-v4-1` routes.
- [x] T021 [P] Run Chromium checks at 320, 360, 390, 430, 768, 1024, 1440 and 1920 px for overflow, console errors, menu, search/filter, modals, gallery and booking.
- [x] T022 Capture phone/desktop screenshots for homepage, doctors, services, gallery and booking plus a V4/V4.1 comparison set.
- [x] T023 Record an independent design audit with concrete strengths, remaining defects and NOT VERIFIED items; do not assign a numeric self-score.
- [x] T024 Commit the separate branch, push it and create a PR without merging or deploying.

## Dependencies

- T001 before T003–T024.
- T003–T006 before T010–T016 so the chosen visual direction is established first.
- T007–T009 before page-family rollout.
- T010–T019 before T020–T023.
- T020–T023 before T024.

