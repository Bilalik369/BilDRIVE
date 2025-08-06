import { Loader } from "lucide-react"

const Loading = ({ size = "md", text = "Loading...", fullScreen = false, className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader className={`animate-spin text-primary ${sizes[size]}`} />
      {text && <p className="text-text-secondary text-sm font-medium">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">{content}</div>
  }

  return content
}

export default Loading
