import { configureStore } from "@reduxjs/toolkit"
import rideSlice from "./slices/rideSlice"
import authReducer from "./slices/authSlice"
import driverSlice from "./slices/driverSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ride: rideSlice,
    driver: driverSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})



