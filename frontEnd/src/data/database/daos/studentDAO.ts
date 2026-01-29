import type { StudentTypeDTO } from "../typesDAO";
import type { UserDAO } from "./userDAO";

export interface StudentDAO extends Omit<UserDAO, 'type'> {
    term: string;
    nrc?: string;
    type: StudentTypeDTO;
}