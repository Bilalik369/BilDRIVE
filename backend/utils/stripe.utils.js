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

  export const attachPaymentMethod = async (paymentMethodId, customerId) => {
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      })
  
      return { success: true }
    } catch (error) {
      console.error("Error attaching payment method:", error)
      throw new Error(`Failed to attach payment method: ${error.message}`)
    }
  }

  export const setDefaultPaymentMethod = async (customerId, paymentMethodId) => {
    try {
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })
  
      return { success: true }
    } catch (error) {
      console.error("Error setting default payment method:", error)
      throw new Error(`Failed to set default payment method: ${error.message}`)
    }
  }

  export const getCustomerPaymentMethods = async (customerId) => {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      })
  
      return paymentMethods.data.map((pm) => ({
        id: pm.id,
        type: pm.type,
        card: pm.card
          ? {
              brand: pm.card.brand,
              last4: pm.card.last4,
              expMonth: pm.card.exp_month,
              expYear: pm.card.exp_year,
            }
          : null,
      }))
    } catch (error) {
      console.error("Error getting payment methods:", error)
      throw new Error(`Failed to get payment methods: ${error.message}`)
    }
  }
  

  export const createRefund = async (paymentIntentId, amount = null, reason = "requested_by_customer") => {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason,
      }
  
      if (amount) {
        refundData.amount = Math.round(amount * 100) 
      }
  
      const refund = await stripe.refunds.create(refundData)
  
      return {
        refundId: refund.id,
        amount: refund.amount / 100, 
        status: refund.status,
        reason: refund.reason,
      }
    } catch (error) {
      console.error("Error creating refund:", error)
      throw new Error(`Failed to create refund: ${error.message}`)
    }
  }