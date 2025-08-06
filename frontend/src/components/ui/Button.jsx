  "use client"
  import { Loader } from "lucide-react"

  const Button = ({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    icon,
    onClick,
    className = "",
    type = "button",
    ...props
  }) => {
    const baseClasses =
      "font-medium rounded-full transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"

    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 active:bg-primary/80 disabled:bg-primary/50",
      secondary: "bg-card-bg text-text-primary hover:bg-card-bg/80 active:bg-card-bg/70",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white active:bg-primary/90",
      ghost: "text-text-primary hover:bg-card-bg active:bg-card-bg/80",
      danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    }

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-6 py-3 text-lg",
      xl: "px-8 py-4 text-xl",
    }

    const isDisabled = disabled || loading

    return (
      <button
        type={type}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${className}`}
        style={{
          borderRadius: '20px',
          outline: '0 !important'
        }}
        disabled={isDisabled}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <Loader className="animate-spin w-4 h-4" />
        ) : (
          icon && <span className="flex items-center">{icon}</span>
        )}
        {children}
      </button>
    )
  }

  export default Button
