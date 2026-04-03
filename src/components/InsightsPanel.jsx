import React from "react";
import { useAppState } from "../context/AppStateContext";
import { getHighestSpendingCategory, getMonthlyComparison, getSavingsRate } from "../utils/financeSelectors";

export function InsightsPanel() {
  const { transactions } = useAppState();
  const topCategory = getHighestSpendingCategory(transactions);
  const monthly = getMonthlyComparison(transactions);
  const savings = getSavingsRate(transactions);

  return (
    <aside className="panel insights-panel">
      <header className="panel-header">
        <h2>Insights</h2>
      </header>

      <div className="insight-item">
        <h3>Highest Spending Category</h3>
        <p>
          {topCategory
            ? `${topCategory.category} (${topCategory.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0
              })})`
            : "Not enough expense data yet."}
        </p>
      </div>

      <div className="insight-item">
        <h3>Monthly Comparison</h3>
        <p>
          {monthly.currentMonth
            ? `${monthly.currentMonth} vs ${monthly.previousMonth || "N/A"}: ${monthly.delta >= 0 ? "+" : ""}${monthly.delta.toLocaleString(
                "en-US",
                { style: "currency", currency: "USD", maximumFractionDigits: 0 }
              )} expense change`
            : "No monthly data available."}
        </p>
      </div>

      <div className="insight-item">
        <h3>Savings</h3>
        <p className="insight-savings-amount">
          {savings.savings.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
          })}{" "}
          saved overall
        </p>
        <p className="insight-savings-rate">
          {(savings.rate * 100).toFixed(1)}% of total income — net after expenses.
        </p>
      </div>
    </aside>
  );
}

