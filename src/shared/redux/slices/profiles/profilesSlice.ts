import { IProfilesSchema, ProfileInfoType, ServicesType } from './profilesSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSchema } from '../authSlice/authShema';

const initialState: IProfilesSchema = {
    profilesForShowing: null,
    favouritesProfiles: null,
    services: null,
    chosenFavouritesIdReals: null,
    chosenServiceId: null,
    isOpen: 'reals',
    finishedQrScannerReals: false,
    finishedQrScannerSendTokens: false,
    erc20FromQrForSearch: null,
    erc20FromQrForSendFrom: null,
    coordinatesProfileForShowing: null,
    saveClosedRealsBeforeShowingOnTheMap: null,
};

export const ProfilesSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {
        changeProfilesAnSServicesState: <K extends keyof IProfilesSchema>(
            state: IProfilesSchema,
            action: PayloadAction<{ key: K; value: IProfilesSchema[K] }>
        ) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
    },
});

export default ProfilesSlice.reducer;
export const { actions: profilesActions } = ProfilesSlice;
