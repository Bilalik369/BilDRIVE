import { createError } from "../utils/error.utils.js"

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body)

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }))

        return next(createError(400, "Validation failed", errors))
      }

      req.body = result.data
      next()
    } catch (error) {
      next(createError(500, "Validation error"))
    }
  }
}