import axios from "axios"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-bildrive-fmebbghucmhnemes.francecentral-01.azurewebsites.net/api"


const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })




  api.interceptors.request.use((config)=> {
    const token = localStorage.getItem("token")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })


  export const rideApi = {
    // Passenger 
    requestRide: (rideData) => api.post("/rides", rideData),
    getUserRides: (params) => api.get("/rides/user", { params }),
    cancelRide: (rideId, reason) => api.post(`/rides/${rideId}/cancel`, { reason }),
    rateRide: (rideId, rating, comment) => api.post(`/rides/${rideId}/rate`, { rating, comment }),
    getRideById: (rideId) => api.get(`/rides/${rideId}`),
  
    // Driver 
    acceptRide: (rideId) => api.post(`/rides/${rideId}/accept`),
    arrivedAtPickup: (rideId) => api.post(`/rides/${rideId}/arrived`),
    startRide: (rideId) => api.post(`/rides/${rideId}/start`),
    completeRide: (rideId) => api.post(`/rides/${rideId}/complete`),
    getDriverRides: (params) => api.get("/rides/driver", { params }),
  }



