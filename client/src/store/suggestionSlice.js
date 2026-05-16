import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchSuggestions = createAsyncThunk(
  "suggestions/fetchSuggestions",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/suggestions", { params: { q: query } });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const saveSuggestion = createAsyncThunk(
  "suggestions/saveSuggestion",
  async (text, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/suggestions", { text });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const suggestionSlice = createSlice({
  name: "suggestions",
  initialState: {
    items: [],
    loading: false
  },
  reducers: {
    clearSuggestions: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { clearSuggestions } = suggestionSlice.actions;
export default suggestionSlice.reducer;
