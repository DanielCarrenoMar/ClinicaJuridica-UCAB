import type{ StudentTypeDTO } from "@app/shared/typesDTO";

export interface StudentInvolvement {
  type: StudentTypeDTO;
  count: number;
}
