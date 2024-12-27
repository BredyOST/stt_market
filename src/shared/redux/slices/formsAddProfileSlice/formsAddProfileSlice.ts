import { FormsAddProfileSchema } from './formsAddProfileSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FormsAddProfileSchema = {
    name: '',
    url: '',
    activity_hobbies: '',
    hashtags: '',
    logo: '',
    banner: '',
    geolocation: [],
    language: '',
    mlm: '35',
    marketingPercent: '',
    is_incognito: true,
    inputGeo: '',
    tab: 2.1,
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
        addGeo: (state, action: PayloadAction<string[]>) => {
            state.geolocation = action.payload;
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
            state.logo = action.payload;
        },
        addBanner: (state, action: PayloadAction<string>) => {
            state.banner = action.payload;
        },
        addInputGeo: (state, action: PayloadAction<string>) => {
            state.inputGeo = action.payload;
        },
        updateField: <K extends keyof FormsAddProfileSchema>(
            state: FormsAddProfileSchema,
            action: PayloadAction<{ name: K; value: FormsAddProfileSchema[K] }>
        ) => {
            state[action.payload.name] = action.payload.value;
        },
    },
});

export default formsAddProfileSlice.reducer;
export const { actions: formsAddProfileActions } = formsAddProfileSlice;
