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
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <span className="text-placeholder-text">{icon}</span>
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            className={`
            w-full px-4 py-3 bg-input-bg border border-border-color rounded-full
            text-text-dark placeholder-placeholder-text
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all duration-200
            ${error ? "border-red-500 focus:ring-red-500" : ""}
          `}
            style={{
              borderRadius: '20px',
              outline: '0 !important',
              boxSizing: 'border-box',
              padding: icon ? '12px 15px 12px 50px' : '12px 15px',
              paddingRight: showPasswordToggle ? '50px' : '15px'
            }}
            {...props}
          />
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
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
