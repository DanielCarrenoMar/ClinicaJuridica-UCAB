import type{ TeacherTypeDTO } from "@app/shared/typesDTO";

export interface ProfessorInvolvement {
  type: TeacherTypeDTO;
  count: number;
}
