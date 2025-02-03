import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthSchemaState} from "./authShema";
import {FROM_OPTIONS, TO_OPTIONS} from "../../../const/index.const";
import {SwapOptionsFrom} from "../../../../entities/others";

const initialState: AuthSchemaState = {
    loggedIn: false,
    account: null,
    provider: null,
    wallet: null,
    sttRates:null,
    telegramValid: null,
    telegramCode: null,
    telegramUsername: null,
    withoutWallet: false,
    allowLogin: false,
    sourceToken: FROM_OPTIONS[0].label,
    targetToken: TO_OPTIONS[FROM_OPTIONS[0].value][0].label,
    walletKit:null,
}

const authSlice = createSlice({
    initialState,
    name: 'auth',
    reducers: {
        changeStateLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.loggedIn = action.payload;
        },
        addAccount: (state, action: PayloadAction<any>) => {
            state.account = action.payload;
        },
        addProvider: (state, action: PayloadAction<any>) => {
            state.provider = action.payload;
        },
        addWallet: (state, action: PayloadAction<string>) => {
            state.wallet = action.payload;
        },
        addSttRates: (state, action: PayloadAction<any>) => {
            state.sttRates = action.payload;
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
        addWithoutWallet: (state, action: PayloadAction<boolean>) => {
            state.withoutWallet = action.payload;
        },
        addAllowLogin: (state, action: PayloadAction<boolean>) => {
            state.allowLogin = action.payload;
        },
        addSourceToken: (state, action: PayloadAction<string>) => {
            state.sourceToken = action.payload;
        },
        addTargetToken: (state, action: PayloadAction<string>) => {
            state.targetToken = action.payload;
        },
        addWalletKit: (state, action: PayloadAction<any>) => {
            state.walletKit = action.payload;
        }
    }
})


export default authSlice.reducer;
export const {actions: authActions } = authSlice;
