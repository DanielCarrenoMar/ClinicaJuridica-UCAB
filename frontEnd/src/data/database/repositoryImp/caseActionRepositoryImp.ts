import type { CaseActionRepository } from "#domain/repositories.ts";
import { daoToCaseActionModel, type CaseActionModel } from "#domain/models/caseAction.ts";
import { CASE_ACTION_URL } from "./apiUrl";
import type { CaseActionInfoDAO } from "#database/daos/caseActionInfoDAO.ts";

export function getCaseActionRepository(): CaseActionRepository {
	return {
		findAllCaseActions: async (params): Promise<CaseActionModel[] | null> => {
			try {
				const query = new URLSearchParams();
				if (params?.page !== undefined) query.set('page', String(params.page));
				if (params?.limit !== undefined) query.set('limit', String(params.limit));
				const url = query.toString() ? `${CASE_ACTION_URL}?${query.toString()}` : CASE_ACTION_URL;
				const actionsRes = await fetch(url);

				if (!actionsRes.ok) {
					throw new Error("El servidor respondió con un error al obtener las acciones de casos.");
				}

				const actionsData = await actionsRes.json();

				const actionsList: CaseActionInfoDAO[] = actionsData.data;

				return actionsList.map(action => daoToCaseActionModel(action));

			} catch (error) {
				throw error;
			}
		},


		findCaseActionById: async (id) => {

			const responseCaseAction = await fetch(`${CASE_ACTION_URL}/${id}`);
			if (!responseCaseAction.ok) return null;
			const casesActionData = await responseCaseAction.json();
			const caseActionDAO: CaseActionInfoDAO = casesActionData.data;

			return daoToCaseActionModel(caseActionDAO);
		},

		createCaseAction: async (data) => {
			try {
				const response = await fetch(CASE_ACTION_URL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					throw new Error("El servidor respondió con un error al crear la acción del caso.");
				}

				const responseData = await response.json();
				const caseActionDAO: CaseActionInfoDAO = responseData.data;
				return daoToCaseActionModel(caseActionDAO);
			} catch (error) {
				throw error;
			}
		},

		findActionsByUserId: async (userId: string) => {
			try {
				const response = await fetch(`${CASE_ACTION_URL}/user/${userId}`);
				if (!response.ok) return [];

				const result = await response.json();
				const actionsList: CaseActionInfoDAO[] = result.data ?? [];

				return actionsList.map(action => daoToCaseActionModel(action));
			} catch (error) {
				console.error("Error fetching user actions:", error);
				return [];
			}
		}
	} as CaseActionRepository;
}