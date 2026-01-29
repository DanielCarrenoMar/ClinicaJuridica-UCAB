import type { ProcessTypeDTO } from "@app/shared/typesDTO";

export interface CasesByType {
  type: ProcessTypeDTO;
  count: number;
}
