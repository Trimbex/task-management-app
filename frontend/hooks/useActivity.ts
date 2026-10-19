"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage, requestJson } from "@/lib/apiClient";
import type { ActivityLog } from "@/types/api";

export function useActivity() {
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setActivity(await requestJson<ActivityLog[]>("/api/activity"));
    } catch (error) {
      setError(getErrorMessage(error, "Could not load activity right now."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const visibleActivity = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) {
      return activity;
    }

    return activity.filter(
      (item) =>
        (item.action || "").toLowerCase().includes(text) ||
        (item.info || "").toLowerCase().includes(text)
    );
  }, [activity, query]);

  return { activity, visibleActivity, query, loading, error, setQuery, fetchActivity };
}
