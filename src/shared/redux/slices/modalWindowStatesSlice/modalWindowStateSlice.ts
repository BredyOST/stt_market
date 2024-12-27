import { IModalWindowStatesSchema } from './modalWindowStatesShema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IModalWindowStatesSchema = {
    modalAddProfileState: false,
    isClosingModalAddProfileState: false,
};

const modalWindowStateSlice = createSlice({
    name: 'modalWindow',
    initialState,
    reducers: {
        changeModalAddProfileState: (state, action: PayloadAction<boolean>) => {
            state.modalAddProfileState = action.payload;
            state.isClosingModalAddProfileState = false;
        },
        changeModalAddProfileStateIsClosing: (state, action: PayloadAction<true>) => {
            state.isClosingModalAddProfileState = true;
        },
    },
});

export default modalWindowStateSlice.reducer;
export const { actions: modalAddProfileActions } = modalWindowStateSlice;
