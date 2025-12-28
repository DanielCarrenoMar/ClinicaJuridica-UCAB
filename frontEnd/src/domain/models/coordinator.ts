import type { UserModel } from "./user";

export interface CoordinatorModel {
    user: Omit<UserModel, "type">;
}