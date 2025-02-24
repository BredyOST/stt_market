import axios, { AxiosError } from 'axios';
import { showAttention } from '../../../helpers/attention';
import { requestAddProfileActions } from '../../../redux/slices/requestAddProfileSlice/requestAddProfileSlice';
import { store } from '../../../redux/config/store';

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
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 15000,
});

function getCookie(name) {
    // if (parts.length === 2) return parts.pop().split(';').shift();
}

api.interceptors.request.use(
    (config) => {
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find((cookie) => cookie.startsWith('tokens='));
        let tokens = null;

        if (tokenCookie) {
            console.log(2222);
            const tokenValue = tokenCookie.split('=')[1]; // Получаем значение
            tokens = JSON.parse(decodeURIComponent(tokenValue)); // Преобразуем строку обратно в объект
            console.log(tokens);
        }

        // Если токены существуют, добавляем их в заголовок Authorization
        if (tokens) {
            config.headers['Authorization'] = `Bearer ${tokens.access}`;
        }

        console.log('Заголовок Authorization:', config.headers['Authorization']);

        return config;
    },
    (error) => {
        // Обработка ошибок запроса
        return Promise.reject(error);
    }
);

const handleApiError = (error: AxiosError<ApiErrorResponse>) => {
    console.error('API Error:', error);
    if (error.response?.data?.detail) {
        showAttention(error.response?.data?.detail as string, 'error');
    }
    if (error.response?.data?.detail === 'Неверный формат изображения') {
        store.dispatch(requestAddProfileActions.fetchFailure({ type: 'logo', error: error.response?.data?.detail }));
    }

    const errorMessage = error.response?.data?.detail || 'Произошла ошибка';
    return Promise.reject(errorMessage);
};

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => handleApiError(error)
);
