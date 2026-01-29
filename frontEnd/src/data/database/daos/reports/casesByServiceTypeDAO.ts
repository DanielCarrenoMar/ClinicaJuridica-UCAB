import type{ ProcessTypeDTO } from "@app/shared/typesDTO";

export interface CasesByServiceType {
  serviceType: ProcessTypeDTO;
  count: number;
}
