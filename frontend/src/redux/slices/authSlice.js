import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authApi } from "../api/authApi"


export const loginUser = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await authApi.login(email, password)
    localStorage.setItem("token", response.data.token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed")
  }
})

export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await authApi.register(userData)
  
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed")
  }
})

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getCurrentUser()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to get user")
  }
})

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async (token, { rejectWithValue }) => {
  try {
    const response = await authApi.verifyEmail(token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Email verification failed")
  }
})

export const resendVerificationEmail = createAsyncThunk("auth/resendVerification", async (email, { rejectWithValue }) => {
  try {
    const response = await authApi.resendVerification(email)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to resend verification email")
  }
})

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    const response = await authApi.forgotPassword(email)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to send reset instructions")
  }
})

export const socialLogin = createAsyncThunk("auth/socialLogin", async ({ provider, token }, { rejectWithValue }) => {
  try {
    const response = await authApi.socialLogin(provider, token)
    localStorage.setItem("token", response.data.token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Social login failed")
  }
})

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: false,
  error: null,
  isEmailVerified: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isEmailVerified = false
      localStorage.removeItem("token")
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isEmailVerified = action.payload.user?.isVerified || false
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.isEmailVerified = action.payload.user?.isVerified || false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isEmailVerified = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
   
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.isAuthenticated = true
        state.isEmailVerified = action.payload.user?.isVerified || false
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isEmailVerified = true
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
       
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
       
      })
   
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.isEmailVerified = true
      })
  },
})

export const { clearError, logout, setCredentials } = authSlice.actions
export default authSlice.reducer
