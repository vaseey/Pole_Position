# Deferred / Known Items

Tracked items we've consciously decided **not** to do yet, with the reasoning,
so they don't get silently lost. Revisit when the trigger conditions below are met.

---

## F1 — Route-based code-splitting (admin/forum/quiz)

**Status:** Deferred (low priority)
**Source:** Pole Position UX audit, finding F1

### What it is
The entire app is one component tree in a single file (`src/PolePosition_Preview.jsx`,
~3,300 lines) that builds into one JS bundle. Every visitor downloads all of it on
first load — including the admin console, forum, and quiz code that anonymous
browsing visitors never use.

### Why we're skipping it (for now)
- **The audit's headline reason was wrong.** It claimed a ~65 KB hardcoded
  `CAR_DATABASE` table was shipping to every visitor. Verified: that was dead code
  Vite already tree-shakes out — it never shipped. (It's since been deleted anyway.)
- **The real cost is small.** Bundle is ~640 KB raw but **~169 KB gzipped** (gzip is
  what travels the network). ~140 KB of that is React itself (unavoidable). The
  admin/forum/quiz code a visitor doesn't need is only ~30–50 KB gzipped.
- **Real-world impact:** roughly 0.3–0.6s slower first paint on 4G, paid once per
  visitor (then cached). No functional breakage.
- **The blank-screen symptom is already fixed** separately via the loading shell in
  `index.html` — visitors see a branded spinner instantly regardless of bundle size.
- **It's the highest-risk item.** Splitting requires extracting admin code out of the
  single-file app, which needs a careful, separately-tested pass (the admin listing /
  autofill flow can't be fully exercised casually).

### Revisit when
1. Load time is measured as an actual conversion problem, **or**
2. The admin section grows substantially (more forms, charts, chart/PDF libraries),
   making the visitor-irrelevant dead weight large enough to matter.

### How to do it (when we come back)
- Extract `AdminConsole` (+ its sub-forms and admin-only constants like
  `VARIANT_SPECS`, `MODEL_CATEGORY`) into `src/AdminConsole.jsx`.
- Load it with `React.lazy(() => import('./AdminConsole.jsx'))` + `<Suspense>`.
- Same treatment for Forum and Quiz if desired.
- Measure `dist/assets/*.js` before/after to confirm the initial chunk shrank.
