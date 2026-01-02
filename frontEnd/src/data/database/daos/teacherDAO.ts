import type { TeacherTypeDAO } from "../typesDAO";
import type { UserDAO } from "./userDAO";

export interface TeacherDAO extends Omit<UserDAO, 'type'> {
    term: string;
    type: TeacherTypeDAO;
}