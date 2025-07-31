import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import rideSlice from "./slices/rideSlice"
import uiSlice from "./slices/uiSlice"
import driverSlice from "./slices/driverSlice"
import { ReturnType } from "react"

export const store = configureStore({
  reducer: {
    auth: authSlice,
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

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
