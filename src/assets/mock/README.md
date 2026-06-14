# Mock auth fixtures

`db.json` is the in-memory "database" served to `MockApiService`
(`src/app/core/data-access/mock-api.service.ts`). It is loaded once via
`HttpClient.get('/assets/mock/db.json')` and cached in memory — any users
created via Sign Up are **not** written back to this file, so the data
resets on a full page reload.

## Test accounts

| Email | Password | Use for |
| --- | --- | --- |
| `ada.eze@unilag.edu.ng` | `Password123` | **Valid login** — Sign In success path |
| `tunde.bakare@unilag.edu.ng` | `Password123` | **Existing account** — Sign Up "email already in use" error path |

## Events fixtures

`events` holds 18 entries (`evt-01`..`evt-18`) matching the `EventDetails`
interface, spread across all six `EventCategory` values. `EventsService`
(`src/app/features/events/data-access/events.service.ts`) reads them and joins
each with the current user's bookmark / RSVP state from `userEvents`.

### Fixture reference date

The fixture is authored against a **reference date of `2026-06-01`**. Past- vs
future-event behaviour (Schedule filtering, `getUpcomingEvents`) uses the real
system clock at call time, so future events are dated **2026-09 through
2027-04** to stay comfortably in the future for this project's lifetime.

- **Past events** (excluded from My Schedule, used to exercise filtering):
  `evt-17` (`2026-03-15`) and `evt-18` (`2025-11-20`). Neither is referenced by
  any user's `rsvpd`/`saved` list.
- **Image vs placeholder:** `evt-01`, `evt-02`, `evt-04`, `evt-06`, `evt-13`
  have `imageUrl` (Search result cards). The rest omit it (Home's
  `ImagePlaceholderComponent` fallback).

### Seeded `userEvents`

| User id | `rsvpd` | `saved` | Exercises |
| --- | --- | --- | --- |
| `user-1` (Ada Eze) | `evt-01`, `evt-04` | `evt-02`, `evt-06` | Happy-path demo — all future-dated, so all appear in My Schedule |
| `user-2` (Tunde Bakare) | `evt-08` | _(empty)_ | Empty-state — SAVED tab renders the empty state |
