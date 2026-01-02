import type { CaseActionRepository } from "#domain/repositories.ts";
import { daoToCaseActionModel, type CaseActionModel } from "#domain/models/caseAction.ts";
import { CASE_ACTION_URL } from "./apiUrl";
import type { CaseActionInfoDAO } from "#database/daos/caseActionInfoDAO.ts";

export function getCaseActionRepository(): CaseActionRepository {
	return {
		findAllCaseActions: async (): Promise<CaseActionModel[] | null> => {
			try {
				const actionsRes = await fetch(`${CASE_ACTION_URL}`);

				if (!actionsRes.ok) {
					console.error("Error al obtener datos de las APIs");
					return null;
				}

				const actionsData = await actionsRes.json();

				const actionsList: CaseActionInfoDAO[] = actionsData.data;

				return actionsList.map(action => daoToCaseActionModel(action));

			} catch (error) {
				console.error("Error de red o parsing:", error);
				return null;
			}
		},


		findCaseActionById: async (id) => {

			const responseCaseAction = await fetch(`${CASE_ACTION_URL}/${id}`);
			if (!responseCaseAction.ok) return null;
			const casesActionData = await responseCaseAction.json();
			const caseActionDAO: CaseActionInfoDAO = casesActionData.data;

			return daoToCaseActionModel(caseActionDAO);
		},

		// 3. CREAR UNA ACCIÓN NUEVA
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
					return null; // O lanzar error
				}

				// Generalmente el backend devuelve el objeto creado
				const responseData = await response.json();
				return responseData.data;
			} catch (error) {
				console.error("Error al crear acción:", error);
				return null;
			}
		},
	} as CaseActionRepository;
}