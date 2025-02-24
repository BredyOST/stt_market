import { api } from '../axiosInstance/axiosInstance';
import { WalletAuthorization } from '../dto/dto';

/**Авторизация пользователя*/
export const authorizationWithWallet = async (wallet: WalletAuthorization): Promise<any> => {
    const response = await api.post<WalletAuthorization>('/user/login');
    return response;
};

/** получение первых 50 профилей*/
export const getReals = async (data): Promise<any> => {
    const response = await api.get('/profiles');
    return response;
};

/**отправка image для загрузки*/
export const uploadImage = async (formData): Promise<any> => {
    const response = await api.post<any>('/upload_image', formData);
    return response;
};

/**отправка video для загрузки*/
export const uploadVideo = async (formData): Promise<any> => {
    const axiosConfig = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        timeout: 100000,
    };
    const response = await api.post<any>('/upload_video', formData, axiosConfig);
    return response;
};

/**отправка формы*/
export const sendForm = async (data) => {
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 20000,
    };

    const response = await api.post<any>('/check_form', data, axiosConfig);
    return response;
};

/** проверка транзакции*/
export const checkTransaction = async () => {
    const response = await api.post<any>('/transaction_check');
    return response;
};

/** сохранение профиля*/
export const saveProfile = async (data) => {
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 20000,
    };

    const response = await api.post<any>('/save_profile', data, axiosConfig);
    return response;
};
