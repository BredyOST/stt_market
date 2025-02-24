import { Language, LanguageSchema } from './languageShema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: LanguageSchema = {
    currentLanguage: Language.RU,
};

const languageSlice = createSlice({
    initialState,
    name: 'language',
    reducers: {
        changeLanguage: (state, action: PayloadAction<Language>) => {
            state.currentLanguage = action.payload;
        },
    },
});

export default languageSlice.reducer;
export const { actions: languageActions } = languageSlice;
