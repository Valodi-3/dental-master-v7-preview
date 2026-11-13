# Data Model: Dental Atlas 4.0

The preview uses the existing static data files without introducing a server-side persistence layer.

## Branch

- `key`, `name`, `fullName`, `address`, `phone`, `hours`
- `image`, `imageAlt`, `gallery[]`
- `dentalpro` availability is derived from the existing shared booking record; no new live mapping is inferred.

## Service

- `id`, `category`, `name`, `description`
- `pricing.prokshino`, `pricing.ispanskie` with formatted amount
- `meta.verifiedAt`, `meta.prokshinoSource`, `meta.ispanskieSource`

## Doctor

- `slug`, `name`, `shortName`, `role`, `experience`, `portrait`
- optional `education`, `certificates[]`, `practice`, `source`

## Booking channel

- `type`: phone, whatsapp, telegram or dentalpro
- `url`, `label`, `availabilityNote`, `verifiedInProject`

## Gallery item

- `src`, `alt`, `branch`, `displayOrder`

## Invariants

- Prices are display-only and never recalculated by the preview.
- A selected service is context for the handoff, not proof of a live slot or doctor assignment.
- Empty or missing source fields are omitted from the UI.
