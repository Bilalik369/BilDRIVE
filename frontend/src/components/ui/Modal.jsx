import { useEffect } from "react"
import { X } from "lucide-react"
import Button from "./Button"

const Modal = ({ isOpen, onClose, title, children, size = "md", showCloseButton = true, className = "" }) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
       
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />

        <div
          className={`
            inline-block w-full ${sizes[size]} my-8 overflow-hidden text-left align-middle
            transition-all transform bg-white shadow-xl rounded-2xl
            ${className}
          `}
        >
        
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && <h3 className="text-lg font-semibold text-text-dark">{title}</h3>}
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={<X className="w-4 h-4" />}
                  className="ml-auto"
                />
              )}
            </div>
          )}

         
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
