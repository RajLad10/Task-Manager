import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const registerUser = createAsyncThunk("auth/register",
    async ({ payload, cb }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/register`, payload);
            if (response.status === 200) {
                cb();
            }
            return response.data;
        }
        catch (error) {
            console.log("registerUser error", error);
            return thunkAPI.rejectWithValue(
                error?.response?.data || { error: "Registration failed" }
            );
        }
    });

export const loginUser = createAsyncThunk("auth/login",
    async ({ payload, cb }, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, payload);
            if (response.status === 200) {
                cb();
            }
            return response.data;
        }
        catch (error) {
            console.log("loginUser error", error);
            return thunkAPI.rejectWithValue(
                error?.response?.data || { error: "Login failed" }
            );
        }
    });

export const logoutUser = createAsyncThunk("auth/logout",
    async ({ cb }, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/logout`);
            if (response.status === 200) {
                cb();
            }
            return response.data;
        }
        catch (error) {
            console.log("logoutUser error", error);
            return thunkAPI.rejectWithValue(
                error?.response?.data || { error: "Logout failed" }
            );
        }
    });

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuth: false,
        user: {},
        authLoading: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.authLoading = false;
        });
        builder.addCase(registerUser.pending, (state) => {
            state.authLoading = true;
        });
        builder.addCase(registerUser.rejected, (state) => {
            state.authLoading = false;
        });

        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isAuth = true;
            state.user = action.payload.user;
            state.authLoading = false;
        });
        builder.addCase(loginUser.pending, (state) => {
            state.authLoading = true;
        });
        builder.addCase(loginUser.rejected, (state) => {
            state.isAuth = false;
            state.authLoading = false;
        });

        builder.addCase(logoutUser.fulfilled, (state, action) => {
            state.isAuth = false;
            state.user = {};
            state.authLoading = false;
        });
        builder.addCase(logoutUser.pending, (state) => {
            state.authLoading = true;
        });
        builder.addCase(logoutUser.rejected, (state) => {
            state.isAuth = false;
            state.authLoading = false;
        });
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
