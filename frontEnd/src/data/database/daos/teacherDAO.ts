import type { TeacherTypeDAO } from "../typesDAO";
import type { UserDAO } from "./UserDAO";

export interface StudentDAO extends Omit<UserDAO, 'type'> {
    term: string;
    type: TeacherTypeDAO;
}