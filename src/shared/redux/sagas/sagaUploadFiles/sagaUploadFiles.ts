import { call, put, takeEvery } from 'redux-saga/effects';
import {uploadImage, uploadVideo} from '../../../api/axios/addFormApi/addFormApi';
import { requestAddProfileActions } from '../../slices/requestAddProfileSlice/requestAddProfileSlice';
import { showAttention } from '../../../helpers/attention';
import { formsAddProfileActions } from '../../slices/formsAddProfileSlice/formsAddProfileSlice';
import {FETCH_REQUEST_UPLOAD_FILE} from "../../config/store";


// Action types

export interface UploadAction {
    type: typeof FETCH_REQUEST_UPLOAD_FILE;
    payload: { file: File; type: 'logo' | 'banner' };
}

function* handleFileUpload(action: UploadAction) {
    const { file, type } = action.payload;

    try {
        yield put(requestAddProfileActions.fetchRequest({type: type}));

        const formData = new FormData();
        formData.append('file', file);

        const uploadFn = type === 'logo' ? uploadImage : uploadVideo;
        const response = yield call(uploadFn, formData);

        if (
            response?.status === 200 &&
            response?.data?.message === `${type === 'logo' ? 'Изображение' : 'Видео'} успешно загружено`
        ) {
            showAttention(`${type === 'logo' ? 'Изображение' : 'Видео'} успешно загружено`, 'success');

            const path = type === 'logo' ? response.data.image_path : response.data.video_path;
            const addAction = type === 'logo' ? formsAddProfileActions.addLogo : formsAddProfileActions.addBanner;
            yield put(addAction(path));

            let currentLocal: string = localStorage.getItem('formData');

            if(!currentLocal) {
                const obj  = {
                    name: '',
                    url: '',
                    activity_hobbies: '',
                    hashtags: '',
                    is_incognito: 'false',
                    logoLink: type === 'logo' ? path : '',
                    bannerLink: type === 'banner' ? path : '',
                    coordinates: null,
                    marketingPercent: `30`,
                    mlm: '30',
                    language: '',
                };
                localStorage.setItem('formData', JSON.stringify(obj));
            } else if(currentLocal) {
                let storage = JSON.parse(currentLocal);
                if(type === 'logo') {
                    storage.logoLink = path
                } else if(type === 'banner') {
                    storage.bannerLink = path
                }
                localStorage.setItem('formData', JSON.stringify(storage));
            }
            yield put(requestAddProfileActions.fetchSuccess({type: type, data: response.data}));
        } else {
            throw new Error(response?.data?.message || 'Неизвестная ошибка');
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || err.response?.data?.detail || 'Ошибка загрузки';
        yield put(requestAddProfileActions.fetchFailure({ type, error: errorMessage }));
        showAttention(errorMessage, 'error');
    }
}

export function* watchFileUpload() {
    yield takeEvery(FETCH_REQUEST_UPLOAD_FILE, handleFileUpload);
}

