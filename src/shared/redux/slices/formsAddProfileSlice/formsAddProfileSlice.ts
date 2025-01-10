import { FormsAddProfileSchema } from './formsAddProfileSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Feature} from "../../../../widgets/geolocation/geolocation";

const initialState: FormsAddProfileSchema = {
    name: '',
    url: '',
    activity_hobbies: '',
    hashtags: '',
    logoLink: '',
    bannerLink: '',
    coordinates: null,
    language: '',
    mlm: '35',
    marketingPercent: '',
    is_incognito: true,
    inputGeo: '',
    tab: 2.1,
    wallet_number:'',
    login:false
};

const formsAddProfileSlice = createSlice({
    name: 'formsAddProfile',
    initialState,
    reducers: {
        addName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        addSiteUrl: (state, action: PayloadAction<string>) => {
            state.url = action.payload;
        },
        addActivity: (state, action: PayloadAction<string>) => {
            state.activity_hobbies = action.payload;
        },
        addHash: (state, action: PayloadAction<string>) => {
            state.hashtags = action.payload;
        },
        addGeo: (state, action: PayloadAction<Feature | null>) => {
            state.coordinates = action.payload;
        },
        addMlm: (state, action: PayloadAction<string>) => {
            state.mlm = action.payload;
        },
        addMarketPercent: (state, action: PayloadAction<string>) => {
            state.marketingPercent = action.payload;
        },
        addIncognito: (state, action: PayloadAction<boolean>) => {
            state.is_incognito = action.payload;
        },
        addLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        addTab: (state, action: PayloadAction<number>) => {
            state.tab = action.payload;
        },
        addLogo: (state, action: PayloadAction<string>) => {
            state.logoLink = action.payload;
        },
        addBanner: (state, action: PayloadAction<string>) => {
            state.bannerLink = action.payload;
        },
        addInputGeo: (state, action: PayloadAction<string>) => {
            state.inputGeo = action.payload;
        },
        addNumberWallet: (state, action: PayloadAction<string>) => {
            state.wallet_number = action.payload;
        },
        changeStateLogIn: (state, action: PayloadAction<boolean>) => {
            state.login = action.payload;
        },
        updateField: <K extends keyof FormsAddProfileSchema>(
            state: FormsAddProfileSchema,
            action: PayloadAction<{ name: K; value: FormsAddProfileSchema[K] }>
        ) => {
            const { name, value } = action.payload;
            if (Object.hasOwn(state, name)) {
                state[name] = value;
            } else {
                console.warn(`Key "${name}" does not exist in state.`);
            }
        },
    },
});

export default formsAddProfileSlice.reducer;
export const { actions: formsAddProfileActions } = formsAddProfileSlice;
