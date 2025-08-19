import { configureStore } from "@reduxjs/toolkit"
import rideSlice from "./slices/rideSlice"
import authReducer from "./slices/authSlice"
import driverSlice from "./slices/driverSlice"
import uiSlice from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ride: rideSlice,
    ui: uiSlice,
    driver: driverSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})



