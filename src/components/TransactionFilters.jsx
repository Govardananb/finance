import React, { useMemo } from "react";
import { useAppState } from "../context/AppStateContext";

export function TransactionFilters({ transactions }) {
  const { filters, dispatch } = useAppState();

  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.category))).sort();
  }, [transactions]);

  const months = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.date.slice(0, 7)))).sort((a, b) => (a < b ? 1 : -1));
  }, [transactions]);

  return (
    <div className="filters-grid">
      <input
        value={filters.search}
        onChange={(e) => dispatch({ type: "setFilters", payload: { search: e.target.value } })}
        placeholder="Search description or category"
      />
      <select value={filters.type} onChange={(e) => dispatch({ type: "setFilters", payload: { type: e.target.value } })}>
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select
        value={filters.category}
        onChange={(e) => dispatch({ type: "setFilters", payload: { category: e.target.value } })}
      >
        <option value="all">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select value={filters.month} onChange={(e) => dispatch({ type: "setFilters", payload: { month: e.target.value } })}>
        <option value="all">All months</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}

