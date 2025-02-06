import { IModalWindowStatesSchema } from './modalWindowStatesSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IModalWindowStatesSchema = {
    modalAddProfileState: false,
    isClosingModalAddProfileState: false,

    modalSendTokens: false,
    isClosingModalSendTokens: false,

    modalSwap: false,
    isClosingModalSwap: false,

    modalDonation: false,
    isClosingModalDonation: false,

    modalNotifications: false,
    isClosingModalNotifications: false,

    modalSafetyConnection:false,
    isClosingModalSafetyConnection: false,

    modalTelegram: false,
    isClosingModalTelegram: false,

    modalSttBonus: false,
    isClosingSttBonus: false
};

const modalWindowStateSlice = createSlice({
    name: 'modalWindow',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<{modalName: keyof IModalWindowStatesSchema}>) => {
            const {modalName} = action.payload;
            state[modalName] = true;
        },
        closeModal: (state, action: PayloadAction<{modalName: keyof IModalWindowStatesSchema}>) => {
            const {modalName} = action.payload;
            state[modalName] = false;
            state[`isClosingModal${modalName.at(0).toUpperCase()}`] = true;
        },

        // удалить позже
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
