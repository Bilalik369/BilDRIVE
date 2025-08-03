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