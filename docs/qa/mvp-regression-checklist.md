# MVP Regression Checklist

End-to-end manual pass through the full MVP loop (discovery → details → RSVP/Save →
my schedule). Run against a local build: `ng serve`, then walk each step via real UI
interactions (no direct URL editing except where a step says so).

**Test data:** see `src/assets/mock/db.json` README. `user-2`
(`tunde.bakare@unilag.edu.ng` / `Password123`) has an empty SAVED list for verifying
empty states. Sign-up creates a brand-new in-memory user with empty RSVP/saved lists.

| # | Step | Expected | Result |
| --- | --- | --- | --- |
| 1 | `/sign-up` → create a new account | Lands on `/home` | ☐ |
| 2 | `/home` | Greeting shows the new user's name; 7 category chips render; "Upcoming in Unilag" shows up to 2 featured cards | ☐ |
| 3 | Click a category chip (e.g. "SPORTS") | Lands on `/search?category=sports`, dropdown pre-selected "SPORTS", results filtered to sports | ☐ |
| 4 | On `/search`, type a query in the search bar | Results filter by title (case-insensitive); `q` param updates in URL | ☐ |
| 5 | Click "REGISTER" on a search result → on `/events/{id}` click "Register" | Navigates to event details; button label flips to "Cancel Registration" | ☐ |
| 6 | Click the bookmark/save toggle on `/events/{id}` | Icon switches to filled (`BookmarkCheck`); state persists on the page | ☐ |
| 7 | Navigate to `/schedule` | RSVP'D tab shows the just-registered event under its date header; SAVED tab shows the just-bookmarked event | ☐ |
| 8 | Click "View Details" on a schedule card | Returns to `/events/{id}` with correct data | ☐ |
| 9 | Navigate to `/account` via the avatar **and** separately via the nav drawer | Both show the same user's name/email | ☐ |
| 10 | Click "Sign Out" | Redirected to `/login`; manually visiting `/home` redirects back to `/login` | ☐ |
| 11 | `/login` with the just-created credentials | Lands on `/home`; prior RSVP/saved state intact (same in-memory session) | ☐ |

## How to run

```bash
ng serve
# open http://localhost:4200/sign-up and follow steps 1–11
```

Mark each row ✅ pass / ❌ fail. For any failure, record reproduction notes,
console errors, and a screenshot reference under "Defect notes" below. Treat a
cross-screen sync failure (e.g. step 7/11) as higher priority than fast-follow work —
it usually points at an `EventsService`/`AuthService` state bug rather than an
isolated component.

## Defect notes

> Status: **not yet executed.** This checklist is authored as part of SPR10-05;
> run it against a local build and fill in results here.
>
> Note (known limitation, not a defect): `EventsService` toggle state is in-memory
> only and resets on a full page reload — re-running step 11 after a hard refresh
> will show seeded state, not session edits. This is the documented MVP mock-backend
> behavior (SPR4-03 / SPR8-05), not a regression.
