import { BACKEND_BASE_URL } from "@/lib/constants";
import type {
  ActivityLog,
  ErrorResponse,
  Task,
  TaskResponse,
  TasksResponse,
  TasksSummary,
} from "@/types/api";

export class BackendError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "BackendError";
  }
}

async function backendRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BACKEND_BASE_URL}${path}`, { cache: "no-store", ...init });
  } catch {
    throw new BackendError("Could not reach the backend.", 502);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ErrorResponse;
    throw new BackendError(
      body.error?.message || `Request failed with status ${response.status}`,
      response.status
    );
  }

  return (await response.json()) as T;
}

export async function getTasksFromBackend(): Promise<Task[]> {
  const body = await backendRequest<TasksResponse>("/tasks");
  return body.data;
}

export async function updateTaskInBackend(taskId: string, completed: boolean): Promise<Task> {
  const body = await backendRequest<TaskResponse>(`/tasks/${encodeURIComponent(taskId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  return body.data;
}

export function getActivityFromBackend(): Promise<ActivityLog[]> {
  return backendRequest<ActivityLog[]>("/activity");
}

export function getTasksSummaryFromBackend(): Promise<TasksSummary> {
  return backendRequest<TasksSummary>("/reports/tasks-summary");
}
