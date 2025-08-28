export const RIDE_STATUS = {
    REQUESTED: "requested",
    SEARCHING: "searching",
    ACCEPTED: "accepted",
    ARRIVED: "arrived",
    IN_PROGRESS: "inProgress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    SCHEDULED: "scheduled",
    NO_DRIVER: "noDriver",
  }
  
  export const VEHICLE_TYPES = {
    STANDARD: "standard",
    COMFORT: "comfort",
    PREMIUM: "premium",
    VAN: "van",
  }
  
  export const PAYMENT_METHODS = {
    CARD: "card",
    CASH: "cash",
    PAYPAL: "paypal",
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
    DRIVER_ASSIGNED: "driver_assigned",
    PAYMENT_PROCESSED: "payment_processed",
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
      ESTIMATE: "/rides/estimate",
    },
    DRIVERS: {
      PROFILE: "/drivers/profile",
      STATUS: "/drivers/status",
      LOCATION: "/drivers/location",
      EARNINGS: "/drivers/earnings",
      STATS: "/drivers/stats",
    },
  }
  
  export const COLORS = {
    PRIMARY: "#3B82F6",
    SUCCESS: "#10B981",
    WARNING: "#F59E0B",
    ERROR: "#EF4444",
    INFO: "#6366F1",
  }
  
  export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  }
  