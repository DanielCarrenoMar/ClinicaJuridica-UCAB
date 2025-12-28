import type { UserModel } from "./user";
type StudentType = "REGULAR" | "VOLUNTEER" | "GRADUATE" | "SERVICE";
export interface StudentModel {
    user: UserModel;
    term: string;
    nrc?: string;
    type: StudentType;
}