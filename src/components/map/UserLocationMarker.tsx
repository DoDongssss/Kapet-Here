import { Marker, Circle } from "react-leaflet"
import L from "leaflet"
import { renderToStaticMarkup } from "react-dom/server"

interface UserLocationMarkerProps {
  latitude: number
  longitude: number
  accuracy?: number
}

const userIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div style={{ position: "relative", width: "20px", height: "20px" }}>
      {/* Pulse ring */}
      <div
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "50%",
          backgroundColor: "rgba(59,130,246,0.2)",
          animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
        }}
      />
      {/* Core dot */}
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "#3B82F6",
          border: "3px solid white",
          boxShadow: "0 2px 8px rgba(59,130,246,0.5)",
        }}
      />
    </div>
  ),
  className: "user-location-marker",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

export default function UserLocationMarker({
  latitude,
  longitude,
  accuracy,
}: UserLocationMarkerProps) {
  return (
    <>
      {accuracy && (
        <Circle
          center={[latitude, longitude]}
          radius={accuracy}
          pathOptions={{
            color: "#3B82F6",
            fillColor: "#3B82F6",
            fillOpacity: 0.08,
            weight: 1,
            opacity: 0.4,
          }}
        />
      )}
      <Marker
        position={[latitude, longitude]}
        icon={userIcon}
        zIndexOffset={2000}
      />
    </>
  )
}