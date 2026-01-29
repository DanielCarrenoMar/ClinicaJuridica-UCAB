import type { TeacherTypeDTO } from "../typesDAO";
import type { UserDAO } from "./userDAO";

export interface TeacherDAO extends Omit<UserDAO, 'type'> {
    term: string;
    type: TeacherTypeDTO;
}