import axios from "axios"
import { toast } from "react-hot-toast"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp
    config.metadata = { startTime: new Date() }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime
    console.log(`API Request to ${response.config.url} took ${duration}ms`)

    return response
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token")
          window.location.href = "/auth/login"
          toast.error("Session expired. Please login again.")
          break

        case 403:
          // Forbidden
          toast.error("You don't have permission to perform this action")
          break

        case 404:
          // Not found
          toast.error("Requested resource not found")
          break

        case 422:
          // Validation error
          if (data.errors) {
            Object.values(data.errors).forEach((error) => {
              toast.error(error[0])
            })
          } else {
            toast.error(data.message || "Validation error")
          }
          break

        case 429:
          // Rate limit exceeded
          toast.error("Too many requests. Please try again later.")
          break

        case 500:
          // Server error
          toast.error("Server error. Please try again later.")
          break

        default:
          toast.error(data.message || "An error occurred")
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your connection.")
    } else {
      // Other error
      toast.error("An unexpected error occurred")
    }

    return Promise.reject(error)
  },
)

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    verifyEmail: "/auth/verify-email",
    resendVerification: "/auth/resend-verification",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password",
    socialLogin: "/auth/social-login",
  },

  // User management
  users: {
    profile: "/users/profile",
    updateProfile: "/users/profile",
    uploadAvatar: "/users/avatar",
    deleteAccount: "/users/account",
  },

  // Rides
  rides: {
    create: "/rides",
    list: "/rides",
    details: (id) => `/rides/${id}`,
    cancel: (id) => `/rides/${id}/cancel`,
    rate: (id) => `/rides/${id}/rate`,
    history: "/rides/history",
  },

  // Driver specific
  driver: {
    rides: "/driver/rides",
    accept: (id) => `/driver/rides/${id}/accept`,
    arrived: (id) => `/driver/rides/${id}/arrived`,
    start: (id) => `/driver/rides/${id}/start`,
    complete: (id) => `/driver/rides/${id}/complete`,
    earnings: "/driver/earnings",
    status: "/driver/status",
  },

  // Locations
  locations: {
    search: "/locations/search",
    geocode: "/locations/geocode",
    reverseGeocode: "/locations/reverse-geocode",
    directions: "/locations/directions",
  },

  // Payments
  payments: {
    methods: "/payments/methods",
    addMethod: "/payments/methods",
    removeMethod: (id) => `/payments/methods/${id}`,
    process: "/payments/process",
    history: "/payments/history",
  },

  // Admin
  admin: {
    users: "/admin/users",
    rides: "/admin/rides",
    drivers: "/admin/drivers",
    analytics: "/admin/analytics",
  },
}

// API helper functions
export const apiHelpers = {
  // Generic CRUD operations
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => api.post(url, data),
  put: (url, data = {}) => api.put(url, data),
  patch: (url, data = {}) => api.patch(url, data),
  delete: (url) => api.delete(url),

  // File upload
  upload: (url, formData, onProgress) => {
    return api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress,
    })
  },

  // Download file
  download: (url, filename) => {
    return api
      .get(url, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      })
  },
}

// Specific API functions
export const authAPI = {
  login: (credentials) => api.post(endpoints.auth.login, credentials),
  register: (userData) => api.post(endpoints.auth.register, userData),
  logout: () => api.post(endpoints.auth.logout),
  getCurrentUser: () => api.get(endpoints.auth.me),
  forgotPassword: (email) => api.post(endpoints.auth.forgotPassword, { email }),
  resetPassword: (token, password) => api.post(`${endpoints.auth.resetPassword}/${token}`, { password }),
  changePassword: (passwords) => api.post(endpoints.auth.changePassword, passwords),
  verifyEmail: (token) => api.get(`${endpoints.auth.verifyEmail}/${token}`),
  resendVerification: (email) => api.post(endpoints.auth.resendVerification, { email }),
  socialLogin: (provider, token) => api.post(endpoints.auth.socialLogin, { provider, token }),
}

export const ridesAPI = {
  create: (rideData) => api.post(endpoints.rides.create, rideData),
  getList: (params) => api.get(endpoints.rides.list, { params }),
  getDetails: (id) => api.get(endpoints.rides.details(id)),
  cancel: (id, reason) => api.post(endpoints.rides.cancel(id), { reason }),
  rate: (id, rating, comment) => api.post(endpoints.rides.rate(id), { rating, comment }),
  getHistory: (params) => api.get(endpoints.rides.history, { params }),
}

export const driverAPI = {
  getRides: (params) => api.get(endpoints.driver.rides, { params }),
  acceptRide: (id) => api.post(endpoints.driver.accept(id)),
  arrivedAtPickup: (id) => api.post(endpoints.driver.arrived(id)),
  startRide: (id) => api.post(endpoints.driver.start(id)),
  completeRide: (id) => api.post(endpoints.driver.complete(id)),
  getEarnings: (params) => api.get(endpoints.driver.earnings, { params }),
  updateStatus: (status) => api.post(endpoints.driver.status, { status }),
}

export const locationsAPI = {
  search: (query) => api.get(endpoints.locations.search, { params: { q: query } }),
  geocode: (address) => api.get(endpoints.locations.geocode, { params: { address } }),
  reverseGeocode: (lat, lng) => api.get(endpoints.locations.reverseGeocode, { params: { lat, lng } }),
  getDirections: (origin, destination) => api.get(endpoints.locations.directions, { params: { origin, destination } }),
}

export const paymentsAPI = {
  getMethods: () => api.get(endpoints.payments.methods),
  addMethod: (methodData) => api.post(endpoints.payments.addMethod, methodData),
  removeMethod: (id) => api.delete(endpoints.payments.removeMethod(id)),
  processPayment: (paymentData) => api.post(endpoints.payments.process, paymentData),
  getHistory: (params) => api.get(endpoints.payments.history, { params }),
}

// Export the main api instance
export default api
