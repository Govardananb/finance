import React from "react";
import { useAppState } from "./context/AppStateContext";
import { SummaryCards } from "./components/SummaryCards";
import { BalanceTrendChart } from "./components/BalanceTrendChart";
import { CategoryBreakdownChart } from "./components/CategoryBreakdownChart";
import { TransactionsSection } from "./components/TransactionsSection";
import { InsightsPanel } from "./components/InsightsPanel";
import { ThemeToggle } from "./components/ThemeToggle";

export function App() {
  const { transactions } = useAppState();

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1 className="app-title">Finance Dashboard</h1>
          <p className="app-subtitle">Simple, interactive finance tracking with mock data.</p>
        </div>
        <div className="app-header-controls">
          <ThemeToggle />
        </div>
      </header>

      <main className="app-main">
        <section className="app-section">
          <SummaryCards transactions={transactions} />
          <div className="app-charts-grid">
            <BalanceTrendChart transactions={transactions} />
            <CategoryBreakdownChart transactions={transactions} />
          </div>
        </section>
        <section className="app-layout-split">
          <TransactionsSection />
          <InsightsPanel />
        </section>
      </main>
    </div>
  );
}

