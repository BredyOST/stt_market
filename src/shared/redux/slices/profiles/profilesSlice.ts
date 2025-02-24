import { IProfilesSchema, ProfileInfoType, ServicesType } from './profilesSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSchema } from '../authSlice/authShema';



const services = [
    {
        profile_data: {
            id: 1,
            userId: 1,
            title: 'iq Pump',
            wallet_number: null,
        },
        link: 'http///',
        type: 'service',
    }
]


const initialState: IProfilesSchema = {
    profilesForShowing: null,
    favouritesProfiles: null,
    services: services,
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
