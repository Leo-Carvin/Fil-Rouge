import { useContext } from "react"
import { CartContext } from "../context/cartContextValue"

export function useCart() {
  return useContext(CartContext)
}
