# Code Review

Findings from reviewing the original code. Each one lists what is wrong, why it matters and how to improve it. Items marked **(fixed)** were fixed in this repository; the rest are left on purpose and explained.

## Backend

### Bugs

1. **PATCH /tasks/:id lets clients overwrite any field (fixed).**
   - *What:* `updateTask` did `{ ...existingTask, ...updates }` with the raw request body. Sending `{"title":"ok","id":"x","createdAt":"..."}` rewrote `id` and `createdAt`.
   - *Why:* A client can corrupt identity and audit fields, and break every later lookup by id.
   - *Fix:* The controller now runs `validateUpdateTask`, which whitelists `title` and `completed` and rejects anything else with a 400.
2. **Activity ids are `Date.now()` (fixed).** Two entries created in the same millisecond share an id. Now uses `createId()` (UUID) like tasks.
3. **POST /activity stores anything (fixed).** `{}` or `{"action": 5}` was saved. `action` and `info` are now validated as optional strings.
4. **Activity errors are not handled (fixed).** The activity controller was not wrapped in `asyncHandler`, and the service called `JSON.parse` synchronously. A corrupt `activity.json` threw outside the error middleware. Routes now use `asyncHandler`.
5. **Data paths depend on the working directory.** `path.join(process.cwd(), 'data', ...)` breaks if the server is started from another folder. *Fix:* resolve from `__dirname` or a `DATA_DIR` env var. Left alone because it is a config change that does not affect the current `npm start` flow.
6. **Read-modify-write races.** Two concurrent requests can read the same file and the second write drops the first. Writes are also not atomic (a crash mid-write leaves a truncated file). *Fix:* serialize writes with a small queue/lock and write to a temp file then `rename`. Left alone because the brief requires JSON files only and a lock is more than this change needed; a real database removes the problem.

### Performance

1. **Synchronous fs in the activity service (fixed).** `readFileSync`/`writeFileSync`/`existsSync` block the event loop for every request. Now uses the async `jsonStore`.
2. **Whole file read on every request.** Every list/get reads and parses the full JSON file. Fine at this size; for growth add pagination and an in-memory cache or a database.

### Maintainability

1. **Unused validator, duplicated validation (fixed).** `taskValidator.js` existed but was never called. The controller re-implemented the same checks inline and the service repeated them a third time. The controller now uses the validator and the service keeps only business rules.
2. **Duplicate functions (fixed).** `loadDataA` and `loadDataB` were identical, and the activity service did not reuse `jsonStore`.
3. **Inconsistent error format.** Controllers returned `res.status(400).json(...)` directly while the rest of the app throws `HttpError`. Now everything throws `HttpError` and the error middleware formats the response.

### Code quality

1. **Naming (fixed):** `get_activity`, `aSvc`, `fp`, `x`, `made`, `bodyData`. Renamed to `listActivity`, `activityService`, `ACTIVITY_FILE_PATH`, etc.
2. **Inconsistent title rule.** Updates required 2+ characters, creates accepted 1. Kept as is to avoid changing existing behavior; worth deciding on one rule and putting it in the validator.
3. **No tests.** There is no automated test for any endpoint. I verified the endpoints manually with curl; the next step would be supertest tests for tasks, activity and reports.

### Security

1. **No body size limit, rate limiting or security headers.** `express.json()` uses the default limit and there is no `helmet` or rate limiter. Add `helmet`, `express-rate-limit` and an explicit `limit`.
2. **No authentication or authorization.** Anyone who can reach the API can read and change every task. Acceptable for a local app, not for production.
3. **No CORS policy.** The browser only calls the Next.js API routes, so CORS is not needed today. If the backend is ever called from a browser directly, add an explicit allow-list.
4. **4xx messages echo input details** through `error.details` (e.g. `unsupportedFields`). Low risk, but keep details out of public-facing production responses if they might leak internals.

## Frontend

### Bugs

1. **Wrong default backend port (fixed).** `.env.example`, `constants.ts` and the docs pointed at `localhost:4000`, but the API listens on `3000`. A fresh checkout showed an error on every page. Now `3000` everywhere.
2. **Backend errors always become HTTP 500 (fixed).** Next API routes caught every error and returned 500, so a 404 or 400 from the backend lost its status. A `BackendError` now carries the status and the routes pass it through.
3. **Activity fetch ignores failures (fixed).** `fetch(...).then(r => r.json())` never checked `response.ok`; a failed request cleared the list and the user saw an empty feed with no message. Now there are loading and error states with Retry.

### Performance

1. **Activity page re-renders forever (fixed).** A `setInterval` bumped `tick` every 1.4 s, which re-ran the filter effect and rebuilt the list every time. The page re-rendered and copied the array continuously for no reason. Removed.
2. **Filter ran twice (fixed).** `applyFilterA` then `applyFilterB` on the same data (identical logic). Replaced by one memoized filter.

### React best practices

1. **Derived state kept in `useState` (fixed).** `shownActivity` and `forcedList` were copies of data derivable from `allActivity` and `query`, kept in sync through effects. Now computed with `useMemo`.
2. **Data fetching inside the page component (fixed).** Moved to `useActivity`, with a thin page and a presentational `ActivityFeed`.
3. **Duplicate helpers inside the component (fixed).** `formatTimeA/B` and `applyFilterA/B` were redefined on every render. Removed.
4. **`requestJson` nested try/catch (fixed).** The helper threw inside a `try` and caught its own error. Replaced by a single `lib/apiClient.ts` used by all hooks.
5. **Server and client components.** Pages are server components that render a client component, which keeps client JavaScript small. Kept.

### Maintainability

1. **Inline styles everywhere (fixed).** Spacing and colors were repeated in JSX. Moved to classes and design tokens in `globals.css`.
2. **Duplicated fetch logic (fixed).** `backendApi.ts` repeated the same fetch/parse/throw block three times. Now one `backendRequest` helper.
3. **Loading/error markup duplicated (fixed).** Shared `StateNotice` component.

### Code quality

1. **Task state is shown twice** ("Completed"/"Pending" label plus button text) but styled the same; the badge is now color-coded.
2. **The activity time was rendered twice** with identical formatting (fixed).

### UX issues

1. **Activity feed:** no loading state, no error state, no empty state, and the time shown twice (all fixed).
2. **Task dashboard:** no summary of progress. Now shows "N of M tasks completed".
3. **Navigation:** the only way between pages was a "Back" button to the home page. Added a persistent top navigation with the active page highlighted.
4. **Mark as completed has no optimistic update.** The button shows "Saving..." until the server answers. Acceptable, and avoids showing wrong state if the request fails.

### Security

1. **No input validation of the route id.** The id is interpolated into the backend URL. It is now `encodeURIComponent`-encoded.
2. **The backend URL is public config** (`NEXT_PUBLIC_*`) although only server code uses it. Renaming it to a non-public variable would stop shipping it to the browser. Left alone because it is the documented setup.

### Accessibility

1. Loading uses `role="status"` / `aria-live`, errors use `role="alert"`, the search box has a label, filter buttons use `aria-pressed` and the nav marks the current page with `aria-current`.
