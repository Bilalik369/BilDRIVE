import { useSelector, useDispatch } from "react-redux"
import { requestRide, cancelRide, rateRide, getUserRides } from "../redux/slices/rideSlice"

export const useRide = () => {
  const dispatch = useDispatch()
  const { currentRide, rides, loading, error, rideStatus, pagination } = useSelector((state) => state.ride)

  const handleRequestRide = async (rideData) => {
    try {
      const result = await dispatch(requestRide(rideData)).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }

  const handleCancelRide = async (rideId, reason) => {
    try {
      const result = await dispatch(cancelRide({ rideId, reason })).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }

  const handleRateRide = async (rideId, rating, comment) => {
    try {
      const result = await dispatch(rateRide({ rideId, rating, comment })).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }

  const handleGetUserRides = async (params = {}) => {
    try {
      const result = await dispatch(getUserRides(params)).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }

  return {
    currentRide,
    rides,
    loading,
    error,
    rideStatus,
    pagination,
    requestRide: handleRequestRide,
    cancelRide: handleCancelRide,
    rateRide: handleRateRide,
    getUserRides: handleGetUserRides,
  }
}
