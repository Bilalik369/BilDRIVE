import axios from "axios"



const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-bildrive-fmebbghucmhnemes.francecentral-01.azurewebsites.net/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {    
    "Content-Type": "application/json",
  },
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  },
)


export const authApi = {
    login: (email, password) => api.post("/auth/login", { email, password }),
    register: (userData) => api.post("/auth/register", userData),
    getCurrentUser: () => api.get("/auth/me"),
    verifyEmail: (token) => api.post(`/auth/verify-email/${token}`),
    resendVerification: (email) => api.post("/auth/resend-verification", { email }),
    forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
    socialLogin: (provider, token) => api.post("/auth/social-login", { provider, token }),
    changePassword: (currentPassword, newPassword) => api.put("/auth/change-password", { currentPassword, newPassword }),
    updateProfile: (userData) => api.put("/auth/profile", userData),
    logout: () => api.post("/auth/logout"),
  }


  