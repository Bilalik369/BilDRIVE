import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "ride_request",
        "ride_accepted",
        "ride_arrived",
        "ride_completed",
        "ride_cancelled",
        "delivery_request",
        "delivery_accepted",
        "delivery_picked_up",
        "delivery_completed",
        "delivery_cancelled",
        "payment",
        "account",
        "promotion",
        "system",
      ],
      required: true,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceModel",
    },
    referenceModel: {
      type: String,
      enum: ["Ride", "Delivery", "Payment", "User"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    data: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification
