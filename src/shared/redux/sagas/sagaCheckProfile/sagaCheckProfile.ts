import { call, put, takeEvery } from 'redux-saga/effects';
import {checkTransaction, saveProfile, sendForm} from '../../../api/axios/addFormApi/addFormApi';
import { showAttention } from '../../../helpers/attention';
import { requestAddProfileActions } from '../../slices/requestAddProfileSlice/requestAddProfileSlice';
import {FETCH_REQUEST_SEND_FORM, FETCH_REQUEST_UPLOAD_FILE} from "../../config/store";



/*** Action creators for add Profile */
export const fetchDataRequestAddProfile = (payload) => ({
    type: FETCH_REQUEST_SEND_FORM,
    payload,
});

export interface UploadAction {
    type: typeof FETCH_REQUEST_SEND_FORM;
    payload: any;
}

function* fetchSendForm(action: UploadAction) {

    try {

        const {image_data, video_data, ...others}  = action.payload;

        yield put(requestAddProfileActions.fetchRequest({type: 'form'}));
        const response: any = yield call(sendForm, others);

        if (response?.status === 200 && response?.data?.form_validation?.message === 'Данные формы успешно обработаны') {
            yield call(showAttention, 'Данные формы успешно обработаны', 'success');
            yield put(requestAddProfileActions.fetchSuccess({type: 'form', data: response.data}));

            yield put(requestAddProfileActions.fetchRequest({type: 'transaction'}));

            const result = yield call(checkTransaction)

            if (result?.status === 200 && result?.data?.payment_status === 'Платеж подтвержден') {
                yield call(showAttention, 'Транзакция успешно проведена', 'success');

                const result = yield call(saveProfile, {
                    profile_data: {
                        activity_hobbies: others.activity_hobbies,
                        adress: others.adress,
                        coordinates: others.coordinates,
                        hashtags: others.hashtags,
                        is_incognito: others.is_incognito,
                        name: others.name,
                        url: others.url,
                        wallet_number: others.wallet_number
                },
                    image_data: image_data,
                    video_data: video_data
                })
            }

        }
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Произошла ошибка';
        yield call(showAttention, errorMessage, 'error');
        yield put(requestAddProfileActions.fetchFailure({type: 'form', error: errorMessage}));
    }
}

// Saga watcher
export function* watchFetchForm() {
    yield takeEvery(FETCH_REQUEST_SEND_FORM, fetchSendForm);
}