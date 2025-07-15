import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const createPaymentIntent = async (amount, currency = "eur", customerId = null, metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency,
      customer: customerId,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw new Error(`Failed to create payment intent: ${error.message}`)
  }
}

export const confirmPaymentIntent = async (paymentIntentId) => {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId)
      return {
        status: paymentIntent.status,
        paymentMethod: paymentIntent.payment_method,
        charges: paymentIntent.charges.data,
      }
    } catch (error) {
      console.error("Error confirming payment intent:", error)
      throw new Error(`Failed to confirm payment intent: ${error.message}`)
    }
  }


export const createCustomer = async (email, name, phone = null) => {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        phone,
      })
  
      return {
        customerId: customer.id,
        email: customer.email,
        name: customer.name,
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      throw new Error(`Failed to create customer: ${error.message}`)
    }
  }