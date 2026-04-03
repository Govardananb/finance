import React from "react";
import { getMonthlyAggregates } from "../utils/financeSelectors";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function BalanceTrendChart({ transactions }) {
  const data = getMonthlyAggregates(transactions).map((m) => ({ ...m, monthLabel: m.month }));

  return (
    <article className="chart-card">
      <header className="chart-card-header">
        <h2>Balance Trend</h2>
        <p className="chart-card-subtitle">Monthly movement in income, expenses, and net balance.</p>
      </header>
      {!data.length ? (
        <p className="empty-state">No data yet. Add transactions to see the chart.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="monthLabel" />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
              }
            />
            <Line dataKey="income" name="Income" stroke="#16a34a" strokeWidth={2} />
            <Line dataKey="expenses" name="Expenses" stroke="#dc2626" strokeWidth={2} />
            <Line dataKey="balance" name="Balance" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </article>
  );
}

