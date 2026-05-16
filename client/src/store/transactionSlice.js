import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSuggestions, saveSuggestion } from "./suggestionSlice";
import api from "../utils/api";

const currentMonth = new Date().toISOString().slice(0, 7);

const toastError = (error) => error.response?.data?.message || error.message;

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState().transactions;
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => Boolean(value))
      );
      const { data } = await api.get("/transactions", { params });
      return data;
    } catch (error) {
      return rejectWithValue(toastError(error));
    }
  }
);

export const fetchSummary = createAsyncThunk(
  "transactions/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/transactions/summary");
      return data;
    } catch (error) {
      return rejectWithValue(toastError(error));
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post("/transactions", transaction);
      await dispatch(saveSuggestion(transaction.reason));
      dispatch(fetchSuggestions(transaction.reason));
      dispatch(fetchSummary());
      return data;
    } catch (error) {
      return rejectWithValue(toastError(error));
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/transactions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue({ id, message: toastError(error) });
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, updates }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/transactions/${id}`, updates);
      if (updates.reason) dispatch(saveSuggestion(updates.reason));
      dispatch(fetchSummary());
      return data;
    } catch (error) {
      return rejectWithValue(toastError(error));
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
    summary: [],
    status: "idle",
    error: null,
    filters: {
      month: currentMonth,
      type: "",
      category: ""
    },
    deletedBackup: null
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTransactions: (state) => {
      state.items = [];
      state.summary = [];
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(deleteTransaction.pending, (state, action) => {
        const id = action.meta.arg;
        state.deletedBackup = state.items.find((item) => item._id === id) || null;
        state.items = state.items.filter((item) => item._id !== id);
      })
      .addCase(deleteTransaction.fulfilled, (state) => {
        state.deletedBackup = null;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        if (state.deletedBackup) state.items.unshift(state.deletedBackup);
        state.deletedBackup = null;
        state.error = action.payload?.message || "Delete failed";
      });
  }
});

export const { clearTransactions, setFilter, setFilters } = transactionSlice.actions;
export default transactionSlice.reducer;
