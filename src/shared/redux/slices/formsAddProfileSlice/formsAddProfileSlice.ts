import { coordinates, Feature, FormsAddProfileSchema } from './formsAddProfileSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FormsAddProfileSchema = {
    name: '',
    url: '',
    activity_hobbies: '',
    hashtags: '',
    logoLink: '',
    bannerLink: '',
    coordinates: null,
    language: '',
    is_in_mlm: '35',
    marketingPercent: '',
    is_incognito: true,
    inputGeo: '',
    tab: 2.1,
    wallet_number: '',
    login: false,
    showImageInModalWindow: false,
    showVideoInModalWindowButton: false,
};

const formsAddProfileSlice = createSlice({
    name: 'formsAddProfile',
    initialState,
    reducers: {
        addGeo: (state, action: PayloadAction<coordinates[] | null>) => {
            state.coordinates = action.payload;
        },
        addMlm: (state, action: PayloadAction<string>) => {
            state.is_in_mlm = action.payload;
        },

        addIncognito: (state, action: PayloadAction<boolean>) => {
            state.is_incognito = action.payload;
        },
        addLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
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

        changeAddProfileState: <K extends keyof FormsAddProfileSchema>(
            state: FormsAddProfileSchema,
            action: PayloadAction<{ key: K; value: FormsAddProfileSchema[K] }>
        ) => {
            const { key, value } = action.payload;
            state[key] = value;
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
