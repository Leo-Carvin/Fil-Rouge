const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const cartModel = require('../models/cartModel')
const { sendOrderConfirmation } = require('../services/mailer')
const Stripe = require('stripe')

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

// --- Create Stripe Checkout Session ---
exports.createCheckout = async (req, res) => {
  try {
    const { items } = req.body
    const userId = req.user.id

    // Calculate total and build line_items for Stripe
    let total = 0
    const lineItems = []
    for (const item of items) {
      total += Number(item.price) * item.quantity
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: Math.round(Number(item.price) * 100), // cents
        },
        quantity: item.quantity,
      })
    }

    // Create order in DB (status: pending)
    const orderId = await orderModel.create({ userId, total: total.toFixed(2) })

    // Insert order items
    for (const item of items) {
      await orderModel.addItem(orderId, { product_id: item.id, quantity: item.quantity, price: item.price })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success?order=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/order-cancelled?order=${orderId}`,
      metadata: { order_id: String(orderId), user_id: String(userId) },
    })

    // Save stripe session id
    await orderModel.setStripeSessionId(orderId, session.id)

    res.json({ url: session.url, orderId })
  } catch (error) {
    console.error('Checkout error:', error)
    res.status(500).json({ error: error.message })
  }
}

// --- Stripe Webhook ---
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata.order_id
    const userId = session.metadata.user_id

    try {
      // Update order status to paid
      await orderModel.updateStatus(orderId, 'paid')

      // Get order details for email
      const orderDetails = await orderModel.findById(orderId)
      const userEmail = await userModel.findEmailById(userId)

      if (userEmail) {
        const itemsWithNames = orderDetails.items.map(item => ({
          name: item.name || 'Produit',
          quantity: item.quantity,
          price: item.price,
        }))
        await sendOrderConfirmation(userEmail, orderId, itemsWithNames, orderDetails.total_price)
      }

      // Clear user cart
      await cartModel.clear(userId)

      console.log(`Order #${orderId} confirmed and email sent`)
    } catch (err) {
      console.error('Error processing payment confirmation:', err)
    }
  }

  res.json({ received: true })
}

// --- Legacy order creation (kept for compatibility) ---
exports.createOrder = async (req, res) => {
  try {
    const { user_id, items } = req.body
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const orderId = await orderModel.create({ userId: user_id, total })

    for (const item of items) {
      await orderModel.addItem(orderId, item)
    }

    const userEmail = await userModel.findEmailById(user_id)
    const itemsWithNames = await Promise.all(items.map(async (item) => ({
      ...item,
      name: await productModel.findNameById(item.product_id) || 'Produit'
    })))

    if (userEmail) {
      await sendOrderConfirmation(userEmail, orderId, itemsWithNames, total)
    }

    res.json({ message: 'Commande creee', orderId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.findByUserId(req.params.user_id)
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
