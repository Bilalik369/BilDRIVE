export const RIDE_STATUS = {
    REQUESTED: "requested",
    SEARCHING: "searching",
    ACCEPTED: "accepted",
    ARRIVED: "arrived",
    IN_PROGRESS: "inProgress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    NO_DRIVER: "noDriver",
  }
  
  export const VEHICLE_TYPES = {
    ECONOMY: "economy",
    STANDARD: "standard",
    PREMIUM: "premium",
    SUV: "suv",
  }
  
  export const PAYMENT_METHODS = {
    CASH: "cash",
    CARD: "card",
    WALLET: "wallet",
  }
  
  export const USER_ROLES = {
    PASSENGER: "passenger",
    DRIVER: "driver",
    ADMIN: "admin",
  }
  
  export const NOTIFICATION_TYPES = {
    RIDE_REQUEST: "ride_request",
    RIDE_ACCEPTED: "ride_accepted",
    RIDE_ARRIVED: "ride_arrived",
    RIDE_STARTED: "ride_started",
    RIDE_COMPLETED: "ride_completed",
    RIDE_CANCELLED: "ride_cancelled",
  }
  
  export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      ME: "/auth/me",
      VERIFY_EMAIL: "/auth/verify-email",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
      SOCIAL_LOGIN: "/auth/social-login",
    },
    RIDES: {
      REQUEST: "/rides",
      USER_RIDES: "/rides/user",
      DRIVER_RIDES: "/rides/driver",
      CANCEL: "/rides/:id/cancel",
      RATE: "/rides/:id/rate",
      ACCEPT: "/rides/:id/accept",
      ARRIVED: "/rides/:id/arrived",
      START: "/rides/:id/start",
      COMPLETE: "/rides/:id/complete",
    },
  }
  