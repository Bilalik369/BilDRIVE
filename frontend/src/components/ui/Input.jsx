import React, { forwardRef } from "react"
import { Eye, EyeOff } from "lucide-react"

const Input = forwardRef(
  ({ label, type = "text", placeholder, error, icon, className = "", showPasswordToggle = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [inputType, setInputType] = React.useState(type)

    React.useEffect(() => {
      if (type === "password" && showPasswordToggle) {
        setInputType(showPassword ? "text" : "password")
      }
    }, [showPassword, type, showPasswordToggle])

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
      <div className={`w-full ${className}`}>
        {label && <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-placeholder-text">{icon}</span>
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            className={`
            w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg
            text-text-dark placeholder-placeholder-text
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${showPasswordToggle ? "pr-10" : ""}
            ${error ? "border-red-500 focus:ring-red-500" : ""}
          `}
            {...props}
          />
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-placeholder-text hover:text-text-primary" />
              ) : (
                <Eye className="h-5 w-5 text-placeholder-text hover:text-text-primary" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

export default Input
