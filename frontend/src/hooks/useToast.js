"use client"

import { useState, useCallback } from "react"

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now()
    const toast = { id, message, type, duration }

    setToasts((prev) => [...prev, toast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)

    return id
  }, [])

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
  }
}
