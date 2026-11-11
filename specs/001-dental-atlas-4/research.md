# Research Notes: Dental Atlas 4.0

## Existing preview

- The repository already contains an `atlas/` Gate 3 single-workspace experience and a `v2/` multi-page experience.
- The new work will copy the multi-page information architecture into `atlas-v4/` so the current `atlas/` and `v2/` trees remain available for comparison.
- Existing `v2/data/services_master.json`, `v2/data/doctors.json`, and `v2/data/clinic-content.json` record source URLs and verification dates. They remain the only content source for the preview.

## DentalPRO handoff

The official DentalPRO help pages describe a website booking form in which a patient can select a branch, visit, doctor, date and time after the clinic enables the feature. The project does not contain a confirmed API credential or branch-specific API contract, so the preview must keep the external handoff and explicitly state when a branch is not passed through.

Sources reviewed:

- [DentalPRO online booking through a clinic website](https://dental-pro.online/support_new/onlayn-zapis-patsienta-cherez-sayt-kliniki7935/)
- [DentalPRO release notes for website booking](https://dental-pro.online/support_new/reliz-16-8-13/)

## Decisions

1. Reuse existing verified data and static pages instead of adding a new backend.
2. Add a separate `atlas-v4/` preview path and branch; do not alter `atlas/`, `v2/`, production, or external CRM settings.
3. Keep the current official phone, messaging links and DentalPRO URL; show a phone fallback when a branch cannot be passed to DentalPRO.
4. Add metadata, gallery lightbox, sticky CTA safe-area rules, and explicit unavailable/error states as a thin enhancement layer over the existing static pages.
