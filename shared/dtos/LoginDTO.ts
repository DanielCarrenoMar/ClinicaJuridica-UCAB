export interface LoginResDTO {
    success: boolean;
    token?: string;
    message?: string;
}

export interface LoginReqDTO {
    email: string;
    password: string;
}