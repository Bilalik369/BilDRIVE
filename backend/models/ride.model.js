import mongoose from "mongoose"

const rideSchema = new mongoose.Schema(
  {
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    pickup: {
      address: {
        type: String,
        required: [true, "Pickup address is required"],
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: [true, "Pickup coordinates are required"],
        },
      },
    },
    destination: {
      address: {
        type: String,
        required: [true, "Destination address is required"],
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: [true, "Destination coordinates are required"],
        },
      },
    },
    scheduledTime: {
      type: Date,
    },
    requestTime: {
      type: Date,
      default: Date.now,
    },
    pickupTime: Date,
    dropoffTime: Date,
    status: {
      type: String,
      enum: ["requested", "searching", "accepted", "arrived", "inProgress", "completed", "cancelled", "noDriver"],
      default: "requested",
    },
    cancelledBy: {
      type: String,
      enum: ["passenger", "driver", "system"],
    },
    cancellationReason: String,
    vehicleType: {
      type: String,
      enum: ["standard", "comfort", "premium", "van"],
      default: "standard",
    },
    passengers: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },
    price: {
      base: {
        type: Number,
        required: true,
      },
      distance: Number,
      time: Number,
      total: {
        type: Number,
        required: true,
      },
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },

  
    route: {
      polyline: {
        type: String,
      },
      steps: [
        {
          distance: Number,
          duration: Number,
          instructions: String,
          startLocation: {
            lat: Number,
            lng: Number,
          },
          endLocation: {
            lat: Number,
            lng: Number,
          },
          polyline: String,
        },
      ],
    },

    payment: {
      method: {
        type: String,
        enum: ["card", "cash", "paypal"],
        default: "card",
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded", "cash_pending", "cash_received"],
        default: "pending",
      },
      transactionId: String,
      cashDetails: {
        receivedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        receivedAt: Date,
        confirmedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        confirmedAt: Date,
        amount: Number,
        change: Number,
      },
    },

    rating: {
      passenger: {
        value: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: Date,
      },
      driver: {
        value: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: Date,
      },
    },

    notes: String,
  },
  {
    timestamps: true,
  }
)

rideSchema.index({ "pickup.location": "2dsphere" })
rideSchema.index({ "destination.location": "2dsphere" })

const Ride = mongoose.model("Ride", rideSchema)

export default Ride
