# Pole Position — Feature Backlog

Prioritized build list to close the functional gaps vs Cars24 / Spinny, while
keeping the "honest boutique" positioning. Ordered by **impact on a buyer's
decision ÷ effort**. Each item: what, why, effort, and acceptance criteria.

Effort key: **S** = a few hours · **M** = half a day–day · **L** = multi-day.

---

## P1 — Search bar + sort  ·  Effort: M
**What:** A free-text search box on Browse (and homepage hero) that filters the
grid live by make/model/variant, plus a Sort control (Price low→high, high→low,
Year newest, KM lowest, PP Score highest).

**Why:** Biggest gap. Buyers expect to *search*, not only tick filter boxes. Sort
is table stakes on every marketplace and we have none today.

**Acceptance:**
- Typing "creta" narrows results as you type (matches make, model, variant).
- Sort dropdown re-orders the current result set; default = PP Score high→low.
- Works with existing filters (search + filters compose, don't reset each other).
- Empty state reuses the existing "Clear all filters" component.

---

## P2 — EMI / affordability calculator  ·  Effort: M
**What:** An inline EMI widget on the car detail page: sliders for down payment,
tenure (months), and interest rate → shows monthly EMI. Optional "EMI from ₹X/mo"
line on the car card.

**Why:** Most used-car purchases in India are finance-driven. Cars24/Spinny both
lead with EMI. It reframes a ₹9.5L car as "₹18k/month" — a proven conversion lever.

**Acceptance:**
- Detail page shows EMI that recalculates instantly as sliders move.
- Sensible defaults (e.g. 20% down, 60 months, 10.5%).
- Pure client-side math, no backend needed.
- Card shows "EMI from ₹X/mo" using default assumptions.

---

## P3 — Per-car trust badges  ·  Effort: S–M
**What:** Small badges on card + detail: e.g. "Inspected", "RC Transfer Assisted",
"1 Owner", "Service Records", "Warranty Available", registration city/RTO. Driven
by real `car` fields (with a sensible fallback), not hardcoded strings.

**Why:** Used-car buyers run on anxiety reduction. At-a-glance proof does that. Our
cards currently look clean but carry little reassurance vs their badge-dense cards.

**Acceptance:**
- Badges render from `car` data fields (add fields to the data model + admin form).
- Absent data = badge simply doesn't show (no empty/placeholder).
- Consistent badge component reused on card and detail page.

---

## P4 — Compare view  ·  Effort: L
**What:** Select 2–3 cars (checkbox/"Add to compare") → a side-by-side table of
price, year, km, fuel, transmission, PP Score, and inspection sub-scores.

**Why:** Buyers shortlist. Comparison keeps them on-site instead of opening five
tabs. It also shows off our inspection breakdown as a differentiator.

**Acceptance:**
- "Compare" toggle on cards; a sticky "Compare (2)" bar appears when ≥1 selected.
- Compare page shows a clean column-per-car table; highlights best value per row.
- Works on mobile (horizontal scroll or stacked).

---

## Deliberately NOT in this list (and why)
- **360°/studio photography standard** — real operational fix, not a code feature;
  worth a shooting guideline doc instead. (Noted so it isn't forgotten.)
- **Scale trust bars ("1,00,000+ sold")** — don't fake scale we don't have; it
  undercuts the honesty positioning. Revisit when the real numbers support it.
- **Insurance/warranty upsell funnels** — off-brand for the boutique position for now.

---

## Suggested build order
P1 → P3 → P2 → P4
(P1 and P3 are the highest impact-per-effort; P2 is high impact but slightly more
UI; P4 is the most work and depends on the data-model additions from P3.)
