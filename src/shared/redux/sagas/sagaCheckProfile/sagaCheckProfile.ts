import { call, put, takeEvery } from 'redux-saga/effects';
import { sendForm } from '../../../api/axios/addFormApi/addFormApi';
import { showAttention } from '../../../helpers/attention';
import { requestAddProfileActions } from '../../slices/requestAddProfileSlice/requestAddProfileSlice';

/*** Actions для отправки формы */
export const FETCH_REQUEST_SEND_FORM = 'FETCH_REQUEST_ADD_BANNER';
export const FETCH_SUCCESS_SEND_FORM = 'FETCH_SUCCESS_SEND_FORM';
export const FETCH_FAILURE_SEND_FORM = 'FETCH_FAILURE_SEND_FORM';

/*** Action creators for add Profile */
export const fetchDataRequestAddProfile = (action: any) => ({ type: FETCH_REQUEST_SEND_FORM, payload: action });
export const fetchDataSuccessAddProfile = (data: any) => ({ type: FETCH_SUCCESS_SEND_FORM, payload: data });
export const fetchDataFailureAddProfile = (error: any) => ({ type: FETCH_FAILURE_SEND_FORM, payload: error });

export function* fetchSendForm(action: any) {
    try {
        yield put(requestAddProfileActions.fetchRequestSendForm());
        const response = yield call(() => sendForm(action.payload));
        if (response?.data?.form_validation?.message === 'Данные формы успешно обработаны') {
            showAttention('Данные формы успешно обработаны', 'success');
            yield put(requestAddProfileActions.fetchSuccessLogo());
        }
    } catch (err) {
        console.log(err);
    } finally {
        yield put(requestAddProfileActions.fetchSuccessSendForm());
    }
}

export function* watchFetchForm() {
    yield takeEvery(FETCH_REQUEST_SEND_FORM, fetchSendForm);
}
