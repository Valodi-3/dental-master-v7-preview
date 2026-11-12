# Research Notes: Dental Atlas 4.1

## Existing baseline

- V4 is preserved at `atlas-v4/` and remains the comparison baseline.
- Verified service, doctor, branch and image data live in the V4 copy and must not be replaced by invented content.
- The current source does not contain a DentalPRO API contract or branch-specific Spanish Quartals endpoint; the preview therefore keeps an explicit phone fallback.

## DentalPRO handoff

Official DentalPRO material describes online booking as a configured flow where a patient can select a branch, visit/service, doctor and date/time when those options are enabled by the clinic. See [official online booking documentation](https://dental-pro.online/support_new/onlayn-zapis-patsienta-cherez-sayt-kliniki7935/) and [official release notes](https://dental-pro.online/support_new/reliz-16-8-13/).

## Design decision

V4.1 uses an image-led premium clinical system: dark ink header/hero anchors, porcelain content surfaces, restrained emerald actions and warm neutral trust sections. Layouts are composed by page family instead of applying one repeated card grid everywhere.
