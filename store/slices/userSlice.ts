import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import apiService from '@/hooks/useApi';
import { User } from '@/interface/userInterface';
import { RootState } from '@/store';

type UserState = {
    user: User | null;
    loading: boolean;
    error: string | null;
    profileSelected: number; // stores index of selected profile
};

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
    profileSelected: 0
};

// ───────────────────────────────────────────────────────────
// Async Thunks
// ───────────────────────────────────────────────────────────

export const fetchUserDetails = createAsyncThunk(
    'user/fetchUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiService.getUserDetails();
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch');
        }
    }
);

export const createUserProfile = createAsyncThunk(
    'user/createUserProfile',
    async (
        profileData: { profileName: string; profileNumber: string },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const res = await apiService.createProfile(profileData);
            if (res.status === 201) {
                dispatch(fetchUserDetails()); // Refresh data after creation
                return res.data;
            } else {
                return rejectWithValue(res.data.message);
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create profile');
        }
    }
);

// ───────────────────────────────────────────────────────────
// Slice Definition
// ───────────────────────────────────────────────────────────

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfileSelected: (state, action: PayloadAction<number>) => {
            state.profileSelected = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            state.profileSelected = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;

                const hasProfiles =
                    Array.isArray(action.payload?.profile) &&
                    action.payload.profile.length > 0;

                // Set default profileSelected only if not already chosen
                if (
                    hasProfiles &&
                    (state.profileSelected === null ||
                        typeof state.profileSelected !== 'number')
                ) {
                    state.profileSelected = 0;
                }
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

// ───────────────────────────────────────────────────────────
// Selectors
// ───────────────────────────────────────────────────────────

export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectProfileSelected = (state: RootState) =>
    state.user.profileSelected;
export const selectCurrentProfile = (state: RootState) => {
    const user = state.user.user;
    const index = state.user.profileSelected;
    return user?.profile?.[index] || null;
};

// ───────────────────────────────────────────────────────────
// Exports
// ───────────────────────────────────────────────────────────

export const { setProfileSelected, clearUser } = userSlice.actions;
export default userSlice.reducer;
