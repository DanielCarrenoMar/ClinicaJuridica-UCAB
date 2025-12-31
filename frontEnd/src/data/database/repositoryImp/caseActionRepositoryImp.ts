import type { CaseActionRepository } from "#domain/repositories.ts";
import { CASE_ACTION_URL } from "./apiUrl";
import type { CaseActionInfoDAO } from "#database/daos/caseActionInfoDAO.ts";

export function getCaseActionRepository(): CaseActionRepository {
	return {
		findAllCaseActions: async () => {
			const response = await fetch(CASE_ACTION_URL);
			if (!response.ok) return [];
			const result = await response.json();
			const daos: Array<CaseActionInfoDAO & { idNucleus?: string; term?: string }> = result.data ?? [];
			return daos.map((dao) => {
				const prefix = typeof dao.userId === 'string' && /^[VEJ]/i.test(dao.userId) ? dao.userId[0].toUpperCase() : 'V';
				const compound = dao.idNucleus && dao.term ? `${dao.idNucleus}_${dao.term}_${dao.idCase}` : String(dao.idCase);
				return {
					idCase: dao.idCase,
					caseCompoundKey: compound,
					actionNumber: dao.actionNumber,
					description: dao.description,
					notes: (dao as any).notes ?? null,
					userId: dao.userId,
					userNacionality: prefix as any,
					userName: dao.userName,
					registryDate: new Date(dao.registryDate as any),
				};
			});
		},
		findCaseActionById: async () => {
			return null;
		},
		createCaseAction: async (data) => {
			const response = await fetch(CASE_ACTION_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			const result = await response.json();
			return result.data;
		},
	} as CaseActionRepository;
}