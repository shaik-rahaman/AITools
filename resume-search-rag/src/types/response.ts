// src/types/response.ts

export interface SuccessResponse<T> {
    status: 'success';
    data: T;
}

export interface ErrorResponse {
    status: 'error';
    message: string;
    code?: number;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;