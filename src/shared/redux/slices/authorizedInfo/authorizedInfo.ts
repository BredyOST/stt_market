import { AuthorizedInfoSchema, User } from './authorizedInfoSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { rootReducer } from '../../config/store';

const initialState: AuthorizedInfoSchema = {
    userInfo: null,
    isPending: false,
    loginError: null,
};

export const UserSlice = createSlice({
    initialState,
    name: 'useInfo',
    selectors: {
        userInfo: (state) => state.userInfo,
    },
    reducers: {
        addUser: (state, action: PayloadAction<User>) => {
            state.userInfo = action.payload;
            state.loginError = null;
        },
        changeUserInfo: <K extends keyof AuthorizedInfoSchema>(
            state: AuthorizedInfoSchema,
            action: PayloadAction<{ key: K; value: AuthorizedInfoSchema[K] }>
        ) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
    },
});

export default UserSlice.reducer;
export const { actions: usersActions } = UserSlice;
