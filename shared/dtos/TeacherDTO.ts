import type { TeacherTypeDTO } from "@app/shared/typesDTO";
import type { UserReqDTO } from "@app/shared/dtos/UserDTO";

export interface TeacherReqDTO extends Omit<UserReqDTO, 'type'> {
    term: string;
    type: TeacherTypeDTO;
}

export type TeacherResDTO = TeacherReqDTO;