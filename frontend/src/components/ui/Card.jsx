const Card = ({ children, className = "", padding = "p-6", shadow = "shadow-md", hover = false, ...props }) => {
    return (
      <div
        className={`
          bg-card-bg rounded-xl border border-border-color
          ${padding} ${shadow}
          ${hover ? "hover:shadow-lg transition-shadow duration-200" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
  
  export default Card
  