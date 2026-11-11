# Tasks: Dental Atlas 4.0

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md)

## Phase 1: Setup

- [x] T001 Create isolated `atlas-v4/` copy from the existing `v2/` route tree without editing `atlas/` or `v2/`.
- [x] T002 [P] Add the feature research, data model and quickstart notes under `specs/001-dental-atlas-4/`.

## Phase 2: Foundational

- [x] T003 Replace `noindex` metadata only in `atlas-v4/` and add unique canonical URLs for every HTML route.
- [x] T004 [P] Add shared `atlas-v4/assets/atlas-v4.css` with clinical contrast, responsive navigation, safe-area CTA, modal focus styling and no-overflow rules.
- [x] T005 [P] Add shared `atlas-v4/assets/atlas-v4.js` for branch/service context, mobile menu safeguards, gallery lightbox, unavailable/error states and booking handoff messaging.

## Phase 3: User Story 1 — Service discovery (P1)

- [x] T006 [US1] Verify branch home, directions, service category and price routes use the existing verified service data and retain search/filter behavior.
- [x] T007 [US1] Add explicit service-detail return/booking links and empty states without altering source prices.

## Phase 4: User Story 2 — Doctors and clinic information (P1)

- [x] T008 [US2] Add `gallery/index.html` for both branches with complete confirmed image sets, alt text and lightbox behavior.
- [x] T009 [US2] Verify doctor profiles, contacts and map fallback expose only verified fields and readable mobile layouts.

## Phase 5: User Story 3 — Safe booking handoff (P1)

- [x] T010 [US3] Add `booking/index.html` for both branches with branch/service context, official channels, DentalPRO limitation state and phone fallback.
- [x] T011 [US3] Verify booking dialog keyboard/focus behavior, context preservation and no fake success/slot claims.

## Phase 6: User Story 4 — Navigation and release (P2)

- [x] T012 [US4] Check header/mobile menu, breadcrumbs, branch switcher and footer links across all route families.
- [x] T013 [US4] Run static scans, browser console checks, viewport screenshots and regression checks at 320/360/390/430/768/1024/1440/1920 px.
- [x] T014 [US4] Commit the isolated preview branch and prepare a review link without merging to `main` or deploying production.

## Dependencies

- T001 before T003–T013.
- T003–T005 before T006–T012.
- T013 before T014.
