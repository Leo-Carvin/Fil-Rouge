import { startCheckout } from "../api/api"

export function useCheckout({ cart, clearCart, onOrderSuccess }) {
  const handleOrder = async () => {
    if (cart.length === 0) return

    const items = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    try {
      const res = await startCheckout(items)
      if (res.url) {
        // Redirect to Stripe Checkout
        window.location.href = res.url
        // Optionally call onOrderSuccess after redirect? Not needed as page will change.
        return
      }
      // If no url, fallback
      if (res.orderId) {
        clearCart()
        onOrderSuccess?.()
        alert(`✅ Commande #${res.orderId} passée avec succès !`)
        return
      }
      alert("❌ Erreur lors de la création de la session de paiement")
    } catch (err) {
      console.error(err)
      alert("❌ Erreur lors de la commande")
    }
  }

  return {
    handleOrder,
  }
}