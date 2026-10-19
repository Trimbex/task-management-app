const activityService = require('../services/activity.service');
const HttpError = require('../../../utils/httpError');

function readOptionalString(body, field) {
  const value = body[field];

  if (value !== undefined && typeof value !== 'string') {
    throw new HttpError(400, `"${field}" must be a string.`);
  }

  return value;
}

async function listActivity(req, res) {
  const activities = await activityService.getAllActivity();
  res.json(activities);
}

async function createActivity(req, res) {
  const body = req.body || {};

  if (typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Body must be a JSON object.');
  }

  const activity = await activityService.createActivity({
    action: readOptionalString(body, 'action'),
    info: readOptionalString(body, 'info'),
  });

  res.status(201).json(activity);
}

module.exports = {
  listActivity,
  createActivity,
};
