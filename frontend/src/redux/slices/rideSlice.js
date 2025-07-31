import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { rideApi } from "../api/rideApi"

// Async thunks
export const requestRide = createAsyncThunk("ride/request", async (rideData, { rejectWithValue }) => {
  try {
    const response = await rideApi.requestRide(rideData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to request ride")
  }
})

export const getUserRides = createAsyncThunk(
  "ride/getUserRides",
  async ({ status, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await rideApi.getUserRides({ status, page, limit })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get rides")
    }
  },
)

export const cancelRide = createAsyncThunk("ride/cancel", async ({ rideId, reason }, { rejectWithValue }) => {
  try {
    const response = await rideApi.cancelRide(rideId, reason)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to cancel ride")
  }
})

export const rateRide = createAsyncThunk("ride/rate", async ({ rideId, rating, comment }, { rejectWithValue }) => {
  try {
    const response = await rideApi.rateRide(rideId, rating, comment)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to rate ride")
  }
})

const initialState = {
  currentRide: null,
  rides: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 0,
    limit: 10,
  },
  rideStatus: null, // 'searching', 'accepted', 'arrived', 'inProgress', 'completed', 'cancelled'
}

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentRide: (state, action) => {
      state.currentRide = action.payload
    },
    updateRideStatus: (state, action) => {
      state.rideStatus = action.payload
      if (state.currentRide) {
        state.currentRide.status = action.payload
      }
    },
    clearCurrentRide: (state) => {
      state.currentRide = null
      state.rideStatus = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Request ride
      .addCase(requestRide.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(requestRide.fulfilled, (state, action) => {
        state.loading = false
        state.currentRide = action.payload.ride
        state.rideStatus = action.payload.ride.status
      })
      .addCase(requestRide.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get user rides
      .addCase(getUserRides.fulfilled, (state, action) => {
        state.rides = action.payload.rides
        state.pagination = action.payload.pagination
      })
      // Cancel ride
      .addCase(cancelRide.fulfilled, (state, action) => {
        state.currentRide = action.payload.ride
        state.rideStatus = "cancelled"
      })
      // Rate ride
      .addCase(rateRide.fulfilled, (state, action) => {
        const rideIndex = state.rides.findIndex((ride) => ride._id === action.payload.ride._id)
        if (rideIndex !== -1) {
          state.rides[rideIndex] = action.payload.ride
        }
      })
  },
})

export const { clearError, setCurrentRide, updateRideStatus, clearCurrentRide } = rideSlice.actions
export default rideSlice.reducer
