export const CHECKUP_ACTIVE_STATUSES = ["WAITING", "IN_PROGRESS"];

export const getItems = (data, key) => data?.[key] || (Array.isArray(data) ? data : []);

export const getCheckupPatientId = (checkup) => Number(checkup?.patientId ?? checkup?.patient?.id);

export const getActiveCheckupPatientIds = (checkups) =>
  new Set(
    checkups
      .filter((checkup) => CHECKUP_ACTIVE_STATUSES.includes(checkup.status))
      .map(getCheckupPatientId)
      .filter(Boolean)
  );