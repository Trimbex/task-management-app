"use client";

import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types/api";
import { StatusFilter } from "@/components/tasks/StatusFilter";
import { TaskList } from "@/components/tasks/TaskList";
import { StateNotice } from "@/components/ui/StateNotice";

export function TaskDashboard() {
  const {
    tasks,
    filteredTasks,
    filter,
    loading,
    error,
    updatingTaskId,
    setFilter,
    fetchTasks,
    updateTaskStatus,
  } = useTasks();

  const handleToggle = (task: Task) => {
    updateTaskStatus(task.id, !task.completed);
  };

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <section className="stack">
      <header className="page-header">
        <h1>Task Dashboard</h1>
        <p>
          {completedCount} of {tasks.length} tasks completed
        </p>
      </header>

      <StatusFilter value={filter} onChange={setFilter} />

      <StateNotice
        loading={loading}
        error={error}
        loadingLabel="Loading tasks..."
        onRetry={fetchTasks}
      />

      {!loading && !error ? (
        <TaskList tasks={filteredTasks} updatingTaskId={updatingTaskId} onToggle={handleToggle} />
      ) : null}
    </section>
  );
}
