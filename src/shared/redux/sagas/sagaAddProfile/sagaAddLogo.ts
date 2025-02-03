import { call, put, takeEvery } from 'redux-saga/effects';
import { uploadImage } from '../../../api/axios/addFormApi/addFormApi';
import { requestAddProfileActions } from '../../slices/requestAddProfileSlice/requestAddProfileSlice';
import { showAttention } from '../../../helpers/attention';
import formsAddProfileSlice, { formsAddProfileActions } from '../../slices/formsAddProfileSlice/formsAddProfileSlice';

/*** Actions для отправки image */
export const FETCH_REQUEST_LOGO = 'FETCH_REQUEST_ADD_LOGO';
export const FETCH_SUCCESS_LOGO = 'FETCH_SUCCESS_ADD_LOGO';
export const FETCH_FAILURE_LOGO = 'FETCH_FAILURE_ADD_LOGO';

/*** Action creators for add Profile */
export const fetchDataRequestAddProfile = (action: any) => ({ type: FETCH_REQUEST_LOGO, payload: action });
export const fetchDataSuccessAddProfile = (data: any) => ({ type: FETCH_SUCCESS_LOGO, payload: data });
export const fetchDataFailureAddProfile = (error: any) => ({ type: FETCH_FAILURE_LOGO, payload: error });

export function* fetchAddProfileLogo(action) {
    try {
        yield put(requestAddProfileActions.fetchRequest({ type: 'logo' }));

        const formData = new FormData();
        formData.append('file', action.payload);

        // Отправляем файл на сервер
        const response = yield call(() => uploadImage(formData));
        if (response?.status === 200 && response?.data?.message === 'Изображение успешно загружено') {
            showAttention('Изображение успешно загружено', 'success');
            yield put(formsAddProfileActions.addLogo(response?.data?.image_path));
        }
    } catch (err) {
        yield put(requestAddProfileActions.fetchFailure({ type: 'logo', error: err }));
    } finally {
        // yield put(requestAddProfileActions.fetchSuccess({ type: 'logo', data: response?.data?.message}));
    }
}

export function* watchFetchAddLogo() {
    yield takeEvery(FETCH_REQUEST_LOGO, fetchAddProfileLogo);
}
