import { api } from '../axiosInstance';

export interface uploadImageRequest {}

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
        timeout: 20000,
    };

    const response = await api.post<any>('/upload_video', formData, axiosConfig);
    return response;
};

/**отправка формы*/
export const sendForm = async (data) => {
    console.log(data);
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 20000,
    };
    const response = await api.post<any>('/check_form', data, axiosConfig);
    return response;
};
