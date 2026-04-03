import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { getCategoryBreakdown } from "../utils/financeSelectors";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f97316", "#ec4899", "#22c55e", "#f43f5e"];

export function CategoryBreakdownChart({ transactions }) {
  const data = getCategoryBreakdown(transactions);
  return (
    <article className="chart-card">
      <header className="chart-card-header">
        <h2>Spending Breakdown</h2>
        <p className="chart-card-subtitle">Expense distribution by category.</p>
      </header>
      {!data.length ? (
        <p className="empty-state">No expense records yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="amount" nameKey="category" outerRadius={88} paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </article>
  );
}

