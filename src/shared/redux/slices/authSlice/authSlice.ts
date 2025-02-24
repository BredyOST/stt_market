import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSchema } from './authShema';
import { FROM_OPTIONS, TO_OPTIONS } from '../../../const/index.const';

const initialState: AuthSchema = {
    loggedIn: false,
    signer: null,
    account: null,
    provider: null,
    wallet: null,
    sttRates: null,
    telegramValid: null,
    telegramCode: null,
    telegramUsername: null,
    withoutWallet: false,
    allowLogin: false,
    sourceToken: FROM_OPTIONS[0].label,
    targetToken: TO_OPTIONS[FROM_OPTIONS[0].value][0].label,
    walletKit: null,
    isLoader: false,
    chosenFavouritesIdReals: null,
    hasUpliner: false,
    tabRealsOrServices: 1,
    donationToken: 'stt',
    profilesWithServices: [],
    activeSlideCards: 0,
    erc20FromReals: null,
    transferToTheShop: null,
    donateWalletFromReals: null,
    walletFromSendTokensForm: null,
    textInfo: null,
};

const authSlice = createSlice({
    initialState,
    name: 'auth',
    reducers: {
        changeAuthState: <K extends keyof AuthSchema>(state: AuthSchema, action: PayloadAction<{ key: K; value: AuthSchema[K] }>) => {
            const { key, value } = action.payload;
            state[key] = value;
        },

        addTelegramCode: (state, action: PayloadAction<any>) => {
            state.telegramCode = action.payload;
        },
        addTelegramValid: (state, action: PayloadAction<any>) => {
            state.telegramValid = action.payload;
        },
        addTelegramUsername: (state, action: PayloadAction<string>) => {
            state.telegramUsername = action.payload;
        },

        addSourceToken: (state, action: PayloadAction<string>) => {
            state.sourceToken = action.payload;
        },
        addTargetToken: (state, action: PayloadAction<string>) => {
            state.targetToken = action.payload;
        },

        addLoader: (state, action: PayloadAction<boolean>) => {
            state.isLoader = action.payload;
        },

        addHasUpliner: (state, action: PayloadAction<boolean>) => {
            state.hasUpliner = action.payload;
        },

        addDonationToken: (state, action: PayloadAction<string>) => {
            state.donationToken = action.payload;
        },
    },
});

export default authSlice.reducer;
export const { actions: authActions } = authSlice;
