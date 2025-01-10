import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthSchemaState} from "./authShema";

const initialState: AuthSchemaState = {
    loggedIn: false,
    account: null,
    provider: null,
    wallet: null
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
        }
    }
})


export default authSlice.reducer;
export const {actions: authActions } = authSlice;
