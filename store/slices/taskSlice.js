import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchTasks = createAsyncThunk(
    "tasks/fetch",
    async ({ projectId }, thunkAPI) => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/tasks?projectId=${projectId}`,
                { withCredentials: true }
            );
            return res.data.tasks;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const createTask = createAsyncThunk(
    "tasks/create",
    async ({ payload }, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/tasks`, payload, {
                withCredentials: true,
            });
            return { id: res.data.id, ...res.data.task };
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const updateTaskStatus = createAsyncThunk(
    "tasks/updateStatus",
    async ({ taskId, status }, thunkAPI) => {
        try {
            const res = await axios.put(
                `${BASE_URL}/api/tasks`,
                { taskId, status },
                { withCredentials: true }
            );
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const deleteTask = createAsyncThunk(
    "tasks/delete",
    async ({ taskId }, thunkAPI) => {
        try {
            await axios.delete(`${BASE_URL}/api/tasks?taskId=${taskId}`, {
                withCredentials: true,
            });
            return { id: taskId };
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

const taskSlice = createSlice({
    name: "tasks",
    initialState: {
        items: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTasks.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(createTask.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx].status = action.payload.status;
    });

    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload.id);
    });
  },
})

export default taskSlice.reducer;