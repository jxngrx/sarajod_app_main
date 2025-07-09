import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import apiService from '@/hooks/useApi';
import { Staff, User } from '@/interface/userInterface';
import { RootState } from '@/store';

type UserState = {
    user: User | null;
    loading: boolean;
    error: string | null;
    profileSelected: number;
    transactions: {
        success: boolean;
        count: number;
        data: any[];
    };
    staff: {
        loading: boolean;
        data: Staff[];
        error: string | null;
    };
};

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
    profileSelected: 0,
    transactions: {
        success: false,
        count: 0,
        data: []
    },
    staff: {
        loading: false,
        data: [],
        error: null
    }
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

export const fetchAllTransactions = createAsyncThunk(
    'user/fetchAllTransactions',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const user = state.user.user;
            const index = state.user.profileSelected;
            const profile = user?.profile?.[index] || null;
            const res = await apiService.getAllTransaction(profile?._id);
            return res.data;
        } catch (error: any) {
            console.log(error);
            return rejectWithValue(
                error.message || 'Failed to fetch transactions'
            );
        }
    }
);

export const fetchAllStaff = createAsyncThunk(
    'user/fetchAllStaff',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const user = state.user.user;
            const index = state.user.profileSelected;
            const profile = user?.profile?.[index] || null;
            console.log(profile?._id, 'FETCHING THE STAFF FOR');
            const res = await apiService.getAllStaff(profile?._id);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch staff');
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
            })
            .addCase(fetchAllTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchAllTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAllStaff.pending, (state) => {
                state.staff.loading = true;
                state.staff.error = null;
            })
            .addCase(fetchAllStaff.fulfilled, (state, action) => {
                state.staff.loading = false;
                state.staff.data = action.payload;
            })
            .addCase(fetchAllStaff.rejected, (state, action) => {
                state.staff.loading = false;
                state.staff.error = action.payload as string;
            });
    }
});

// ───────────────────────────────────────────────────────────
// Selectors
// ───────────────────────────────────────────────────────────

export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectTransactions = (state: RootState) => state.user.transactions;
export const selectStaff = (state: RootState) => state.user.staff;
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
