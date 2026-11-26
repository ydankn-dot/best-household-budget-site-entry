// Hearth Budget — the household's own figures.
//
// Everything the site shows lives in this file: one fictional household, the
// Alvarez family (two adults, two children), for September–November 2026.
// No figure is fetched from anywhere, and no date or clock is read at run
// time: the months below are fixed, so every render of the same month shows
// the same numbers.

export const HOUSEHOLD = {
  name: 'The Alvarez household',
  members: 'Maya and Tom Alvarez, and two children',
  home: 'A three-bedroom flat in the city',
};

export const MONTHS = [
  { id: '2026-09', label: 'September 2026', short: 'Sep' },
  { id: '2026-10', label: 'October 2026', short: 'Oct' },
  { id: '2026-11', label: 'November 2026', short: 'Nov' },
];

export const DEFAULT_MONTH = '2026-11';

// Money the household sets aside for savings each month, before spending.
export const SAVINGS_SET_ASIDE = 1500;

export const INCOME = [
  { source: 'Maya Alvarez — salary', amount: 3400 },
  { source: 'Tom Alvarez — salary', amount: 2450 },
];

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#7a4a2b' },
  { id: 'groceries', label: 'Groceries', color: '#2e7d4f' },
  { id: 'dining', label: 'Dining out', color: '#d97b29' },
  { id: 'transport', label: 'Transport', color: '#3a6ea5' },
  { id: 'utilities', label: 'Utilities', color: '#7b6bc4' },
  { id: 'entertainment', label: 'Entertainment', color: '#c2527a' },
  { id: 'health', label: 'Health', color: '#2a9d8f' },
  { id: 'clothing', label: 'Clothing', color: '#8d6e63' },
  { id: 'home', label: 'Home', color: '#a68b3c' },
  { id: 'misc', label: 'Misc', color: '#8a8f98' },
];

// Monthly budget per category, in dollars.
export const BUDGETS = {
  housing: 1850,
  groceries: 720,
  dining: 260,
  transport: 310,
  utilities: 240,
  entertainment: 150,
  health: 180,
  clothing: 120,
  home: 140,
  misc: 160,
};

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', note: 'Six months of essentials, kept in a separate account.', target: 12000, saved: 8450 },
  { id: 'holiday', name: 'Summer holiday', note: 'Two weeks by the coast next July, flights included.', target: 3200, saved: 1975 },
  { id: 'car', name: 'New car deposit', note: 'Deposit on a used family car to replace the old one.', target: 6000, saved: 2400 },
];

// Bills that repeat every month, with the day they are due.
export const BILLS = [
  { name: 'Rent', day: 1, amount: 1750, category: 'housing' },
  { name: 'Internet', day: 4, amount: 65, category: 'utilities' },
  { name: 'Mobile phones', day: 5, amount: 65, category: 'utilities' },
  { name: 'Electricity', day: 6, amount: 110, category: 'utilities', varies: true },
  { name: 'Home insurance', day: 15, amount: 132, category: 'home' },
  { name: 'Streaming', day: 26, amount: 15.99, category: 'entertainment' },
];

// Transactions per month. Amounts are spending, in dollars.
export const TRANSACTIONS = {
  '2026-09': [
    { id: 'sep-01', day: 1, desc: 'Rent', category: 'housing', amount: 1750 },
    { id: 'sep-02', day: 2, desc: 'GreenMart weekly shop', category: 'groceries', amount: 146.8 },
    { id: 'sep-03', day: 3, desc: 'Metro monthly pass', category: 'transport', amount: 90 },
    { id: 'sep-04', day: 4, desc: 'Internet', category: 'utilities', amount: 65 },
    { id: 'sep-05', day: 5, desc: 'Mobile phones', category: 'utilities', amount: 65 },
    { id: 'sep-06', day: 7, desc: 'Electricity bill', category: 'utilities', amount: 98.75 },
    { id: 'sep-07', day: 8, desc: 'Birthday dinner out', category: 'dining', amount: 74.5 },
    { id: 'sep-08', day: 10, desc: 'GreenMart weekly shop', category: 'groceries', amount: 129.4 },
    { id: 'sep-09', day: 11, desc: 'Fuel', category: 'transport', amount: 57.8 },
    { id: 'sep-10', day: 13, desc: 'School supplies', category: 'misc', amount: 42.3 },
    { id: 'sep-11', day: 15, desc: 'GreenMart weekly shop', category: 'groceries', amount: 152.1 },
    { id: 'sep-12', day: 17, desc: 'Cinema, two tickets', category: 'entertainment', amount: 38 },
    { id: 'sep-13', day: 19, desc: 'Fuel', category: 'transport', amount: 49.6 },
    { id: 'sep-14', day: 22, desc: 'Pharmacy', category: 'health', amount: 22.4 },
    { id: 'sep-15', day: 24, desc: 'GreenMart weekly shop', category: 'groceries', amount: 118.65 },
    { id: 'sep-16', day: 26, desc: 'Garden tools', category: 'home', amount: 41.2 },
    { id: 'sep-17', day: 28, desc: 'Takeaway noodles', category: 'dining', amount: 33.9 },
  ],
  '2026-10': [
    { id: 'oct-01', day: 1, desc: 'Rent', category: 'housing', amount: 1750 },
    { id: 'oct-02', day: 2, desc: 'GreenMart weekly shop', category: 'groceries', amount: 154.6 },
    { id: 'oct-03', day: 3, desc: 'Metro monthly pass', category: 'transport', amount: 90 },
    { id: 'oct-04', day: 4, desc: 'Internet', category: 'utilities', amount: 65 },
    { id: 'oct-05', day: 5, desc: 'Mobile phones', category: 'utilities', amount: 65 },
    { id: 'oct-06', day: 6, desc: 'Electricity bill', category: 'utilities', amount: 121.3 },
    { id: 'oct-07', day: 8, desc: 'Sushi dinner', category: 'dining', amount: 68.4 },
    { id: 'oct-08', day: 9, desc: 'GreenMart weekly shop', category: 'groceries', amount: 141.25 },
    { id: 'oct-09', day: 10, desc: 'Fuel', category: 'transport', amount: 61.2 },
    { id: 'oct-10', day: 11, desc: 'Car repair — brakes', category: 'transport', amount: 320 },
    { id: 'oct-11', day: 13, desc: 'Concert tickets', category: 'entertainment', amount: 89 },
    { id: 'oct-12', day: 15, desc: 'Pharmacy', category: 'health', amount: 34.5 },
    { id: 'oct-13', day: 16, desc: 'GreenMart weekly shop', category: 'groceries', amount: 158.9 },
    { id: 'oct-14', day: 17, desc: 'New curtains', category: 'home', amount: 74.2 },
    { id: 'oct-15', day: 19, desc: 'Takeaway pizza', category: 'dining', amount: 36.8 },
    { id: 'oct-16', day: 21, desc: 'Fuel', category: 'transport', amount: 55.4 },
    { id: 'oct-17', day: 23, desc: 'GreenMart weekly shop', category: 'groceries', amount: 139.75 },
    { id: 'oct-18', day: 24, desc: "Kids' winter coats", category: 'clothing', amount: 112.99 },
    { id: 'oct-19', day: 26, desc: 'Streaming', category: 'entertainment', amount: 15.99 },
    { id: 'oct-20', day: 28, desc: 'Dentist check-up', category: 'health', amount: 85 },
    { id: 'oct-21', day: 30, desc: 'Hardware store', category: 'home', amount: 28.6 },
  ],
  '2026-11': [
    { id: 'nov-01', day: 1, desc: 'Rent', category: 'housing', amount: 1750 },
    { id: 'nov-02', day: 2, desc: 'GreenMart weekly shop', category: 'groceries', amount: 148.2 },
    { id: 'nov-03', day: 3, desc: 'Metro monthly pass', category: 'transport', amount: 90 },
    { id: 'nov-04', day: 4, desc: 'Internet', category: 'utilities', amount: 65 },
    { id: 'nov-05', day: 5, desc: 'Mobile phones', category: 'utilities', amount: 65 },
    { id: 'nov-06', day: 6, desc: 'Electricity bill', category: 'utilities', amount: 108.4 },
    { id: 'nov-07', day: 7, desc: 'Pizza night', category: 'dining', amount: 42.5 },
    { id: 'nov-08', day: 9, desc: 'GreenMart weekly shop', category: 'groceries', amount: 132.75 },
    { id: 'nov-09', day: 10, desc: 'Fuel', category: 'transport', amount: 58.3 },
    { id: 'nov-10', day: 12, desc: 'Cinema and popcorn', category: 'entertainment', amount: 46 },
    { id: 'nov-11', day: 14, desc: 'Pharmacy', category: 'health', amount: 28.9 },
    { id: 'nov-12', day: 15, desc: "Kids' shoes", category: 'clothing', amount: 64.99 },
    { id: 'nov-13', day: 16, desc: 'GreenMart weekly shop', category: 'groceries', amount: 161.4 },
    { id: 'nov-14', day: 18, desc: 'Takeaway Thai', category: 'dining', amount: 38.75 },
    { id: 'nov-15', day: 20, desc: 'Fuel', category: 'transport', amount: 52.1 },
    { id: 'nov-16', day: 21, desc: 'Hardware store', category: 'home', amount: 36.8 },
    { id: 'nov-17', day: 23, desc: 'GreenMart weekly shop', category: 'groceries', amount: 127.55 },
    { id: 'nov-18', day: 25, desc: 'Birthday gift', category: 'misc', amount: 45 },
    { id: 'nov-19', day: 26, desc: 'Streaming', category: 'entertainment', amount: 15.99 },
    { id: 'nov-20', day: 27, desc: 'Dentist check-up', category: 'health', amount: 85 },
  ],
};
