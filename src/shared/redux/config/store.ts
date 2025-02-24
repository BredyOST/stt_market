import { ReducersMapObject } from 'redux';
import { Action, configureStore, createAsyncThunk, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import modalWindowReducer from '../../redux/slices/modalWindowStatesSlice/modalWindowStateSlice';
import { IReduxStore } from './storeType';
import FormsAddProfileReducer from './../slices/formsAddProfileSlice/formsAddProfileSlice';
import createSagaMiddleware from '@redux-saga/core';
import requestAddProfileReducer from './../slices/requestAddProfileSlice/requestAddProfileSlice';
import { all } from 'redux-saga/effects';
import LanguageReducer from './../slices/Language/languageSlice';
import authReducer from './../slices/authSlice/authSlice';
import WalletReducer from './../slices/walletSlice/walletSlice';
import UserProfilesReducer from './../slices/profiles/profilesSlice';
import UserInfoReducer from './../slices/authorizedInfo/authorizedInfo';

export const rootReducer: ReducersMapObject<IReduxStore> = {
    authSlice: authReducer,
    modalWindow: modalWindowReducer,
    formsAddProfile: FormsAddProfileReducer,
    requestAddProfile: requestAddProfileReducer,
    Language: LanguageReducer,
    walletSlice: WalletReducer,
    userProfiles: UserProfilesReducer,
    usersInfo: UserInfoReducer,
};

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
            serializableCheck: {
                // ignoredActions: [FETCH_REQUEST_UPLOAD_FILE],
                // ignoredPaths: ['payload.file'],
            },
        }).concat(sagaMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type AppThunk<R = void> = ThunkAction<R, RootState, any, UnknownAction>;

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
