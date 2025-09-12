import { useState, useCallback } from "react"
import Toast from "./Toast"

let toastId = 0

const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = ++toastId
    const newToast = {
      id,
      type: "success",
      duration: 5000,
      ...toast,
    }
    
    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message, title = "Succès", duration = 5000) => {
    return addToast({ type: "success", title, message, duration })
  }, [addToast])

  const showError = useCallback((message, title = "Erreur", duration = 7000) => {
    return addToast({ type: "error", title, message, duration })
  }, [addToast])

  const showWarning = useCallback((message, title = "Attention", duration = 6000) => {
    return addToast({ type: "warning", title, message, duration })
  }, [addToast])

  const showInfo = useCallback((message, title = "Information", duration = 5000) => {
    return addToast({ type: "info", title, message, duration })
  }, [addToast])

  // Expose methods globally
  if (typeof window !== 'undefined') {
    window.showToast = {
      success: showSuccess,
      error: showError,
      warning: showWarning,
      info: showInfo,
    }
  }

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

export default ToastContainer

