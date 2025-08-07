import { createError } from "../utils/error.utils.js"

export const requireVerification = async (req, res, next) => {
  try {
    
    if (!req.user.isVerified) {
      return next(createError(403, "Please verify your email before accessing this resource"))
    }
    
    next()
  } catch (error) {
    next(error)
  }
} 