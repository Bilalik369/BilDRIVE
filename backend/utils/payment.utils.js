import { createPaymentIntent } from "./stripe.utils.js"


export const processPayment = async (paymentData) => {
  try {
    const { method, amount, currency = "eur", metadata = {} } = paymentData

    
    if (method === "cash") {
      return {
        status: "cash_pending",
        transactionId: `cash_${Date.now()}${Math.floor(Math.random() * 1000)}`,
        message: "Cash payment pending confirmation",
      }
    }

    if (method === "card") {
      const { clientSecret, paymentIntentId } = await createPaymentIntent(amount, currency, metadata)

      return {
        status: "pending",
        transactionId: paymentIntentId,
        clientSecret,
        message: "Payment intent created successfully",
      }
    }

    if (method === "paypal") {
      const transactionId = `paypal_${Date.now()}${Math.floor(Math.random() * 1000)}`

      return {
        status: "completed",
        transactionId,
        message: "PayPal payment processed successfully",
      }
    }

    throw new Error("Unsupported payment method")
  } catch (error) {
    console.error("Error processing payment:", error)
    return {
      status: "failed",
      message: error.message || "Payment processing failed",
    }
  }
}