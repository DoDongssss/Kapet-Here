import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  MapPin, Navigation, ExternalLink,
  ArrowLeft, Star, MessageSquare, Map,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCoffeeShop } from "@/hooks/useCoffeeShop"
import { useFeedback } from "@/hooks/useFeedback"
import { useUserLocation } from "@/hooks/useUserLocation"
import { useMapStore } from "@/store/useMapStore"
import CoffeeShopGallery from "@/components/coffee-shop/CoffeeShopGallery"
import CoffeeShopRating from "@/components/coffee-shop/CoffeeShopRating"
import FeedbackList from "@/components/feedback/FeedbackList"
import { PageSpinner } from "@/components/shared/LoadingSpinner"
import ErrorMessage from "@/components/shared/ErrorMessage"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"

type Tab = "overview" | "reviews"

export default function CoffeeShopPage() {
  const { id }        = useParams<{ id: string }>()
  const navigate      = useNavigate()
  const [tab, setTab] = useState<Tab>("overview")

  const { data: shop, isLoading, error }              = useCoffeeShop(id)
  const { data: feedback = [], isLoading: fbLoading } = useFeedback(id)
  const { fetchLocation }                             = useUserLocation()
  const { setUserLocation, startDirections }          = useMapStore()

  const avgRating =
    feedback.length > 0
      ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length
      : 0

  const handleDirections = async () => {
    if (!shop) return
    const loc = await fetchLocation()
    if (!loc) return
    setUserLocation(loc)
    startDirections(shop)
    navigate(ROUTES.HOME)
  }

  if (isLoading) return <PageSpinner label="Loading coffee shop..." />
  if (error || !shop) {
    return (
      <ErrorMessage
        title="Shop not found"
        message="This coffee shop doesn't exist or has been removed."
        onRetry={() => navigate(ROUTES.HOME)}
        className="min-h-[60vh]"
      />
    )
  }

  const googleMapsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`

  const osmSrc =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${shop.longitude - 0.005},${shop.latitude - 0.005},` +
    `${shop.longitude + 0.005},${shop.latitude + 0.005}` +
    `&layer=mapnik&marker=${shop.latitude},${shop.longitude}`

  return (
    <div className="bg-[#FAF7F2] min-h-dvh">

      {/* ── Hero gallery — full bleed ── */}
      <div className="relative w-full">
        <CoffeeShopGallery
          photos={shop.coffee_shop_photos ?? []}
          className="h-60 rounded-none w-full"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/45 backdrop-blur-sm text-white text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* ── Sheet — rounds up over gallery ── */}
      <div
        className="relative z-10 bg-[#FAF7F2] rounded-t-3xl -mt-5 w-full"
        style={{ boxShadow: "0 -4px 20px rgba(42,18,8,0.10)" }}
      >
        {/* Drag pill */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 rounded-full bg-[#D8C9B8]" />
        </div>

        {/* ── Shop name / location / rating ── */}
        <div className="px-4 pt-3 pb-4 space-y-1.5">
          <h1
            className="text-2xl font-bold text-[#2A1208] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {shop.name}
          </h1>
          <div className="flex items-center gap-1.5 text-[#9C7A5B]">
            <MapPin className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
            <span className="text-sm">{shop.location}</span>
          </div>
          {feedback.length > 0 ? (
            <CoffeeShopRating rating={avgRating} count={feedback.length} size="md" />
          ) : (
            <span className="text-sm text-[#C4A882] italic">No reviews yet</span>
          )}
        </div>

        {/* ── Custom tab bar — plain div, no shadcn Tabs ── */}
        <div className="flex border-b border-[#E8DDD0] px-4">
          {(["overview", "reviews"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 px-1 pb-3 pt-1 mr-6 text-sm font-semibold border-b-2 transition-colors",
                tab === t
                  ? "border-[#6B3F1F] text-[#2A1208]"
                  : "border-transparent text-[#9C7A5B]"
              )}
            >
              {t === "overview"
                ? <><Map className="w-3.5 h-3.5" /> Overview</>
                : <><MessageSquare className="w-3.5 h-3.5" /> Reviews ({feedback.length})</>
              }
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="px-4 pb-32 pt-4">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-4">

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-[#E8DDD0] rounded-2xl p-3">
                  <p className="text-[10px] text-[#9C7A5B] uppercase tracking-widest font-semibold mb-1">
                    Location
                  </p>
                  <p className="text-sm font-medium text-[#2A1208] leading-snug break-words">
                    {shop.location}
                  </p>
                </div>
                <div className="bg-white border border-[#E8DDD0] rounded-2xl p-3">
                  <p className="text-[10px] text-[#9C7A5B] uppercase tracking-widest font-semibold mb-1">
                    Rating
                  </p>
                  <p className="text-sm font-medium text-[#2A1208]">
                    {feedback.length > 0 ? `${avgRating.toFixed(1)} / 5.0` : "—"}
                  </p>
                </div>
              </div>

              {/* OSM map */}
              <div className="rounded-2xl overflow-hidden border border-[#E8DDD0]">
                <iframe
                  title={`Map of ${shop.name}`}
                  src={osmSrc}
                  className="w-full h-44 border-0 block"
                  loading="lazy"
                />
                <div className="px-4 py-3 bg-white flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2A1208] truncate">{shop.name}</p>
                    <p className="text-xs text-[#9C7A5B] truncate">{shop.location}</p>
                  </div>
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                    <Button size="sm" variant="outline"
                      className="gap-1.5 border-[#E8DDD0] text-[#5C3A1E] hover:bg-[#EDE3D8] text-xs h-8">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open
                    </Button>
                  </a>
                </div>
              </div>

              {/* Review CTA */}
              <div className="rounded-2xl bg-gradient-to-br from-[#2A1208] to-[#4A2010] p-5 text-white">
                <h3
                  className="text-base font-bold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Visited this shop?
                </h3>
                <p className="text-xs text-[#C4A882] mb-3 leading-relaxed">
                  Share your experience with your one-time feedback token.
                </p>
                <Link to={ROUTES.FEEDBACK}>
                  <Button size="sm" className="bg-[#D4863A] hover:bg-[#C07830] text-white gap-2 h-9">
                    <Star className="w-3.5 h-3.5" />
                    Submit a Review
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {tab === "reviews" && (
            <FeedbackList feedback={feedback} isLoading={fbLoading} />
          )}

        </div>
      </div>

      {/* ── Sticky bottom action bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 bg-[#FAF7F2]/96 backdrop-blur-md border-t border-[#E8DDD0] px-4 pt-3 pb-6"
        style={{ boxShadow: "0 -1px 12px rgba(42,18,8,0.08)" }}
      >
        <div className="flex gap-3 w-full">
          <Button
            onClick={handleDirections}
            className="flex-1 gap-2 bg-[#6B3F1F] hover:bg-[#4A2810] text-white h-12 text-sm font-semibold"
            style={{ boxShadow: "0 4px 14px rgba(107,63,31,0.28)" }}
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </Button>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="gap-2 border-[#E8DDD0] bg-white text-[#5C3A1E] hover:bg-[#EDE3D8] h-12 px-4 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Maps
            </Button>
          </a>
        </div>
      </div>

    </div>
  )
}