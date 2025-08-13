import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { rideApi } from "../api/rideApi"


export const getDriverRides = createAsyncThunk(
  "driver/getRides",
  async ({ status, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await rideApi.getDriverRides({ status, page, limit })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get driver rides")
    }
  },
)

export const acceptRide = createAsyncThunk("driver/acceptRide", async (rideId, { rejectWithValue }) => {
  try {
    const response = await rideApi.acceptRide(rideId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to accept ride")
  }
})

export const arrivedAtPickup = createAsyncThunk("driver/arrivedAtPickup", async (rideId, { rejectWithValue }) => {
  try {
    const response = await rideApi.arrivedAtPickup(rideId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update arrival status")
  }
})

export const startRide = createAsyncThunk("driver/startRide", async (rideId, { rejectWithValue }) => {
  try {
    const response = await rideApi.startRide(rideId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to start ride")
  }
})

export const completeRide = createAsyncThunk("driver/completeRide", async (rideId, { rejectWithValue }) => {
  try {
    const response = await rideApi.completeRide(rideId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to complete ride")
  }
})

const initialState = {
  rides: [],
  currentRide: null,
  isOnline: false,
  loading: false,
  error: null,
  earnings: {
    today: 0,
    week: 0,
    month: 0,
  },
  stats: {
    totalRides: 0,
    rating: 0,
    completionRate: 0,
  },
  pagination: {
    total: 0,
    page: 1,
    pages: 0,
    limit: 10,
  },
}

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    toggleOnlineStatus: (state) => {
      state.isOnline = !state.isOnline
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload
    },
    setCurrentRide: (state, action) => {
      state.currentRide = action.payload
    },
    clearCurrentRide: (state) => {
      state.currentRide = null
    },
    updateEarnings: (state, action) => {
      state.earnings = { ...state.earnings, ...action.payload }
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
   
      .addCase(getDriverRides.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDriverRides.fulfilled, (state, action) => {
        state.loading = false
        state.rides = action.payload.rides
        state.pagination = action.payload.pagination
      })
      .addCase(getDriverRides.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
     
      .addCase(acceptRide.fulfilled, (state, action) => {
        state.currentRide = action.payload.ride
      })
  
      .addCase(arrivedAtPickup.fulfilled, (state, action) => {
        state.currentRide = action.payload.ride
      })
      
      .addCase(startRide.fulfilled, (state, action) => {
        state.currentRide = action.payload.ride
      })
     
      .addCase(completeRide.fulfilled, (state, action) => {
        state.currentRide = null
        
        const completedRide = action.payload.ride
        state.earnings.today += completedRide.price.total * 0.8 
        state.stats.totalRides += 1
      })
  },
})

export const {
  clearError,
  toggleOnlineStatus,
  setOnlineStatus,
  setCurrentRide,
  clearCurrentRide,
  updateEarnings,
  updateStats,
} = driverSlice.actions

export default driverSlice.reducer
