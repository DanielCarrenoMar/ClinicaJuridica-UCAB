import type { CaseActionRepository } from "#domain/repositories.ts";
import { daoToCaseActionModel, type CaseActionModel } from "#domain/models/caseAction.ts";
import { CASE_ACTION_URL } from "./apiUrl";
import type { CaseActionInfoDAO } from "#database/daos/caseActionInfoDAO.ts";

export function getCaseActionRepository(): CaseActionRepository {
	return {
		findAllCaseActions: async (_params): Promise<CaseActionModel[] | null> => {
			const actionsRes = await fetch(CASE_ACTION_URL, { method: 'GET', credentials: 'include' });
			const actionsData = await actionsRes.json();
			if (!actionsRes.ok) throw new Error(actionsData.message || 'Error fetching case actions');
			const actionsList: CaseActionInfoDAO[] = actionsData.data;
			return actionsList.map(action => daoToCaseActionModel(action));
		},


		findCaseActionById: async (id) => {

			const responseCaseAction = await fetch(`${CASE_ACTION_URL}/${id}`, { method: 'GET', credentials: 'include' });
			const casesActionData = await responseCaseAction.json();
			if (!responseCaseAction.ok) throw new Error(casesActionData.message || 'Error fetching case action');
			const caseActionDAO: CaseActionInfoDAO = casesActionData.data;
			return daoToCaseActionModel(caseActionDAO);
		},

		createCaseAction: async (data) => {
			try {
				const response = await fetch(CASE_ACTION_URL, {
					method: "POST",
					credentials: 'include',
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});

				const responseData = await response.json();
				if (!response.ok) throw new Error(responseData.message || 'Error creating case action');
				const caseActionDAO: CaseActionInfoDAO = responseData.data;
				return daoToCaseActionModel(caseActionDAO);
			} catch (error) {
				throw error;
			}
		},

		findActionsByUserId: async (userId: string, params) => {
			try {
				const query = new URLSearchParams();
				if (params?.page !== undefined) query.set('page', String(params.page));
				if (params?.limit !== undefined) query.set('limit', String(params.limit));
				const url = query.toString()
					? `${CASE_ACTION_URL}/user/${userId}?${query.toString()}`
					: `${CASE_ACTION_URL}/user/${userId}`;
				const response = await fetch(url, { method: 'GET', credentials: 'include' });
				const result = await response.json();
				if (!response.ok) throw new Error(result.message || 'Error fetching user actions');
				const actionsList: CaseActionInfoDAO[] = result.data ?? [];
				return actionsList.map(action => daoToCaseActionModel(action));
			} catch (error) {
				console.error("Error fetching user actions:", error);
				return [];
			}
		}
	} as CaseActionRepository;
}