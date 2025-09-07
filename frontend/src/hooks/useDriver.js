import { useSelector, useDispatch } from "react-redux"
import {
  clearError,
  toggleOnlineStatus,
  setOnlineStatus,
  setAvailabilityStatus,
  setCurrentLocation,
  updateEarnings,
  updateStats,
  updateProfile,
  updateVehicle,
  setLoading,
  setUpdatingAvailability,
  setUpdatingLocation,
  resetDriverState,
} from "../redux/slices/driverSlice"

export const useDriver = () => {
  const dispatch = useDispatch()
  const {
    isOnline,
    isAvailable,
    earnings,
    stats,
    profile,
    currentLocation,
    loading,
    updatingAvailability,
    updatingLocation,
    error,
  } = useSelector((state) => state.driver)

  // Availability actions
  const handleToggleOnlineStatus = () => {
    dispatch(toggleOnlineStatus())
  }

  const handleSetOnlineStatus = (status) => {
    dispatch(setOnlineStatus(status))
  }

  const handleSetAvailabilityStatus = (status) => {
    dispatch(setAvailabilityStatus(status))
  }

  // Location actions
  const handleSetCurrentLocation = (location) => {
    dispatch(setCurrentLocation(location))
  }

  // Stats actions
  const handleUpdateEarnings = (earningsData) => {
    dispatch(updateEarnings(earningsData))
  }

  const handleUpdateStats = (statsData) => {
    dispatch(updateStats(statsData))
  }

  // Profile actions
  const handleUpdateProfile = (profileData) => {
    dispatch(updateProfile(profileData))
  }

  const handleUpdateVehicle = (vehicleData) => {
    dispatch(updateVehicle(vehicleData))
  }

  // Loading actions
  const handleSetLoading = (loading) => {
    dispatch(setLoading(loading))
  }

  const handleSetUpdatingAvailability = (updating) => {
    dispatch(setUpdatingAvailability(updating))
  }

  const handleSetUpdatingLocation = (updating) => {
    dispatch(setUpdatingLocation(updating))
  }

  // Error handling
  const handleClearError = () => {
    dispatch(clearError())
  }

  // Reset state
  const handleResetDriverState = () => {
    dispatch(resetDriverState())
  }

  return {
    // State
    isOnline,
    isAvailable,
    earnings,
    stats,
    profile,
    currentLocation,
    loading,
    updatingAvailability,
    updatingLocation,
    error,

    // Actions
    toggleOnlineStatus: handleToggleOnlineStatus,
    setOnlineStatus: handleSetOnlineStatus,
    setAvailabilityStatus: handleSetAvailabilityStatus,
    setCurrentLocation: handleSetCurrentLocation,
    updateEarnings: handleUpdateEarnings,
    updateStats: handleUpdateStats,
    updateProfile: handleUpdateProfile,
    updateVehicle: handleUpdateVehicle,
    setLoading: handleSetLoading,
    setUpdatingAvailability: handleSetUpdatingAvailability,
    setUpdatingLocation: handleSetUpdatingLocation,
    clearError: handleClearError,
    resetDriverState: handleResetDriverState,
  }
}
