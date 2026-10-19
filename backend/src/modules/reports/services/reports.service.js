const path = require('node:path');

const { readJsonArray } = require('../../../utils/jsonStore');

const TASKS_FILE_PATH = path.join(process.cwd(), 'data', 'tasks.json');
const ACTIVITY_FILE_PATH = path.join(process.cwd(), 'data', 'activity.json');

const RECENT_WINDOW_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Tasks only store `completed`, so status is derived from it unless a task
// carries an explicit `status` of "in-progress".
function getTaskStatus(task) {
  if (task.completed) {
    return 'done';
  }

  return task.status === 'in-progress' ? 'in-progress' : 'todo';
}

function countByStatus(tasks) {
  const byStatus = { todo: 0, 'in-progress': 0, done: 0 };

  for (const task of tasks) {
    byStatus[getTaskStatus(task)] += 1;
  }

  return byStatus;
}

function countRecentActivity(activities, now = Date.now()) {
  const since = now - RECENT_WINDOW_DAYS * MS_PER_DAY;

  return activities.filter((entry) => {
    const when = Date.parse(entry.when);
    return Number.isFinite(when) && when >= since;
  }).length;
}

async function getTasksSummary() {
  const [tasks, activities] = await Promise.all([
    readJsonArray(TASKS_FILE_PATH),
    readJsonArray(ACTIVITY_FILE_PATH),
  ]);

  return {
    total: tasks.length,
    byStatus: countByStatus(tasks),
    recentActivityCount: countRecentActivity(activities),
  };
}

module.exports = {
  getTasksSummary,
};
