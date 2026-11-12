# Feature Specification: Dental Atlas 4.1 Premium Visual Redesign

**Feature Branch**: `codex/dental-atlas-4-1-premium`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "Redesign the Dental Atlas 4.0 preview into a distinct premium high-tech clinical experience while preserving verified content and existing functionality."

## User Scenarios & Testing

### User Story 1 - Understand the clinic immediately (Priority: P1)

A prospective patient opens either branch homepage and quickly understands the clinic identity, location, main treatment directions, reasons to consider the clinic, and how to start a verified booking handoff.

**Why this priority**: The homepage is the first conversion and trust surface; the current V4 was rejected as visually derivative and insufficiently expressive.

**Independent Test**: At 390 px and 1440 px, a reviewer can identify branch, location, key directions and booking action without opening a secondary page, and the composition is visibly distinct from V4.

**Acceptance Scenarios**:

1. **Given** a visitor opens either branch homepage, **When** the first viewport renders, **Then** the branch, clinic proposition, location and primary booking action are visible without horizontal scrolling.
2. **Given** a visitor scrolls the homepage, **When** they move through the page, **Then** services, doctors, advantages, confirmed photography, prices and contacts appear in a deliberate hierarchy rather than as repeated generic cards.
3. **Given** a visitor compares a V4 screenshot with V4.1, **When** they review typography, composition and color hierarchy, **Then** V4.1 is recognizably a new visual system rather than a CSS recolor.

### User Story 2 - Explore services, prices and doctors with confidence (Priority: P1)

A patient browses treatment directions, a specific service, the interactive price list, doctors and clinic information using page layouts appropriate to each content type.

**Why this priority**: Patients need clear information before contacting a clinic; dense inherited templates reduce trust and comprehension.

**Independent Test**: A reviewer can reach a service detail, price entry, doctor profile and contact page from either branch without dead ends, while verified content remains unchanged.

**Acceptance Scenarios**:

1. **Given** a visitor opens a service or direction page, **When** they scan the page, **Then** the purpose, relevant verified price context, next action and return path are clear.
2. **Given** a visitor opens the prices page, **When** they search or filter, **Then** the result list remains readable, the price and duration stay visually distinct, and no horizontal scroll appears at 390 px.
3. **Given** a visitor opens a doctor profile, **When** they review it, **Then** the portrait, confirmed specialization, experience/education fields, branch context and booking action form a focused profile composition.
4. **Given** a visitor opens gallery or contacts, **When** they inspect the page, **Then** real existing images and verified contacts are presented without fabricated staff, reviews, addresses or claims.

### User Story 3 - Start booking through verified channels (Priority: P1)

A patient selects a branch and service context, then chooses an official DentalPRO handoff, phone call or verified messenger without seeing fabricated slots or success states.

**Why this priority**: Booking is the primary action, but the external system is authoritative for available doctors, dates and times.

**Independent Test**: From homepage, service, doctor and booking pages, a reviewer can open the booking UI, retain the selected context, and reach an official channel or clear limitation state.

**Acceptance Scenarios**:

1. **Given** a visitor activates booking on mobile, **When** the booking surface opens, **Then** branch and service context are visible, the modal is keyboard/touch usable, and the bottom action bar respects the safe area.
2. **Given** a visitor activates booking on desktop, **When** the booking surface opens, **Then** the fixed header/action remains reachable and the patient can choose official DentalPRO, phone or verified messenger options.
3. **Given** the selected branch lacks a verified branch-specific online endpoint, **When** the visitor attempts to book, **Then** the interface states the limitation and provides the verified phone fallback instead of inventing slots or a success confirmation.

### User Story 4 - Review a coherent premium experience (Priority: P2)

A reviewer compares V4.1 against V4 using approved mockups and screenshots, then checks the visual system across phone, tablet and desktop sizes.

**Why this priority**: Independent visual acceptance is required before any later merge or publication.

**Independent Test**: The branch contains three explicit design mockups and a repeatable screenshot/audit set covering all requested widths.

**Acceptance Scenarios**:

1. **Given** the design phase is complete, **When** a reviewer opens the mockups, **Then** they see a 390 px homepage, a 1440 px homepage, and a doctor/service composition before the full route rollout.
2. **Given** a reviewer checks widths 320, 360, 390, 430, 768, 1024, 1440 and 1920 px, **When** they inspect pages and interactions, **Then** there is no horizontal overflow, clipped text, unusable modal, or broken menu/search/filter behavior.

## Edge Cases

- A real image fails to load: preserve the layout and expose a clear unavailable state; do not replace it with an unrelated image.
- A branch/service/doctor context is missing: show a useful neutral state and route to a verified contact channel.
- The external DentalPRO route changes or is unavailable: keep the limitation visible and retain the verified phone fallback.
- A user opens a modal with keyboard focus or a narrow viewport: trap/restore focus appropriately and keep close/action controls reachable.
- Reduced-motion preference is enabled: avoid nonessential motion while preserving all interactions.

## Requirements

### Functional Requirements

- **FR-001**: The new preview MUST be implemented in a separate branch and path while leaving V4, `main`, production and verified source data unchanged.
- **FR-002**: The preview MUST introduce a coherent visual system with intentional typography, spacing, color hierarchy, image treatment and motion; it MUST not rely on accumulated V2/V6/V7 overrides as the primary design layer.
- **FR-003**: Each branch homepage MUST communicate clinic identity, branch/location, key directions, trust signals and a verified booking action in the first meaningful viewport.
- **FR-004**: Homepage sections MUST use a deliberate narrative order for services, doctors, advantages, confirmed photography, prices and contacts, avoiding repetitive card grids as the sole layout pattern.
- **FR-005**: Service, direction, price, doctor, gallery, contact and booking route families MUST have distinct compositions appropriate to their content while retaining verified names, prices, durations, addresses and contact links.
- **FR-006**: Price pages MUST support readable search/filter interaction with clear separation of service name, price and duration.
- **FR-007**: Doctor profiles MUST prioritize real portraits and confirmed profile fields, with a clear branch context and booking action.
- **FR-008**: Booking UI MUST preserve branch/service context and provide only verified DentalPRO, phone and messenger channels; it MUST NOT claim a slot, booking success or doctor availability that is not confirmed by the external system.
- **FR-009**: Mobile booking actions MUST remain reachable in a safe-area-aware bottom surface; desktop booking actions MUST remain reachable from the header or fixed action surface.
- **FR-010**: Navigation, branch switching, breadcrumbs, back paths, menus, service search, price filters, modals, gallery lightbox and empty/error states MUST remain functional after the redesign.
- **FR-011**: The preview MUST use only existing confirmed photographs and clinical data; it MUST NOT add fabricated doctors, reviews, services, addresses, qualifications or treatment claims.
- **FR-012**: Every preview route MUST have appropriate indexability metadata for review, unique title/description/canonical values, and no accidental duplication with V4 routes.
- **FR-013**: The implementation MUST be checked at 320, 360, 390, 430, 768, 1024, 1440 and 1920 px with no horizontal overflow, clipped content, broken touch targets or unusable keyboard focus.
- **FR-014**: The branch MUST include three design mockups and comparison screenshots showing the selected direction before the full route rollout.
- **FR-015**: The final branch MUST provide a reviewable commit/PR and a repeatable local preview; it MUST NOT be merged or deployed to production.

### Key Entities

- **Branch**: One of the verified clinic locations, with its confirmed name, address, phone and booking limitation state.
- **Service**: A verified dental treatment or category entry with confirmed name, description context, price and duration where available.
- **Doctor**: A verified specialist profile with real portrait and confirmed professional fields.
- **Booking Context**: The branch and optional service/doctor context carried into an official contact or DentalPRO handoff.
- **Visual Mockup**: A screenshot artifact representing the selected 4.1 composition at a required viewport.

## Success Criteria

### Measurable Outcomes

- **SC-001**: In a five-second first-viewport review at 390 px and 1440 px, reviewers can identify the branch/location and the primary booking action on both branch homepages.
- **SC-002**: At least 90% of representative navigation, service search/filter, gallery and booking checks complete without a dead end or ambiguous next action.
- **SC-003**: All audited route families render without horizontal overflow at 320, 360, 390, 430, 768, 1024, 1440 and 1920 px.
- **SC-004**: Browser console and network checks report zero JavaScript errors and zero missing local assets on the audited representative routes.
- **SC-005**: The V4.1 homepage, doctor profile and service page are visually distinguishable from V4 in side-by-side screenshots while preserving the verified content and primary actions.
- **SC-006**: No test run creates a real booking, changes production, merges `main`, or alters verified prices, doctors or external booking configuration.

## Assumptions

- Existing V4 verified data, photos, route tree and functional JavaScript are the content baseline; V4 remains available for comparison.
- The redesign is a static preview and does not introduce a backend or new booking API.
- Official DentalPRO remains the authority for live availability; where the current project lacks a verified branch-specific endpoint, phone fallback is the safe default.
- The design direction is chosen from the three required mockups using hierarchy, distinctiveness, readability and task completion rather than subjective numeric scoring.
