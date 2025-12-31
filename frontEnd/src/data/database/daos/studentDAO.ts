import type { StudentTypeDAO } from "../typesDAO";
import type { UserDAO } from "./UserDAO";

export interface StudentDAO extends Omit<UserDAO, 'type'> {
    term: string;
    nrc: string;
    type: StudentTypeDAO;
}