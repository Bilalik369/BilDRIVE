import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const driverApi = createApi({
  reducerPath: "driverApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/driver",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["DriverStats", "RideRequests", "RideDetails", "Earnings", "Profile", "Availability"],
  endpoints: (builder) => ({
    // Dashboard endpoints
    getDriverStats: builder.query({
      query: (driverId) => `/stats/${driverId}`,
      providesTags: ["DriverStats"],
    }),
    getActiveRide: builder.query({
      query: (driverId) => `/active-ride/${driverId}`,
      providesTags: ["RideDetails"],
    }),
    getRecentRides: builder.query({
      query: ({ driverId, limit = 5 }) => `/recent-rides/${driverId}?limit=${limit}`,
      providesTags: ["RideDetails"],
    }),
    updateAvailability: builder.mutation({
      query: ({ driverId, isAvailable }) => ({
        url: `/availability/${driverId}`,
        method: "PATCH",
        body: { isAvailable },
      }),
      invalidatesTags: ["DriverStats", "Availability"],
    }),

    // Ride Requests endpoints
    getRideRequests: builder.query({
      query: ({ driverId, ...filters }) => {
        const params = new URLSearchParams(filters).toString()
        return `/ride-requests/${driverId}?${params}`
      },
      providesTags: ["RideRequests"],
    }),
    acceptRide: builder.mutation({
      query: ({ rideId, driverId }) => ({
        url: `/ride-requests/${rideId}/accept`,
        method: "POST",
        body: { driverId },
      }),
      invalidatesTags: ["RideRequests", "RideDetails", "DriverStats"],
    }),
    declineRide: builder.mutation({
      query: ({ rideId, reason }) => ({
        url: `/ride-requests/${rideId}/decline`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["RideRequests"],
    }),

    // Ride Details endpoints
    getRideDetails: builder.query({
      query: (rideId) => `/rides/${rideId}`,
      providesTags: (result, error, rideId) => [{ type: "RideDetails", id: rideId }],
    }),
    updateRideStatus: builder.mutation({
      query: ({ rideId, status, driverId, location }) => ({
        url: `/rides/${rideId}/status`,
        method: "PATCH",
        body: { status, driverId, location },
      }),
      invalidatesTags: (result, error, { rideId }) => [{ type: "RideDetails", id: rideId }, "DriverStats"],
    }),
    cancelRide: builder.mutation({
      query: ({ rideId, reason, cancelledBy }) => ({
        url: `/rides/${rideId}/cancel`,
        method: "POST",
        body: { reason, cancelledBy },
      }),
      invalidatesTags: (result, error, { rideId }) => [{ type: "RideDetails", id: rideId }, "DriverStats"],
    }),

    // Earnings endpoints
    getEarnings: builder.query({
      query: ({ driverId, period, ...filters }) => {
        const params = new URLSearchParams({ period, ...filters }).toString()
        return `/earnings/${driverId}?${params}`
      },
      providesTags: ["Earnings"],
    }),
    getEarningsStats: builder.query({
      query: ({ driverId, period }) => `/earnings/${driverId}/stats?period=${period}`,
      providesTags: ["Earnings"],
    }),
    requestPayout: builder.mutation({
      query: ({ driverId, amount }) => ({
        url: `/earnings/${driverId}/payout`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Earnings"],
    }),

    // Profile endpoints
    getDriverProfile: builder.query({
      query: (driverId) => `/profile/${driverId}`,
      providesTags: ["Profile"],
    }),
    updateDriverProfile: builder.mutation({
      query: ({ driverId, ...profileData }) => ({
        url: `/profile/${driverId}`,
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateVehicle: builder.mutation({
      query: ({ driverId, ...vehicleData }) => ({
        url: `/profile/${driverId}/vehicle`,
        method: "PATCH",
        body: vehicleData,
      }),
      invalidatesTags: ["Profile"],
    }),
    uploadDocument: builder.mutation({
      query: (formData) => ({
        url: "/profile/documents",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Availability endpoints
    getAvailabilityStatus: builder.query({
      query: (driverId) => `/availability/${driverId}`,
      providesTags: ["Availability"],
    }),
    getAvailabilityStats: builder.query({
      query: (driverId) => `/availability/${driverId}/stats`,
      providesTags: ["Availability"],
    }),
    setAvailabilitySchedule: builder.mutation({
      query: ({ driverId, schedule }) => ({
        url: `/availability/${driverId}/schedule`,
        method: "POST",
        body: { schedule },
      }),
      invalidatesTags: ["Availability"],
    }),
  }),
})

export const {
  // Dashboard hooks
  useGetDriverStatsQuery,
  useGetActiveRideQuery,
  useGetRecentRidesQuery,
  useUpdateAvailabilityMutation,

  // Ride Requests hooks
  useGetRideRequestsQuery,
  useAcceptRideMutation,
  useDeclineRideMutation,

  // Ride Details hooks
  useGetRideDetailsQuery,
  useUpdateRideStatusMutation,
  useCancelRideMutation,

  // Earnings hooks
  useGetEarningsQuery,
  useGetEarningsStatsQuery,
  useRequestPayoutMutation,

  // Profile hooks
  useGetDriverProfileQuery,
  useUpdateDriverProfileMutation,
  useUpdateVehicleMutation,
  useUploadDocumentMutation,

  // Availability hooks
  useGetAvailabilityStatusQuery,
  useGetAvailabilityStatsQuery,
  useSetAvailabilityScheduleMutation,
} = driverApi
