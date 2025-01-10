import axios, { AxiosError } from 'axios';
import {showAttention} from "../../helpers/attention";
import {put} from "redux-saga/effects";
import {requestAddProfileActions} from "../../redux/slices/requestAddProfileSlice/requestAddProfileSlice";
import {store} from './../../redux/config/store';

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
    baseURL: process.env['NEXT_PUBLIC_URL '] || 'http://127.0.0.1:8000/',
    timeout: 15000,
});

const handleApiError = (error: AxiosError<ApiErrorResponse>) => {
    console.error('API Error:', error);
    if(error.response?.data?.detail) {
        showAttention(error.response?.data?.detail as string, 'error');
    }
    if(error.response?.data?.detail === 'Неверный формат изображения') {
        store.dispatch(requestAddProfileActions.fetchFailure({ type: 'logo', error: error.response?.data?.detail }))
    }

    const errorMessage = error.response?.data?.detail || 'Произошла ошибка';
    return Promise.reject(errorMessage);
};

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => handleApiError(error)
);
