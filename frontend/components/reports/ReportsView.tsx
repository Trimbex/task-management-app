"use client";

import { useReports } from "@/hooks/useReports";
import { StateNotice } from "@/components/ui/StateNotice";

type StatCardProps = {
  label: string;
  value: number;
  tone?: "todo" | "progress" | "done";
};

function StatCard({ label, value, tone }: StatCardProps) {
  return (
    <div className="card">
      <p className="stat-label">{label}</p>
      <p className={tone ? `stat-value ${tone}` : "stat-value"}>{value}</p>
    </div>
  );
}

export function ReportsView() {
  const { summary, loading, error, fetchSummary } = useReports();

  return (
    <div className="stack">
      <header className="page-header">
        <h1>Reports</h1>
        <p>Task totals and activity from the last 7 days.</p>
      </header>

      <StateNotice
        loading={loading}
        error={error}
        loadingLabel="Loading report..."
        onRetry={fetchSummary}
      />

      {summary && !loading && !error ? (
        <>
          <section className="grid-cards" aria-label="Totals">
            <StatCard label="Total tasks" value={summary.total} />
            <StatCard label="Recent activity" value={summary.recentActivityCount} />
          </section>

          <section className="stack" aria-label="Tasks by status">
            <h2>Tasks by status</h2>
            <div className="grid-cards">
              <StatCard label="To do" value={summary.byStatus.todo} tone="todo" />
              <StatCard label="In progress" value={summary.byStatus["in-progress"]} tone="progress" />
              <StatCard label="Done" value={summary.byStatus.done} tone="done" />
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
