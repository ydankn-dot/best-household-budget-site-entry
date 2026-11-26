// Hearth Budget — routing, state and browser persistence.
//
// The site is a single page with hash routes: #/ (overview), #/transactions,
// #/budgets, #/goals, #/reports and #/methods. The month shown is kept in
// memory and starts at November 2026. Changes a visitor makes — a transaction
// added, a budget edited, a goal contribution — are kept in localStorage under
// one key, on top of the seed figures in data.js, so the sample month itself
// is never overwritten. Nothing here reads a clock, a network or a random
// number: the same stored changes always render the same page.

import { BUDGETS, CATEGORIES, GOALS, MONTHS, DEFAULT_MONTH, INCOME, TRANSACTIONS, BILLS } from './data.js';
import { esc, money, renderBudgets, renderGoals, renderMethods, renderOverview, renderReports, renderTransactions } from './views.js';

const STORAGE_KEY = 'hearth-budget-v1';
const ROUTES = {
  '': renderOverview,
  '/': renderOverview,
  '/transactions': renderTransactions,
  '/budgets': renderBudgets,
  '/goals': renderGoals,
  '/reports': renderReports,
  '/methods': renderMethods,
};
const NAV = [
  ['#/', 'Overview'],
  ['#/transactions', 'Transactions'],
  ['#/budgets', 'Budgets'],
  ['#/goals', 'Goals'],
  ['#/reports', 'Reports'],
  ['#/methods', 'How it works'],
];

// ---- Stored changes -------------------------------------------------------

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { added: {}, deleted: [], budgets: {}, goals: {} };
    const parsed = JSON.parse(raw);
    return {
      added: parsed.added && typeof parsed.added === 'object' ? parsed.added : {},
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
      budgets: parsed.budgets && typeof parsed.budgets === 'object' ? parsed.budgets : {},
      goals: parsed.goals && typeof parsed.goals === 'object' ? parsed.goals : {},
    };
  } catch {
    return { added: {}, deleted: [], budgets: {}, goals: {} };
  }
}

function saveStored(stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // A browser that refuses storage still shows the site; changes just do
    // not survive a reload.
  }
}

// ---- The store ------------------------------------------------------------

const stored = loadStored();

const store = {
  month: DEFAULT_MONTH,

  transactions(monthId) {
    const seed = TRANSACTIONS[monthId] ?? [];
    const deleted = new Set(stored.deleted);
    const added = stored.added[monthId] ?? [];
    const all = seed
      .filter((tx) => !deleted.has(tx.id))
      .concat(added.filter((tx) => !deleted.has(tx.id)));
    return all.slice().sort((a, b) => a.day - b.day || (a.id < b.id ? -1 : 1));
  },

  incomeTotal() {
    return INCOME.reduce((sum, row) => sum + row.amount, 0);
  },

  spending(monthId) {
    return this.transactions(monthId).reduce((sum, tx) => sum + tx.amount, 0);
  },

  categoryTotals(monthId) {
    const totals = new Map(CATEGORIES.map((cat) => [cat.id, 0]));
    for (const tx of this.transactions(monthId)) {
      totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
    }
    return CATEGORIES.map((cat) => ({ ...cat, value: totals.get(cat.id) ?? 0 }))
      .filter((row) => row.value > 0)
      .sort((a, b) => b.value - a.value);
  },

  budget(categoryId) {
    const edited = stored.budgets[categoryId];
    return typeof edited === 'number' && edited >= 0 ? edited : BUDGETS[categoryId] ?? 0;
  },

  goals() {
    return GOALS.map((goal) => ({
      ...goal,
      saved: goal.saved + (stored.goals[goal.id] ?? 0),
    }));
  },

  bills() {
    return BILLS;
  },
};

// ---- Rendering ------------------------------------------------------------

const app = document.getElementById('app');
const nav = document.getElementById('nav');
nav.innerHTML = NAV.map(([href, label]) => `<a href="${href}" data-nav="${href}">${esc(label)}</a>`).join('');

const filter = { category: '', query: '' };

function currentRoute() {
  const hash = window.location.hash || '#/';
  return hash.slice(1) || '/';
}

function render() {
  const route = currentRoute();
  const renderer = ROUTES[route] ?? renderOverview;
  app.innerHTML = renderer(store, filter);
  for (const link of nav.querySelectorAll('a')) {
    const active = link.getAttribute('data-nav') === `#${route === '/' ? '' : route}` || (route === '/' && link.getAttribute('data-nav') === '#/');
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  window.scrollTo(0, 0);
}

// ---- Actions ---------------------------------------------------------------

function csvEscape(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function exportCsv() {
  const month = store.month;
  const label = (MONTHS.find((m) => m.id === month) ?? MONTHS[0]).label;
  const lines = [['Day', 'Description', 'Category', 'Amount (USD)']];
  for (const tx of store.transactions(month)) {
    const cat = CATEGORIES.find((c) => c.id === tx.category);
    lines.push([tx.day, tx.desc, cat ? cat.label : tx.category, tx.amount.toFixed(2)]);
  }
  lines.push(['', 'Total', '', store.spending(month).toFixed(2)]);
  const csv = lines.map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hearth-budget-${month}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.getAttribute('data-action');
  if (action === 'month') {
    store.month = button.getAttribute('data-month');
    render();
  } else if (action === 'delete-tx') {
    stored.deleted.push(button.getAttribute('data-id'));
    saveStored(stored);
    render();
  } else if (action === 'save-budget') {
    const category = button.getAttribute('data-category');
    const input = document.querySelector(`[data-budget-input="${category}"]`);
    const value = Number(input?.value);
    if (Number.isFinite(value) && value >= 0) {
      stored.budgets[category] = Math.round(value * 100) / 100;
      saveStored(stored);
      render();
    }
  } else if (action === 'add-goal' || action === 'add-goal-custom') {
    const goal = button.getAttribute('data-goal');
    const amount = action === 'add-goal'
      ? Number(button.getAttribute('data-amount'))
      : Number(document.querySelector(`[data-goal-input="${goal}"]`)?.value);
    if (Number.isFinite(amount) && amount > 0) {
      stored.goals[goal] = (stored.goals[goal] ?? 0) + Math.round(amount * 100) / 100;
      saveStored(stored);
      render();
    }
  } else if (action === 'export-csv') {
    exportCsv();
  }
});

document.addEventListener('submit', (event) => {
  if (event.target.id !== 'add-tx') return;
  event.preventDefault();
  const day = Number(document.getElementById('add-day').value);
  const desc = document.getElementById('add-desc').value.trim();
  const category = document.getElementById('add-category').value;
  const amount = Number(document.getElementById('add-amount').value);
  const note = document.getElementById('add-note');
  if (!Number.isInteger(day) || day < 1 || day > 31 || !desc || !Number.isFinite(amount) || amount <= 0) {
    note.textContent = 'Check the form: a day from 1 to 31, a description, and an amount over $0.';
    return;
  }
  const month = store.month;
  const id = `user-${month}-${(stored.added[month] ?? []).length + 1}`;
  stored.added[month] = (stored.added[month] ?? []).concat([{ id, day, desc, category, amount: Math.round(amount * 100) / 100 }]);
  saveStored(stored);
  render();
  const after = document.getElementById('add-note');
  if (after) after.textContent = `Added “${desc}” for ${money(amount)} — it now counts in every total.`;
});

document.addEventListener('input', (event) => {
  if (event.target.id === 'filter-category') {
    filter.category = event.target.value;
    render();
    const back = document.getElementById('filter-category');
    if (back) back.focus();
  } else if (event.target.id === 'filter-query') {
    filter.query = event.target.value;
    const pos = event.target.selectionStart;
    render();
    const back = document.getElementById('filter-query');
    if (back) {
      back.focus();
      back.setSelectionRange(pos, pos);
    }
  }
});

window.addEventListener('hashchange', render);
render();
