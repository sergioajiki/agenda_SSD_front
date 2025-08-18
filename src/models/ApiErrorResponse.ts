export interface ApiErrorResponse {
    status: number;
    message: string;
    detail?: string;
    errors?: unknown;
}