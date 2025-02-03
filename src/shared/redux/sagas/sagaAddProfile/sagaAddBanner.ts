import { call, put, takeEvery } from 'redux-saga/effects';
import { requestAddProfileActions } from '../../slices/requestAddProfileSlice/requestAddProfileSlice';
import { uploadVideo } from '../../../api/axios/addFormApi/addFormApi';
import { showAttention } from '../../../helpers/attention';
import { formsAddProfileActions } from '../../slices/formsAddProfileSlice/formsAddProfileSlice';

/*** Actions для отправки video */
export const FETCH_REQUEST_BANNER = 'FETCH_REQUEST_ADD_BANNER';
export const FETCH_SUCCESS_BANNER = 'FETCH_SUCCESS_ADD_BANNER';
export const FETCH_FAILURE_BANNER = 'FETCH_FAILURE_ADD_BANNER';

/*** Action creators for add Profile */
export const fetchDataRequestAddProfile = (action: any) => ({ type: FETCH_REQUEST_BANNER, payload: action });
export const fetchDataSuccessAddProfile = (data: any) => ({ type: FETCH_SUCCESS_BANNER, payload: data });
export const fetchDataFailureAddProfile = (error: any) => ({ type: FETCH_FAILURE_BANNER, payload: error });

export function* fetchAddProfileBanner(action) {
    try {
        // yield put(requestAddProfileActions.fetchRequestBanner());

        const formData = new FormData();
        formData.append('file', action.payload);

        // Отправляем файл на сервер
        const response = yield call(() => uploadVideo(formData));

        if (response?.status === 200 && response?.data?.message === 'Видео успешно загружено') {
            showAttention('Видео успешно загружено', 'success');
            yield put(formsAddProfileActions.addBanner(response?.data?.video_path));
        }
    } catch (err) {
        // yield put(requestAddProfileActions.fetchFailureBanner(err));
    } finally {
        // yield put(requestAddProfileActions.fetchSuccessBanner());
    }
}

export function* watchFetchAddBanner() {
    yield takeEvery(FETCH_REQUEST_BANNER, fetchAddProfileBanner);
}
