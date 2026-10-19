type StateNoticeProps = {
  loading: boolean;
  error: string;
  loadingLabel: string;
  onRetry: () => void;
};

export function StateNotice({ loading, error, loadingLabel, onRetry }: StateNoticeProps) {
  if (loading) {
    return (
      <section className="card" role="status" aria-live="polite">
        <p className="muted">{loadingLabel}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card error" role="alert">
        <p>{error}</p>
        <button type="button" className="button" onClick={onRetry}>
          Retry
        </button>
      </section>
    );
  }

  return null;
}
