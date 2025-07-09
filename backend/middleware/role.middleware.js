import { createError } from "../utils/error.utils.js"

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, "Authentication required. Please login."))
    }

    if (!roles.includes(req.user.role)) {
      return next(createError(403, "You are not authorized to access this resource."))
    }

    next()
  }
}
