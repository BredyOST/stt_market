import { Action, ReducersMapObject } from 'redux';
import { configureStore, createAsyncThunk, ThunkDispatch } from '@reduxjs/toolkit';
import modalWindowReducer from '../../redux/slices/modalWindowStatesSlice/modalWindowStateSlice';
import { IReduxStore } from './storeType';
import FormsAddProfileReducer from './../slices/formsAddProfileSlice/formsAddProfileSlice';
import createSagaMiddleware from '@redux-saga/core';
import requestAddProfileReducer from './../slices/requestAddProfileSlice/requestAddProfileSlice';
import { all } from 'redux-saga/effects';
import LanguageReducer from './../slices/Language/languageSlice';
import authReducer from './../slices/authSlice/authSlice';
import {watchFileUpload} from "../sagas/sagaUploadFiles/sagaUploadFiles";
import {watchFetchForm} from "../sagas/sagaCheckProfile/sagaCheckProfile";
import WalletReducer from './../slices/walletSlice/walletSlice'

const rootReducer: ReducersMapObject<IReduxStore> = {
    authSlice: authReducer,
    modalWindow: modalWindowReducer,
    formsAddProfile: FormsAddProfileReducer,
    requestAddProfile: requestAddProfileReducer,
    Language: LanguageReducer,
    walletSlice: WalletReducer
};

export const FETCH_REQUEST_UPLOAD_FILE = 'FETCH_REQUEST';
export const FETCH_REQUEST_SEND_FORM = 'FETCH_REQUEST_SEND_FORM';


const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: false,
            serializableCheck: {
                ignoredActions: [FETCH_REQUEST_UPLOAD_FILE],
                ignoredPaths: ['payload.file'],
            },
        }).concat(sagaMiddleware),
});

function* rootSaga() {
    yield all([watchFileUpload(), watchFetchForm()]);
}

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export type ThunkAction<
    R, // Return type of the thunk function
    S, // state type used by getState
    E, // any "extra argument" injected into the thunk
    A extends Action, // known types of actions that can be dispatched
> = (dispatch: ThunkDispatch<S, E, A>, getState: () => S, extraArgument: E) => R;
let extraArgument;
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState;
    dispatch: AppDispatch;
    extra: typeof extraArgument;
}>();
