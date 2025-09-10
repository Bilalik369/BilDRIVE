import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="العودة للأعلى"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  )
}

export default BackToTop
