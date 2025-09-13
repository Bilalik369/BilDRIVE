import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["ride", "delivery", "withdrawal", "refund"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "DH",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "cash_pending", "cash_received"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["card", "cash", "paypal", "bank"],
      required: true,
    },
    transactionId: String,
    paymentDetails: {
      cardLast4: String,
      cardBrand: String,
      paypalEmail: String,
      bankAccount: String,
      cashReceivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      cashReceivedAt: Date,
      cashConfirmedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      cashConfirmedAt: Date,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceModel",
    },
    referenceModel: {
      type: String,
      enum: ["Ride", "Delivery", "Withdrawal"],
    },
    receipt: {
      url: String,
      generatedAt: Date,
    },
    refundReason: String,
    notes: String,
  },
  {
    timestamps: true,
  },
)

const Payment = mongoose.model("Payment", paymentSchema)

export default Payment
