import { RequestAddProfileSchema } from './requestAddProfileSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: RequestAddProfileSchema = {
    isPendingAddLogo: false,
    isPendingAddBanner: false,
    isPendingSendForm: false,
    errorLogo: '',
    errorBanner: '',
    errorSendForm: '',
};

const requestAddProfileSlice = createSlice({
    name: 'requestAddProfile',
    initialState,
    reducers: {
        fetchRequestLogo: (state) => {
            state.isPendingAddLogo = true;
        },
        fetchRequestBanner: (state) => {
            state.isPendingAddBanner = true;
        },
        fetchRequestSendForm: (state) => {
            state.isPendingSendForm = true;
        },
        fetchSuccessLogo: (state) => {
            state.isPendingAddLogo = false;
        },
        fetchSuccessBanner: (state) => {
            state.isPendingAddBanner = false;
        },
        fetchSuccessSendForm: (state) => {
            state.isPendingSendForm = false;
        },
        fetchFailureLogo: (state, action: PayloadAction<any>) => {
            state.errorLogo = action.payload;
        },
        fetchFailureBanner: (state, action: PayloadAction<any>) => {
            state.errorBanner = action.payload;
        },
        fetchFailureSendForm: (state, action: PayloadAction<any>) => {
            state.errorSendForm = action.payload;
        },
    },
});

export default requestAddProfileSlice.reducer;
export const { actions: requestAddProfileActions } = requestAddProfileSlice;
