export const CHECKUP_ACTIVE_STATUSES = ["WAITING", "IN_PROGRESS"];

export const getItems = (data, key) => {
  if (Array.isArray(data)) return data;

  const containers = [data, data?.data, data?.result, data?.payload];
  const keys = [key, key === "inpatients" ? "inPatients" : key];

  for (const container of containers) {
    if (Array.isArray(container)) return container;
    for (const candidate of keys) {
      if (Array.isArray(container?.[candidate])) return container[candidate];
    }
  }

  return [];
};

export const getCheckupPatientId = (checkup) => Number(checkup?.patientId ?? checkup?.patient?.id);

export const getActiveCheckupPatientIds = (checkups) =>
  new Set(
    checkups
      .filter((checkup) => CHECKUP_ACTIVE_STATUSES.includes(checkup.status))
      .map(getCheckupPatientId)
      .filter(Boolean)
  );