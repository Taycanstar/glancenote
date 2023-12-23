import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
  data?: {
    email: string;
    firstName?: string;
    lastName?: string;
  } | null;
  status: "idle" | "loading" | "success" | "error";
  isLoggedIn: boolean;
  error?: string | null;
}

const isBrowser = typeof window !== "undefined";
const token = isBrowser ? localStorage.getItem("token") : null;
const userEmail = isBrowser ? localStorage.getItem("userEmail") : null;

const initialState: UserState = {
  data: token && userEmail ? { email: userEmail } : null,
  status: "idle",
  error: null,
  isLoggedIn: !!token,
};
const url = "http://127.0.0.1:8000";

export const addInfo = createAsyncThunk(
  "user/add-info",
  async (
    userData: {
      email: string;
      firstName?: string;
      lastName?: string;
      studentId: string;
      phoneNumber: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${url}/api/add-parent-info/`, userData);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const confirmEmail = createAsyncThunk(
  "user/confirm-parent-email",
  async (
    userData: {
      confirmationToken: string;
      email: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${url}/confirm-parent-email/`,
        userData
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user login
export const login = createAsyncThunk(
  "user/login",
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${url}/api/login/`, userData);
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data && response.data.user) {
        localStorage.setItem("userEmail", response.data.user);
      }
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // Ensure the error format here matches what your Django backend sends
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user login without a password
export const loginWithoutPassword = createAsyncThunk(
  "api/loginWithoutPassword",
  async (userData: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/api/login-without-password/`,
        userData
      );

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data && response.data.user) {
        localStorage.setItem("userEmail", response.data.user);
      }
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null; // No token found
  }

  try {
    const response = await axios.get(`${url}/api/user-data/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Reducer to handle logout
    setUser(state, action) {
      state.data = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.data = null;
      state.status = "idle";
      state.error = null;
      state.isLoggedIn = false;

      // Remove the token from local storage
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
        state.isLoggedIn = true; // Set the logged-in status to true
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })
      .addCase(loginWithoutPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithoutPassword.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
        state.isLoggedIn = true; // Set the logged-in status to true
        state.error = null;
      })
      .addCase(loginWithoutPassword.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
