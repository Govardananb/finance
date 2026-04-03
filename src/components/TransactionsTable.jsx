import React from "react";

export function TransactionsTable({ transactions, onEdit, onDelete, canEdit, sort, onSortChange }) {
  if (!transactions.length) {
    return <p className="empty-state">No matching transactions found.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>
              <button className="th-button" onClick={() => onSortChange("date")} type="button">
                Date {sort.field === "date" ? (sort.direction === "asc" ? "↑" : "↓") : ""}
              </button>
            </th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>
              <button className="th-button" onClick={() => onSortChange("amount")} type="button">
                Amount {sort.field === "amount" ? (sort.direction === "asc" ? "↑" : "↓") : ""}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.description}</td>
              <td>{tx.category}</td>
              <td>
                <span className={`badge ${tx.type}`}>{tx.type}</span>
              </td>
              <td>
                {tx.amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0
                })}
              </td>
              <td className="table-actions">
                <button className="btn btn-small" disabled={!canEdit} onClick={() => onEdit(tx)} type="button">
                  Edit
                </button>
                <button
                  className="btn btn-small btn-danger"
                  disabled={!canEdit}
                  onClick={() => onDelete(tx)}
                  type="button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

