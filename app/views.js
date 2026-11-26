// Hearth Budget — one renderer per section.
//
// Every renderer is a pure function of the store it is handed: the same
// month and the same stored changes always render the same page. Event
// wiring lives in main.js; these functions only return HTML strings.

import { BUDGETS, CATEGORIES, GOALS, HOUSEHOLD, INCOME, MONTHS, SAVINGS_SET_ASIDE } from './data.js';
import { donutChart, monthBars } from './charts.js';

// Money as $1,234.56 — formatted by hand, so no locale data is involved.
export function money(amount) {
  const sign = amount < 0 ? '-' : '';
  const cents = Math.round(Math.abs(amount) * 100);
  const whole = Math.floor(cents / 100).toString();
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}$${grouped}.${String(cents % 100).padStart(2, '0')}`;
}

export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function categoryById(id) {
  return CATEGORIES.find((cat) => cat.id === id) ?? { id, label: id, color: '#8a8f98' };
}

function monthLabel(monthId) {
  return (MONTHS.find((month) => month.id === monthId) ?? MONTHS[0]).label;
}

function monthSwitcher(store, current) {
  return `<div class="month-switch" role="group" aria-label="Choose a month">${MONTHS.map(
    (month) => `<button type="button" data-action="month" data-month="${month.id}" class="${month.id === current ? 'active' : ''}" aria-pressed="${month.id === current}">${month.short} 2026</button>`,
  ).join('')}</div>`;
}

function categoryOptions(selected) {
  return `<option value="">All categories</option>${CATEGORIES.map(
    (cat) => `<option value="${cat.id}" ${cat.id === selected ? 'selected' : ''}>${cat.label}</option>`,
  ).join('')}`;
}

// ---- Overview -------------------------------------------------------------

export function renderOverview(store) {
  const month = store.month;
  const income = store.incomeTotal();
  const spending = store.spending(month);
  const left = income - spending - SAVINGS_SET_ASIDE;
  const totals = store.categoryTotals(month);
  const recent = store.transactions(month).slice(-6).reverse();
  const budgets = CATEGORIES.map((cat) => ({
    ...cat,
    spent: totals.find((t) => t.id === cat.id)?.value ?? 0,
    budget: store.budget(cat.id),
  })).sort((a, b) => b.spent - a.spent).slice(0, 5);
  return `
  <h1>${monthLabel(month)} at a glance</h1>
  <p class="lede">How the Alvarez household did this month — what came in, what went out, and what is left.</p>
  ${monthSwitcher(store, month)}
  <section class="kpis" aria-label="Month totals">
    <div class="kpi"><span class="kpi-label">Income</span><strong>${money(income)}</strong><span class="kpi-note">${INCOME.map((row) => row.source.split(' — ')[0]).join(' + ')}</span></div>
    <div class="kpi"><span class="kpi-label">Spending</span><strong>${money(spending)}</strong><span class="kpi-note">${store.transactions(month).length} transactions</span></div>
    <div class="kpi"><span class="kpi-label">Set aside</span><strong>${money(SAVINGS_SET_ASIDE)}</strong><span class="kpi-note">moved to savings</span></div>
    <div class="kpi ${left < 0 ? 'over' : ''}"><span class="kpi-label">Left over</span><strong>${money(left)}</strong><span class="kpi-note">${left < 0 ? 'over budget this month' : 'free to save or spend'}</span></div>
  </section>
  <div class="two-col">
    <section class="card" aria-label="Where the money went">
      <h2>Where the money went</h2>
      ${donutChart(totals, spending)}
      <ul class="legend">${totals.map((t) => `<li><span class="swatch" style="background:${t.color}"></span>${t.label}<strong>${money(t.value)}</strong></li>`).join('')}</ul>
    </section>
    <section class="card" aria-label="Budgets at a glance">
      <h2>Budgets at a glance</h2>
      ${budgets.map((row) => budgetBar(row, false)).join('')}
      <p><a class="button" href="#/budgets">See all budgets</a></p>
    </section>
  </div>
  <div class="two-col">
    <section class="card" aria-label="Latest transactions">
      <h2>Latest transactions</h2>
      <ul class="tx-list">${recent.map((tx) => `<li><span class="tx-day">${monthLabel(month).split(' ')[0].slice(0, 3)} ${tx.day}</span><span class="tx-desc">${esc(tx.desc)}</span><span class="tx-cat">${categoryById(tx.category).label}</span><strong>${money(tx.amount)}</strong></li>`).join('')}</ul>
      <p><a class="button" href="#/transactions">All transactions</a></p>
    </section>
    <section class="card" aria-label="Bills due this month">
      <h2>Bills due this month</h2>
      <ul class="bill-list">${store.bills().map((bill) => `<li><span class="bill-day">Day ${bill.day}</span><span>${esc(bill.name)}</span><strong>${money(bill.amount)}${bill.varies ? ' *' : ''}</strong></li>`).join('')}</ul>
      <p class="fine">* Electricity varies with use; the figure shown is the usual amount.</p>
    </section>
  </div>`;
}

function budgetBar(row, editable) {
  const pct = row.budget > 0 ? Math.min(100, Math.round((row.spent / row.budget) * 100)) : 0;
  const remaining = row.budget - row.spent;
  const state = remaining < 0 ? 'over' : pct >= 85 ? 'close' : '';
  return `<div class="budget-row ${state}">
    <div class="budget-head"><span class="swatch" style="background:${row.color}"></span><strong>${row.label}</strong><span>${money(row.spent)} of ${money(row.budget)}</span></div>
    <div class="bar" role="img" aria-label="${row.label}: ${money(row.spent)} spent of a ${money(row.budget)} budget"><div class="bar-fill" style="width:${pct}%"></div></div>
    <div class="budget-foot"><span>${pct}% used</span><span>${remaining < 0 ? `${money(-remaining)} over budget` : `${money(remaining)} left`}</span></div>
    ${editable ? `<div class="budget-edit"><label>Monthly budget <input type="number" min="0" step="1" value="${row.budget}" data-budget-input="${row.id}" aria-label="Monthly budget for ${row.label}"></label><button type="button" data-action="save-budget" data-category="${row.id}">Save</button></div>` : ''}
  </div>`;
}

// ---- Transactions ---------------------------------------------------------

export function renderTransactions(store, filter) {
  const month = store.month;
  const all = store.transactions(month);
  const shown = all.filter((tx) => {
    if (filter.category && tx.category !== filter.category) return false;
    if (filter.query && !`${tx.desc} ${categoryById(tx.category).label}`.toLowerCase().includes(filter.query.toLowerCase())) return false;
    return true;
  });
  const total = shown.reduce((sum, tx) => sum + tx.amount, 0);
  return `
  <h1>Transactions</h1>
  <p class="lede">Every dollar out of the household account in ${monthLabel(month)}.</p>
  ${monthSwitcher(store, month)}
  <form class="filters" id="tx-filters" onsubmit="return false">
    <label>Category <select id="filter-category">${categoryOptions(filter.category)}</select></label>
    <label>Search <input type="search" id="filter-query" value="${esc(filter.query)}" placeholder="e.g. GreenMart"></label>
  </form>
  <section class="card">
    <table class="tx-table">
      <thead><tr><th>Day</th><th>What</th><th>Category</th><th class="num">Amount</th><th><span class="visually-hidden">Remove</span></th></tr></thead>
      <tbody>${shown.map((tx) => `<tr><td>${tx.day}</td><td>${esc(tx.desc)}</td><td><span class="swatch" style="background:${categoryById(tx.category).color}"></span>${categoryById(tx.category).label}</td><td class="num">${money(tx.amount)}</td><td><button type="button" class="link-button" data-action="delete-tx" data-id="${tx.id}" aria-label="Delete ${esc(tx.desc)}">Delete</button></td></tr>`).join('') || '<tr><td colspan="5">Nothing matches those filters yet.</td></tr>'}</tbody>
      <tfoot><tr><td colspan="3">${shown.length} of ${all.length} transactions</td><td class="num"><strong>${money(total)}</strong></td><td></td></tr></tfoot>
    </table>
  </section>
  <section class="card">
    <h2>Add a transaction</h2>
    <form class="add-form" id="add-tx" onsubmit="return false">
      <label>Day of month <input type="number" id="add-day" min="1" max="31" value="28" required></label>
      <label>What <input type="text" id="add-desc" maxlength="80" placeholder="e.g. GreenMart weekly shop" required></label>
      <label>Category <select id="add-category">${CATEGORIES.map((cat) => `<option value="${cat.id}">${cat.label}</option>`).join('')}</select></label>
      <label>Amount ($) <input type="number" id="add-amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <button type="submit" data-action="add-tx">Add transaction</button>
    </form>
    <p class="fine" id="add-note">Added transactions are kept in this browser only, and count in every total at once.</p>
  </section>`;
}

// ---- Budgets --------------------------------------------------------------

export function renderBudgets(store) {
  const month = store.month;
  const totals = store.categoryTotals(month);
  const rows = CATEGORIES.map((cat) => ({
    ...cat,
    spent: totals.find((t) => t.id === cat.id)?.value ?? 0,
    budget: store.budget(cat.id),
  }));
  const totalBudget = rows.reduce((sum, row) => sum + row.budget, 0);
  const totalSpent = rows.reduce((sum, row) => sum + row.spent, 0);
  const over = rows.filter((row) => row.spent > row.budget);
  return `
  <h1>Budgets</h1>
  <p class="lede">A monthly limit for each kind of spending, set at the start of the month and checked against what actually went out in ${monthLabel(month)}.</p>
  ${monthSwitcher(store, month)}
  <section class="kpis" aria-label="Budget totals">
    <div class="kpi"><span class="kpi-label">Budgeted</span><strong>${money(totalBudget)}</strong><span class="kpi-note">across ${rows.length} categories</span></div>
    <div class="kpi"><span class="kpi-label">Spent</span><strong>${money(totalSpent)}</strong><span class="kpi-note">${Math.round((totalSpent / totalBudget) * 100)}% of the budget</span></div>
    <div class="kpi ${totalBudget - totalSpent < 0 ? 'over' : ''}"><span class="kpi-label">Still in the budget</span><strong>${money(totalBudget - totalSpent)}</strong><span class="kpi-note">${over.length === 0 ? 'no category over budget' : `${over.length} categor${over.length === 1 ? 'y' : 'ies'} over budget`}</span></div>
  </section>
  <section class="card">
    <h2>Monthly budgets</h2>
    ${rows.map((row) => budgetBar(row, true)).join('')}
    <p class="fine">Budgets are set for the whole month, not per week, and changing one updates every total on the site. Edits are kept in this browser only.</p>
  </section>`;
}

// ---- Goals ----------------------------------------------------------------

export function renderGoals(store) {
  const goals = store.goals();
  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  return `
  <h1>Savings goals</h1>
  <p class="lede">What the household is saving towards, and how far along each goal is. The ${money(SAVINGS_SET_ASIDE)} set aside each month is split between them.</p>
  <section class="kpis" aria-label="Goals totals">
    <div class="kpi"><span class="kpi-label">Saved so far</span><strong>${money(totalSaved)}</strong><span class="kpi-note">across ${goals.length} goals</span></div>
    <div class="kpi"><span class="kpi-label">Still to save</span><strong>${money(totalTarget - totalSaved)}</strong><span class="kpi-note">of ${money(totalTarget)} in total</span></div>
    <div class="kpi"><span class="kpi-label">Overall progress</span><strong>${Math.round((totalSaved / totalTarget) * 100)}%</strong><span class="kpi-note">of all three goals together</span></div>
  </section>
  <div class="goal-grid">
    ${goals.map((goal) => {
      const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
      return `<section class="card goal-card">
        <h2>${esc(goal.name)}</h2>
        <p>${esc(goal.note)}</p>
        <div class="bar" role="img" aria-label="${esc(goal.name)}: ${money(goal.saved)} saved of ${money(goal.target)}"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div class="budget-foot"><span>${money(goal.saved)} of ${money(goal.target)}</span><span>${pct}%</span></div>
        <div class="goal-add">
          <button type="button" data-action="add-goal" data-goal="${goal.id}" data-amount="50">Add $50</button>
          <button type="button" data-action="add-goal" data-goal="${goal.id}" data-amount="100">Add $100</button>
          <label>Other amount <input type="number" min="1" step="1" data-goal-input="${goal.id}" aria-label="Amount to add to ${esc(goal.name)}"></label>
          <button type="button" data-action="add-goal-custom" data-goal="${goal.id}">Add</button>
        </div>
      </section>`;
    }).join('')}
  </div>
  <p class="fine">Contributions are kept in this browser only, on top of the figures above.</p>`;
}

// ---- Reports --------------------------------------------------------------

export function renderReports(store) {
  const rows = MONTHS.map((month) => ({
    label: month.short,
    income: store.incomeTotal(),
    spending: store.spending(month.id),
  }));
  const month = store.month;
  const totals = store.categoryTotals(month);
  const total = totals.reduce((sum, t) => sum + t.value, 0);
  const biggest = totals[0];
  return `
  <h1>Reports</h1>
  <p class="lede">Three months side by side, so the household can see whether spending is drifting up or a budget is quietly being missed.</p>
  <section class="card">
    <h2>Income vs spending</h2>
    ${monthBars(rows)}
    <p class="chart-legend"><span><i class="swatch" style="background:#2e7d4f"></i>Income</span><span><i class="swatch" style="background:#c2527a"></i>Spending</span></p>
    <table class="tx-table">
      <thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spending</th><th class="num">Left over</th></tr></thead>
      <tbody>${rows.map((row) => `<tr><td>${row.label} 2026</td><td class="num">${money(row.income)}</td><td class="num">${money(row.spending)}</td><td class="num">${money(row.income - row.spending)}</td></tr>`).join('')}</tbody>
    </table>
  </section>
  <section class="card">
    <h2>Where ${monthLabel(month)}'s money went</h2>
    ${monthSwitcher(store, month)}
    <table class="tx-table">
      <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Share</th><th class="num">Budget</th></tr></thead>
      <tbody>${totals.map((t) => `<tr><td><span class="swatch" style="background:${t.color}"></span>${t.label}</td><td class="num">${money(t.value)}</td><td class="num">${Math.round((t.value / total) * 100)}%</td><td class="num">${money(store.budget(t.id))}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td>Total</td><td class="num"><strong>${money(total)}</strong></td><td class="num">100%</td><td class="num">${money(CATEGORIES.reduce((sum, cat) => sum + store.budget(cat.id), 0))}</td></tr></tfoot>
    </table>
    <p>Biggest category: <strong>${biggest.label}</strong> at ${money(biggest.value)} (${Math.round((biggest.value / total) * 100)}% of spending).</p>
    <p><button type="button" class="button" data-action="export-csv">Download ${monthLabel(month)} as CSV</button></p>
  </section>`;
}

// ---- How it works ---------------------------------------------------------

export function renderMethods() {
  return `
  <h1>How it works</h1>
  <p class="lede">Every figure on this site is worked out from the household's own list of transactions, in the open. Nothing is estimated and nothing is fetched from elsewhere.</p>
  <section class="card">
    <h2>How each number is worked out</h2>
    <dl class="methods">
      <dt>Income</dt><dd>The two salaries added together: Maya's $3,400 and Tom's $2,450, which is $5,850 a month.</dd>
      <dt>Spending</dt><dd>Every transaction in the month, added up. The month's total is the sum of its categories, and each category's total is the sum of its transactions.</dd>
      <dt>Set aside</dt><dd>$1,500 is moved to savings on payday, before any spending. It is not counted as spending.</dd>
      <dt>Left over</dt><dd>Income minus spending minus the $1,500 set aside. A negative number means the month cost more than it brought in.</dd>
      <dt>Budget remaining</dt><dd>The category's monthly budget minus what was spent in it. Over budget shows in red, and a category at 85% or more of its budget is flagged as close.</dd>
      <dt>Goal progress</dt><dd>What has been saved for the goal, divided by its target, as a percentage.</dd>
    </dl>
  </section>
  <section class="card">
    <h2>A simple way to split a household income</h2>
    <p>One rule of thumb the Alvarez household uses is 50 / 30 / 20: about half of take-home pay on needs (housing, groceries, utilities, transport), about three in ten on wants (dining out, entertainment, clothing), and about two in ten saved. In November 2026 the household spent $3,162.63 of $5,850 take-home pay and set $1,500 aside — about 47% needs, 7% wants, and 26% saved, with 20% left over — ahead of the rule on saving, and under on wants.</p>
    <ul class="tips">
      <li>Pay savings first: move the set-aside amount on payday, before spending starts.</li>
      <li>Give every dollar a category, so a surprise never hides in "misc".</li>
      <li>Check the budget once a week, not once a month — a small overspend is easy to fix early.</li>
      <li>Keep one month of essentials in the emergency fund before saving for anything else.</li>
    </ul>
  </section>
  <section class="card">
    <h2>About this site</h2>
    <p>${HOUSEHOLD.name} is a fictional household: ${HOUSEHOLD.members.toLowerCase()}. ${HOUSEHOLD.home}. The figures are sample data for September–November 2026, kept in the site's own files. Nothing you add or change leaves your browser: transactions you add, budgets you edit and goal contributions are stored in this browser only.</p>
  </section>`;
}

// Re-exported so the router can list every section in one place.
export { BUDGETS, CATEGORIES, GOALS, MONTHS };
