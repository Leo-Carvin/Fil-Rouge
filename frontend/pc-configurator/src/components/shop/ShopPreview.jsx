import { useEffect, useState } from "react"
import { getProducts } from "../../api/api"

const IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80"

export default function ShopPreview({ onRequireAuth }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts({ sort: "recent" }).then((data) => {
      setProducts(Array.isArray(data) ? data.slice(0, 8) : [])
    })
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-700 bg-slate-800 p-3 flex flex-col">
          <img
            src={item.image || IMAGE_PLACEHOLDER}
            alt={item.name}
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = IMAGE_PLACEHOLDER
            }}
            className="h-32 w-full rounded-md object-contain bg-slate-700/50"
          />
          <div className="mt-2 flex-1 flex flex-col">
            <p className="text-sm font-semibold text-white leading-tight">{item.name}</p>
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-indigo-300 font-black">${Number(item.price).toFixed(2)}</span>
              <span className="shrink-0 rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">{item.type}</span>
            </div>
            <button
              onClick={onRequireAuth}
              className="mt-2 w-full rounded-full bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500 hover:text-white transition"
            >
              🛒 Ajouter au panier
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
