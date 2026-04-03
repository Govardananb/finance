import React, { useMemo, useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { applyFilters, applySort } from "../utils/financeSelectors";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionsTable } from "./TransactionsTable";

const emptyForm = {
  id: "",
  date: "",
  description: "",
  amount: "",
  category: "",
  type: "expense"
};

export function TransactionsSection() {
  const { transactions, filters, sort, dispatch } = useAppState();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const canEdit = true;

  const visibleTransactions = useMemo(() => {
    return applySort(applyFilters(transactions, filters), sort);
  }, [transactions, filters, sort]);

  const handleSort = (field) => {
    const direction = sort.field === field && sort.direction === "desc" ? "asc" : "desc";
    dispatch({ type: "setSort", payload: { field, direction } });
  };

  const startEdit = (tx) => {
    if (!canEdit) return;
    setEditingId(tx.id);
    setForm({ ...tx, amount: String(tx.amount) });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (tx) => {
    if (!canEdit) return;
    const label = `${tx.description} (${tx.date})`;
    if (!window.confirm(`Remove this transaction from history?\n\n${label}`)) return;
    dispatch({ type: "removeTransaction", payload: tx.id });
    if (editingId === tx.id) resetForm();
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!canEdit) return;
    const payload = {
      id: editingId || `t-${Date.now()}`,
      date: form.date,
      description: form.description.trim(),
      amount: Number(form.amount),
      category: form.category.trim(),
      type: form.type
    };
    if (!payload.date || !payload.description || !payload.category || Number.isNaN(payload.amount) || payload.amount <= 0) {
      return;
    }
    dispatch({ type: editingId ? "updateTransaction" : "addTransaction", payload });
    resetForm();
  };

  return (
    <article className="panel">
      <header className="panel-header">
        <h2>Transactions</h2>
        <p className="muted">You can add, edit, or delete entries. Deletes are permanent for this browser session.</p>
      </header>

      <TransactionFilters transactions={transactions} />

      <TransactionsTable
        transactions={visibleTransactions}
        onEdit={startEdit}
        onDelete={handleDelete}
        canEdit={canEdit}
        sort={sort}
        onSortChange={handleSort}
      />

      <form className="tx-form" onSubmit={submitForm}>
        <h3>{editingId ? "Edit transaction" : "Add transaction"}</h3>
        <div className="tx-form-grid">
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} disabled={!canEdit} />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            disabled={!canEdit}
          />
          <input
            type="number"
            min="1"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            disabled={!canEdit}
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            disabled={!canEdit}
          />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} disabled={!canEdit}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <div className="tx-actions">
            <button className="btn" disabled={!canEdit} type="submit">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button className="btn btn-secondary" onClick={resetForm} type="button">
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </article>
  );
}

