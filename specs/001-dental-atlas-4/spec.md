# Feature Specification: Dental Atlas 4.0

**Feature Branch**: `codex/dental-atlas-4-improved`

**Created**: 2026-11-12

**Status**: Draft for review

**Input**: User description: develop a separate Dental Atlas 4.0 preview that grows the existing ДантистЪ clinical preview into a complete, reviewable, multi-page patient experience without replacing the current version or inventing clinical data.

## User Scenarios & Testing

### User Story 1 - Find a relevant service and price (Priority: P1)

A patient selects a real branch, searches or browses a treatment direction, reads a useful service description and sees the published price for that branch.

**Why this priority**: Service discovery and price clarity are the core reasons a patient visits the Atlas.

**Independent Test**: Open the preview at a mobile width, switch branches, search for a known service, open its detail view, and confirm that the title, category, price, caveat and return path remain coherent.

**Acceptance Scenarios**:

1. **Given** the home page, **When** the patient chooses either confirmed branch, **Then** the branch address, phone, hours and service catalogue update together.
2. **Given** the service catalogue, **When** the patient types a partial service name or chooses a category filter, **Then** only matching published positions remain and an empty state explains when there are no matches.
3. **Given** a service detail page, **When** the patient opens it, **Then** a unique title, description, price, branch context, clinical caveat and links to doctors, prices, contacts and booking are visible.

### User Story 2 - Choose a real doctor and clinic information (Priority: P1)

A patient can review confirmed specialists, their published role and experience, view clinic photos and contact information without seeing fictional credentials or branch claims.

**Why this priority**: Trust and location clarity are essential before a patient contacts a clinic.

**Independent Test**: Open doctors, a doctor profile, gallery and contacts at 390 px and 1440 px; verify legible cards, real data labels, image alt text and no horizontal scrolling.

**Acceptance Scenarios**:

1. **Given** the doctors index, **When** the patient opens a card, **Then** the profile exposes only the verified name, role, experience, education or certificate data present in the source data.
2. **Given** the contacts page, **When** the patient switches branch, **Then** the displayed address and phone are consistent with the selected branch and the map area has a clear provider attribution or a non-map fallback.
3. **Given** the gallery, **When** the patient opens a photo, **Then** the image has an informative alt text, remains inside the viewport, and “Все фото” exposes the complete confirmed set.

### User Story 3 - Start a safe booking or contact handoff (Priority: P1)

A patient can preserve the selected branch and service while choosing an official booking or contact channel, with clear messaging when a service or doctor cannot be passed to the external booking system.

**Why this priority**: The Atlas must help patients take the next step without fabricating availability or successful reservations.

**Independent Test**: From home, a service page and a doctor page, open the booking dialog, exercise keyboard escape/back, choose phone or official DentalPRO, and verify that no fake slot or confirmation is displayed.

**Acceptance Scenarios**:

1. **Given** a selected branch and service, **When** the patient opens booking, **Then** the dialog keeps that context visible and offers only confirmed phone, verified messenger or official DentalPRO links.
2. **Given** an unverified or unavailable DentalPRO branch flow, **When** the patient selects online booking, **Then** the UI explains the limitation and offers a phone fallback instead of claiming the booking succeeded.
3. **Given** a narrow viewport or keyboard focus, **When** the dialog opens, **Then** focus is trapped, the close/back controls are reachable, safe-area padding is respected and the floating CTA does not cover content.

### User Story 4 - Understand the site and return easily (Priority: P2)

A patient can move between branch home, directions, services, prices, doctors, gallery and contacts through consistent navigation and meaningful browser history.

**Why this priority**: A clear information architecture reduces dead ends and supports search landing pages.

**Independent Test**: Use header, mobile menu, breadcrumbs and footer links to traverse all primary sections, then use browser back/forward and confirm branch context is retained.

**Acceptance Scenarios**:

1. **Given** any primary page, **When** the patient opens the navigation, **Then** labels do not collide or wrap into unusable controls and every destination has a working URL.
2. **Given** a branch landing page, **When** the patient returns from a service or doctor profile, **Then** the branch and scroll context are understandable and no stale selection is silently applied.

### Edge Cases

- A service identifier is missing or no longer present in the verified catalogue; show a not-found state with links back to the catalogue and contacts.
- A doctor has no published certificates or education details; show only the verified role and experience and omit empty headings.
- The external DentalPRO page, messenger or map cannot be reached; keep the official URL visible, state that live availability is not verified, and provide phone fallback.
- A branch has the same street address as another branch in project data; do not fabricate a second address or claim distinct premises without a source.
- Images fail to load; retain alt text and layout dimensions so surrounding content remains usable.
- Reduced-motion preference is enabled; disable non-essential animation and preserve all interactions.

## Requirements

### Functional Requirements

- **FR-001**: The existing `atlas/` preview MUST remain unchanged and available for comparison while the improved preview lives on a separate branch and path.
- **FR-002**: The improved preview MUST expose separate indexable routes for branch home, directions, service catalogue, category service pages, prices, doctors, doctor profiles, gallery and contacts.
- **FR-003**: Every route MUST use unique, accurate title, description and canonical metadata derived from the page and branch context.
- **FR-004**: Branch, service, price, doctor, contact and gallery content MUST come only from project-verified source data; unknown details MUST be labelled unavailable or omitted.
- **FR-005**: Service catalogue MUST support branch selection, category filtering, text search, visible price and an explicit empty state without changing source prices.
- **FR-006**: Service detail views MUST explain the procedure at a useful level, show the verified price for the selected branch, include a non-guarantee clinical caveat, and link to prices, doctors, contacts and booking.
- **FR-007**: Doctor pages MUST show only verified names, roles, experience, education and certificates and MUST not infer specialities from a portrait.
- **FR-008**: Gallery and clinic pages MUST use only confirmed project images, provide alt text, support a full-gallery view and preserve responsive cropping.
- **FR-009**: Booking UX MUST preserve branch and service context and expose only official phone, verified messaging and DentalPRO links; it MUST NOT create a fake appointment, slot, doctor assignment or success message.
- **FR-010**: The improved preview MUST provide mobile and desktop navigation, sticky CTA behavior with safe-area spacing, keyboard-accessible dialogs, visible focus states, touch targets of at least 42 px and no horizontal overflow at required widths.
- **FR-011**: The map/contact area MUST either embed an approved provider with attribution or present a clear address and contact fallback; it MUST not contain third-party advertising banners.
- **FR-012**: The implementation MUST include loading, empty, error and unavailable states for services, doctors, gallery images and external booking handoffs.
- **FR-013**: The existing branch switcher and theme switcher behavior MUST remain available in the improved preview unless an accessibility correction is required.
- **FR-014**: Verification MUST cover 320, 360, 390, 430, 768, 1024, 1440 and 1920 px, including no-overflow checks, keyboard/focus checks, console errors and primary booking/contact journeys.
- **FR-015**: The branch MUST contain reproducible verification notes and screenshots, and MUST NOT be merged into `main` or deployed to production as part of this task.

### Key Entities

- **Branch**: A confirmed clinic location with name, address, phone, hours, images and booking context.
- **Service**: A published price-list position with category, name, description, per-branch price and source reference.
- **Doctor**: A confirmed specialist profile with verified role, experience, optional education/certificates and source reference.
- **Booking channel**: An official phone, messenger or DentalPRO link with a verified status and fallback behavior.
- **Gallery item**: A confirmed clinic image with alt text, branch association and display order.

## Success Criteria

### Measurable Outcomes

- **SC-001**: At least 10 primary indexable route families (home, directions, services, 10 categories, prices, doctors, doctor profiles, gallery and contacts) open with HTTP 200 in the preview and expose unique metadata.
- **SC-002**: A first-time visitor can reach a confirmed service price and an official contact or booking channel in no more than 4 deliberate interactions from a branch home page.
- **SC-003**: At widths 320–1920 px, all required pages show zero horizontal overflow and no clipped primary controls in automated layout checks.
- **SC-004**: Keyboard and touch checks pass for navigation, service search/filter, doctor links, gallery open/close and booking dialog, including Escape/back and focus return.
- **SC-005**: No page claims a live appointment, slot, doctor assignment or successful reservation when the external source is not verified; unavailable states are explicit.
- **SC-006**: The current `atlas/` content remains byte-for-byte unchanged, and the improved work is isolated to the new branch/path with one reviewable commit and no production deployment.

## Assumptions

- The current repository data files and their recorded verification dates are the authoritative project inputs for this preview.
- The existing official phone, DentalPRO URL, WhatsApp URL and Telegram URL remain valid only where the current project source already marks them as official; no new contact will be invented.
- DentalPRO live schedule and per-branch service mappings are external and may be unavailable to this static preview; the UI will state that limitation rather than simulate it.
- A static GitHub Pages-style preview is sufficient for review; enabling a new public Pages deployment or changing production is outside this task unless a deployment mechanism already exists.
