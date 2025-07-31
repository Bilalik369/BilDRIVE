import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  theme: "light",
  sidebarOpen: false,
  loading: false,
  notifications: [],
  modals: {
    rideRequest: false,
    profile: false,
    settings: false,
  },
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light"
      localStorage.setItem("theme", state.theme)
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem("theme", state.theme)
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload)
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false
    },
  },
})

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  addNotification,
  removeNotification,
  openModal,
  closeModal,
} = uiSlice.actions

export default uiSlice.reducer
