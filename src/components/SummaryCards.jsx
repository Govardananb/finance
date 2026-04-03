import React from "react";
import { getTotals } from "../utils/financeSelectors";

export function SummaryCards({ transactions }) {
  const { income, expenses, balance } = getTotals(transactions);
  const savings = balance;

  const cards = [
    { label: "Savings (net)", value: savings, hint: "Income minus expenses", positive: savings >= 0 },
    { label: "Income", value: income, hint: null, positive: true },
    { label: "Expenses", value: expenses, hint: null, positive: false }
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <article key={card.label} className="summary-card">
          <h2>{card.label}</h2>
          {card.hint ? <p className="summary-card-hint">{card.hint}</p> : null}
          <p className={`summary-card-value ${card.positive ? "positive" : "negative"}`}>
            {card.value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0
            })}
          </p>
        </article>
      ))}
    </div>
  );
}

