export function applyFilters(transactions, filters) {
  return transactions.filter((tx) => {
    if (filters.type !== "all" && tx.type !== filters.type) return false;
    if (filters.category !== "all" && tx.category !== filters.category) return false;
    if (filters.month !== "all" && tx.date.slice(0, 7) !== filters.month) return false;
    if (filters.search.trim()) {
      const needle = filters.search.toLowerCase();
      const haystack = `${tx.description} ${tx.category}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export function applySort(transactions, sort) {
  const sorted = [...transactions];
  sorted.sort((a, b) => {
    if (sort.field === "date") {
      const at = new Date(a.date).getTime();
      const bt = new Date(b.date).getTime();
      return sort.direction === "asc" ? at - bt : bt - at;
    }
    return sort.direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
  });
  return sorted;
}

export function getTotals(transactions) {
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function getMonthlyAggregates(transactions) {
  const byMonth = new Map();
  for (const t of transactions) {
    const month = t.date.slice(0, 7);
    const current = byMonth.get(month) || { income: 0, expenses: 0, balance: 0 };
    if (t.type === "income") {
      current.income += t.amount;
      current.balance += t.amount;
    } else {
      current.expenses += t.amount;
      current.balance -= t.amount;
    }
    byMonth.set(month, current);
  }
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, values]) => ({ month, ...values }));
}

export function getCategoryBreakdown(transactions) {
  const byCategory = new Map();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    byCategory.set(t.category, (byCategory.get(t.category) || 0) + t.amount);
  }
  return Array.from(byCategory.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({ category, amount }));
}

export function getHighestSpendingCategory(transactions) {
  const top = getCategoryBreakdown(transactions)[0];
  return top || null;
}

export function getMonthlyComparison(transactions) {
  const monthly = getMonthlyAggregates(transactions);
  const current = monthly[monthly.length - 1];
  const previous = monthly[monthly.length - 2];
  if (!current) {
    return { currentMonth: null, previousMonth: null, currentExpenses: 0, previousExpenses: 0, delta: 0 };
  }
  const currentExpenses = current.expenses;
  const previousExpenses = previous ? previous.expenses : 0;
  return {
    currentMonth: current.month,
    previousMonth: previous ? previous.month : null,
    currentExpenses,
    previousExpenses,
    delta: currentExpenses - previousExpenses
  };
}

export function getSavingsRate(transactions) {
  const { income, balance } = getTotals(transactions);
  return { income, savings: balance, rate: income === 0 ? 0 : balance / income };
}

