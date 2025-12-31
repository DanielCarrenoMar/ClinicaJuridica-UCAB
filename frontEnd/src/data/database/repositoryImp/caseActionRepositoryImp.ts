import type { CaseActionRepository } from "#domain/repositories.ts";
import { daoToCaseActionModel, type CaseActionModel } from "#domain/models/caseAction.ts";
import { CASE_ACTION_URL, CASE_URL } from "./apiUrl";
import type { CaseActionInfoDAO } from "#database/daos/caseActionInfoDAO.ts";
import type { CaseDAO } from "#database/daos/caseDAO.ts";

export function getCaseActionRepository(): CaseActionRepository {
	return {
		findAllCaseActions: async (): Promise<CaseActionModel[] | null> => {
			try {
				const [actionsRes, casesActionRes] = await Promise.all([
					fetch(CASE_ACTION_URL),
					fetch(CASE_URL)
				]);

				if (!actionsRes.ok || !casesActionRes.ok) {
					console.error("Error al obtener datos de las APIs");
					return null;
				}

				const actionsData = await actionsRes.json();
				const casesData = await casesActionRes.json();

				const actionsList: CaseActionInfoDAO[] = actionsData.data;
				const casesList: CaseDAO[] = casesData.data;

				// EL CRUCE DE DATOS (JOIN)
				// Recorremos las acciones y buscamos su Usuario y su Caso correspondiente
				const resultModels = actionsList.map((action) => {
					// 2. Buscar el Caso al que pertenece la acción
					const foundCase = casesList.find(c => c.idCase === action.idCase);

					// Si falta alguno de los padres, no podemos crear el modelo (Integridad Referencial)
					if (!foundCase) {
						console.warn(`Datos incompletos para Acción ${action.actionNumber} del Caso ${action.idCase}`);
						return null;
					}

					// 3. Crear el Modelo con los 3 ingredientes
					return daoToCaseActionModel(action, foundCase);
				});

				// Filtramos los nulos (por si hubo algún dato incompleto) y retornamos
				return resultModels.filter((item): item is CaseActionModel => item !== null);

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
			const respondeCase = await fetch(`${CASE_URL}`);
			if (!respondeCase.ok) return null;
			const caseData = await respondeCase.json();
			const caseDAO: CaseDAO[] = caseData.data;
			const resultCase = caseDAO.find(c => c.idCase === caseActionDAO.idCase);

			if (!resultCase) return null;
			return daoToCaseActionModel(caseActionDAO, resultCase);
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