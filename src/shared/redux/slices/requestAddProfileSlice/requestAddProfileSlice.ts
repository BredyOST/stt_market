import {RequestAddProfileSchema } from './requestAddProfileSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: RequestAddProfileSchema = {
    logo: { isPending: false, error: null, data: null},
    banner: { isPending: false, error: null, data: null },
    form: { isPending: false, error: null, data: null },
    transaction: { isPending: false, error: null, data: null },
};

const requestAddProfileSlice = createSlice({
    name: 'requestAddProfile',
    initialState,
    reducers: {
        fetchRequest: (state, action:PayloadAction<{ type: 'logo' | 'banner' | 'form' | 'transaction'}>) => {
            state[action.payload.type].isPending = true
            state[action.payload.type].error = null
        },
        fetchSuccess: (state, action: PayloadAction<{ type: 'logo' | 'banner' | 'form' | 'transaction', data: any }>) => {
            state[action.payload.type].isPending = false;
            state[action.payload.type].data = action.payload.data;
        },
        fetchFailure: (
            state,
            action: PayloadAction<{ type: 'logo' | 'banner' | 'form' | 'transaction', error: string }>
        ) => {
            state[action.payload.type].isPending = false;
            state[action.payload.type].error = action.payload.error;
        },
    },
});

export default requestAddProfileSlice.reducer;
export const { actions: requestAddProfileActions } = requestAddProfileSlice;
