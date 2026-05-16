import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

const errorMessage = (error) => error.response?.data?.message || error.message;

export const fetchLockers = createAsyncThunk("lockers/fetchLockers", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/lockers");
    return data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const fetchLockerSummary = createAsyncThunk(
  "lockers/fetchLockerSummary",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/lockers/summary");
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const createLocker = createAsyncThunk(
  "lockers/createLocker",
  async (locker, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post("/lockers", locker);
      dispatch(fetchLockerSummary());
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const updateLocker = createAsyncThunk(
  "lockers/updateLocker",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/lockers/${id}`, updates);
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const deleteLocker = createAsyncThunk(
  "lockers/deleteLocker",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/lockers/${id}`);
      dispatch(fetchLockerSummary());
      return id;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const moveLockerAmount = createAsyncThunk(
  "lockers/moveLockerAmount",
  async ({ id, movement }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post(`/lockers/${id}/move`, movement);
      dispatch(fetchLockerSummary());
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

const lockerSlice = createSlice({
  name: "lockers",
  initialState: {
    items: [],
    summary: {
      total: 0,
      count: 0,
      credit: 0,
      debit: 0,
      breakdown: []
    },
    status: "idle",
    error: null
  },
  reducers: {
    clearLockers: (state) => {
      state.items = [];
      state.summary = { total: 0, count: 0, credit: 0, debit: 0, breakdown: [] };
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLockers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLockers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchLockers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchLockerSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(createLocker.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateLocker.fulfilled, (state, action) => {
        state.items = state.items.map((locker) =>
          locker._id === action.payload._id ? action.payload : locker
        );
      })
      .addCase(deleteLocker.fulfilled, (state, action) => {
        state.items = state.items.filter((locker) => locker._id !== action.payload);
      })
      .addCase(moveLockerAmount.fulfilled, (state, action) => {
        state.items = state.items.map((locker) =>
          locker._id === action.payload._id ? action.payload : locker
        );
      });
  }
});

export const { clearLockers } = lockerSlice.actions;
export default lockerSlice.reducer;
