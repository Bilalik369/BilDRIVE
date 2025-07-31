"use client"

import { useState } from "react"
import { Star, MessageCircle } from "lucide-react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import { toast } from "react-hot-toast"
import { useRide } from "../../hooks/useRide"

const RideRating = ({ ride, onClose }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const { rateRide } = useRide()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    setLoading(true)
    try {
      await rateRide(ride._id, rating, comment)
      toast.success("Thank you for your feedback!")
      onClose?.()
    } catch (error) {
      toast.error("Failed to submit rating")
    } finally {
      setLoading(false)
    }
  }

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  }

  return (
    <Card className="p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-dark mb-2">Rate Your Ride</h2>
        <p className="text-text-secondary">How was your experience?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Driver info */}
        {ride.driver && (
          <div className="text-center p-4 bg-bg-main rounded-lg">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg font-semibold">
                {ride.driver.user?.firstName?.charAt(0)}
                {ride.driver.user?.lastName?.charAt(0)}
              </span>
            </div>
            <h3 className="font-semibold text-text-dark">
              {ride.driver.user?.firstName} {ride.driver.user?.lastName}
            </h3>
            <p className="text-sm text-text-secondary">
              {ride.driver.vehicle?.make} {ride.driver.vehicle?.model}
            </p>
          </div>
        )}

        {/* Star rating */}
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {(hoveredRating || rating) > 0 && (
            <p className="text-sm font-medium text-text-primary">{ratingLabels[hoveredRating || rating]}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            <MessageCircle className="w-4 h-4 inline mr-1" />
            Additional Comments (Optional)
          </label>
          <textarea
            className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows="4"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
          <div className="text-right text-xs text-text-secondary mt-1">{comment.length}/500</div>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Skip
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Submit Rating
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default RideRating
