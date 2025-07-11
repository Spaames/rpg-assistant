import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from "@/redux/store";
import { User } from "@/utils/types";

interface AuthState {
    isAuthenticated: boolean;
    user: User;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    isAuthenticated: false,
    user: {username: ""},
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        startThunk(state) {
            state.loading = true;
            state.error = null;
        },
        failureThunk(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        loginSuccess(state, action: PayloadAction<string>) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user.username = action.payload;
            state.error = null;
        },
    },
});

export const {
    startThunk, failureThunk,
    loginSuccess,
} = authSlice.actions;

// API THUNK OPERATIONS :

//login with username and password, api call and dispatch actions
export const loginThunk = (username: string, password: string): AppThunk => async (dispatch) => {
    dispatch(startThunk());
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(loginSuccess(data.username));
        } else {
            dispatch(failureThunk(data.message));
        }
    } catch (error) {
        console.log(error);
        dispatch(failureThunk("Error occurred while logging in : try/catch thunk"));
    }
}

export default authSlice.reducer;