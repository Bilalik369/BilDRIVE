"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

const Toast = ({ id, type = "info", title, message, duration = 5000, onClose, position = "top-right" }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.(id)
    }, 300)
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getStyles = () => {
    const baseStyles =
      "flex items-start gap-3 p-4 rounded-lg shadow-lg border max-w-sm w-full transition-all duration-300"

    const typeStyles = {
      success: "bg-white border-green-200",
      error: "bg-white border-red-200",
      warning: "bg-white border-yellow-200",
      info: "bg-white border-blue-200",
    }

    const positionStyles = {
      "top-right": "transform translate-x-0",
      "top-left": "transform translate-x-0",
      "bottom-right": "transform translate-x-0",
      "bottom-left": "transform translate-x-0",
    }

    const animationStyles = isLeaving ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"

    return `${baseStyles} ${typeStyles[type]} ${positionStyles[position]} ${animationStyles}`
  }

  if (!isVisible) return null

  return (
    <div className={getStyles()}>
      {getIcon()}
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-semibold text-text-dark mb-1">{title}</h4>}
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-text-secondary hover:text-text-dark transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast Container Component
export const ToastContainer = ({ toasts, position = "top-right" }) => {
  const getContainerStyles = () => {
    const baseStyles = "fixed z-50 flex flex-col gap-2 p-4"

    const positionStyles = {
      "top-right": "top-0 right-0",
      "top-left": "top-0 left-0",
      "bottom-right": "bottom-0 right-0",
      "bottom-left": "bottom-0 left-0",
    }

    return `${baseStyles} ${positionStyles[position]}`
  }

  return (
    <div className={getContainerStyles()}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} position={position} />
      ))}
    </div>
  )
}

export default Toast
    