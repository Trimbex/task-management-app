"use client";

import { useActivity } from "@/hooks/useActivity";
import { StateNotice } from "@/components/ui/StateNotice";

export function ActivityFeed() {
  const { activity, visibleActivity, query, loading, error, setQuery, fetchActivity } =
    useActivity();

  return (
    <div className="stack">
      <header className="page-header">
        <h1>Activity Feed</h1>
        <p>
          {activity.length} entries, {visibleActivity.length} shown
        </p>
      </header>

      <input
        className="input"
        type="search"
        placeholder="Search activity"
        aria-label="Search activity"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <StateNotice
        loading={loading}
        error={error}
        loadingLabel="Loading activity..."
        onRetry={fetchActivity}
      />

      {!loading && !error ? (
        visibleActivity.length === 0 ? (
          <section className="card">
            <p className="muted">No activity matches your search.</p>
          </section>
        ) : (
          <section className="card" aria-label="Activity list">
            <ul className="list">
              {visibleActivity.map((item) => (
                <li key={item.id} className="activity-item">
                  <span className="action">{item.action || "(no action)"}</span>
                  <span>{item.info || "(no info)"}</span>
                  <small className="muted">{new Date(item.when).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </section>
        )
      ) : null}
    </div>
  );
}
