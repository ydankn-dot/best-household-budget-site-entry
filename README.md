# best-household-budget-site-entry

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/ydankn-dot/best-household-budget-site-entry/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/ydankn-dot/best-household-budget-site-entry/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hearth Budget — a household budget site for the Alvarez family: track income and spending, set monthly budgets per category, watch savings goals grow, and read monthly reports — all in plain static files that run offline in a browser, on desktop and on a phone.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network: every file the site loads is under `app/`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=0a3zgsxr&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>

## What it does

- **Overview** — the month at a glance: income, spending, set-aside savings and what is left over, a spending-by-category chart, budget progress and the latest transactions.
- **Transactions** — every transaction for the month, filterable by category and searchable; add your own and delete them. Changes are kept in the browser (localStorage), so the sample month is never overwritten.
- **Budgets** — a monthly budget for each spending category, with spent, remaining and over/under shown; edit any budget amount.
- **Goals** — savings goals with progress bars; add a contribution to any goal.
- **Reports** — income vs spending across the three sample months, a category breakdown, and a CSV export of the month's transactions.
- **How it works** — how every figure is worked out, and the budgeting method behind the site.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `vendor/makefun-frontend.ts` library.

## The household

The figures are sample data for one fictional household, the Alvarez family (two adults, two children), for September–November 2026. Nothing is fetched from anywhere: all content lives in `app/data.js`.

## Files

- `app/index.html` — the page shell: header, navigation, footer
- `app/style.css` — all styling, including the phone layout
- `app/data.js` — the household's categories, budgets, goals, bills and transactions
- `app/charts.js` — the SVG donut and bar charts
- `app/views.js` — one renderer per section
- `app/main.js` — routing, state and browser persistence
- `main.ts` — the hand-in program
- `serve.ts` — a small static server for local use
- `screenshots/` — renders of the site in a browser
