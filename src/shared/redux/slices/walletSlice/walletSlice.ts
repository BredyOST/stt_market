import {WalletState} from "./walletSchema";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: WalletState = {
    sttBalance: 0,
    usdtBalance: 0,
    etcBalance:0,
    helpUsdtBalance:0,
    successTransferTokens: false,
    successSwap: false,
}


const WalletSlice= createSlice({
    initialState,
    name: 'wallet',
    reducers: {
        addBalanceStt: (state, action: PayloadAction<number>) => {
            state.sttBalance = action.payload;
        },
        addUdtStt: (state, action: PayloadAction<number>) => {
            state.usdtBalance = action.payload;
        },
        addEtcStt: (state, action: PayloadAction<number>) => {
            state.etcBalance = action.payload;
        },
        addHelpUsdt: (state, action:PayloadAction<number>) => {
            state.helpUsdtBalance = action.payload;
        },
        addSuccessTransferToken: (state, action: PayloadAction<boolean>) => {
            state.successTransferTokens = action.payload;
        },
        addSuccessSwap: (state, action: PayloadAction<boolean>) => {
            state.successSwap = action.payload;
        }
    }
})

export default WalletSlice.reducer;
export const {actions: walletActions} = WalletSlice;