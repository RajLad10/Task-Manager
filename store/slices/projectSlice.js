import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/projects`, {
        withCredentials: true,
      });
      return res.data.projects;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async ({ payload }, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/projects`, payload, {
        withCredentials: true,
      });
      return { id: res.data.id, ...res.data.project };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const projectSlice = createSlice({
    name: "projects",
    initialState: {
    items: [],
    loading: false,
  },
    reducers:{},
    extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchProjects.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(createProject.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });
  },
})

export default projectSlice.reducer