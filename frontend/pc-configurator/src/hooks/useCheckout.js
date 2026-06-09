import { createOrder } from "../api/api"

export function useCheckout({ cart, clearCart, onOrderSuccess }) {
  const handleOrder = async () => {
    if (cart.length === 0) return

    const items = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    const res = await createOrder(items)

    if (res.orderId) {
      clearCart()
      onOrderSuccess?.()
      alert(`✅ Commande #${res.orderId} passée avec succès !`)
      return
    }

    alert("❌ Erreur lors de la commande")
  }

  return {
    handleOrder,
  }
}
