import type { UserReqDTO } from "@app/shared/dtos/UserDTO";
import type { StudentTypeDTO } from "@app/shared/typesDTO";

export interface StudentReqDTO extends Omit<UserReqDTO, 'type'> {
    term: string;
    nrc?: string;
    type: StudentTypeDTO;
}

export type StudentResDTO = StudentReqDTO;