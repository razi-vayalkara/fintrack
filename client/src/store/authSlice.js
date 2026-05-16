import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

const storedToken = localStorage.getItem("finance_token");
const storedUser = localStorage.getItem("finance_user");

const parseUser = () => {
  try {
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const persistSession = ({ token, user }) => {
  localStorage.setItem("finance_token", token);
  localStorage.setItem("finance_user", JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem("finance_token");
  localStorage.removeItem("finance_user");
};

const errorMessage = (error) => error.response?.data?.message || error.message;

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", credentials);
    persistSession(data);
    return data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data);
    return data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    localStorage.setItem("finance_user", JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    clearSession();
    return rejectWithValue(errorMessage(error));
  }
});

export const updateSettings = createAsyncThunk(
  "auth/updateSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const { data } = await api.patch("/auth/settings", settings);
      localStorage.setItem("finance_user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const { data } = await api.patch("/auth/password", passwords);
      return data.message;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete("/auth/account");
      clearSession();
      return data.message;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken,
    user: parseUser(),
    status: "idle",
    error: null
  },
  reducers: {
    logout: (state) => {
      clearSession();
      state.token = null;
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.token = null;
        state.user = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.error = null;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
