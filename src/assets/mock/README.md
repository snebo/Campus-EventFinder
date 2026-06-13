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
