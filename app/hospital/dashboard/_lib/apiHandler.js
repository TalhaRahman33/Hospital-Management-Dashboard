import { inpatientAPI } from "../../in-patient/_lib/apiHandler";
import { dischargedPatientAPI } from "../../discharge-patient/_lib/apiHandler";

export const dashboardAPI = {
	getData: async () => {
		const [inpatients, dischargedPatients] = await Promise.all([
			inpatientAPI.getAll("ADMITTED"),
			dischargedPatientAPI.getAll(),
		]);

		return { inpatients, dischargedPatients };
	},
};
