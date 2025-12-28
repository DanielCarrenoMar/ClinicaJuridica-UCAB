import type { UserModel } from "./user";
type TeacherType = "REGULAR" | "VOLUNTEER";
export interface TeacherModel {
    user: UserModel;
    term: string;
    type: TeacherType;
}