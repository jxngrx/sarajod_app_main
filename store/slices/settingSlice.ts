// redux/slices/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    language: 'en' as 'en' | 'hinglish'
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLanguage(state, action) {
            state.language = action.payload;
        }
    }
});

export const { setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
