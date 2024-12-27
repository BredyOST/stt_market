import axios, { AxiosError } from 'axios';

/** успешный ответ*/
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success: boolean;
}

/** ошибка*/
export interface ApiErrorResponse {
    message: string;
    status?: number;
    [key: string]: unknown;
}

export const api = axios.create({
    baseURL: process.env['API_URL '] || 'http://127.0.0.1:8000/',
    timeout: 5000,
});

const handleApiError = (error: AxiosError<ApiErrorResponse>) => {
    console.error('API Error:', error);
    const errorMessage = error.response?.data?.message || 'Произошла ошибка';
    return Promise.reject(errorMessage);
};

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => handleApiError(error)
);
