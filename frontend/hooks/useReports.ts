"use client";

import { useCallback, useEffect, useState } from "react";
import { getErrorMessage, requestJson } from "@/lib/apiClient";
import type { TasksSummary } from "@/types/api";

export function useReports() {
  const [summary, setSummary] = useState<TasksSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSummary(await requestJson<TasksSummary>("/api/reports/tasks-summary"));
    } catch (error) {
      setError(getErrorMessage(error, "Could not load the report right now."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, fetchSummary };
}
