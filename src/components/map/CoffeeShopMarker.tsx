import { Marker } from "react-leaflet"
import L from "leaflet"
import { renderToStaticMarkup } from "react-dom/server"
import { useMapStore } from "@/store/useMapStore"
import type { CoffeeShop } from "@/types/coffeeShop"

interface CoffeeShopMarkerProps {
  shop: CoffeeShop
  onClick: () => void
}

/** Creates a custom SVG/HTML div icon for each marker */
function createMarkerIcon(isSelected: boolean) {
  const size = isSelected ? 44 : 36
  const html = renderToStaticMarkup(
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50% 50% 50% 0",
        transform: "rotate(-45deg)",
        backgroundColor: isSelected ? "#D4863A" : "#6B3F1F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: isSelected
          ? "0 4px 16px rgba(212,134,58,0.5)"
          : "0 2px 8px rgba(42,18,8,0.35)",
        border: "2px solid white",
      }}
    >
      <div style={{ transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg
          width={isSelected ? 18 : 15}
          height={isSelected ? 18 : 15}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" x2="6" y1="2" y2="4" />
          <line x1="10" x2="10" y1="2" y2="4" />
          <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
      </div>
    </div>
  )

  return L.divIcon({
    html,
    className: "coffee-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  })
}

export default function CoffeeShopMarker({ shop, onClick }: CoffeeShopMarkerProps) {
  const { selectedShop } = useMapStore()
  const isSelected = selectedShop?.id === shop.id

  return (
    // No <Popup> here — tapping a marker opens the bottom drawer (mobile)
    // or the right panel (desktop). A Leaflet Popup on top of those
    // creates a duplicate / awkward double popup UX.
    <Marker
      position={[shop.latitude, shop.longitude]}
      icon={createMarkerIcon(isSelected)}
      eventHandlers={{ click: onClick }}
      zIndexOffset={isSelected ? 1000 : 0}
    />
  )
}