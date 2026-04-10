import { MapPin, Navigation, ExternalLink, Star, MessageSquare } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CoffeeShopGallery from "./CoffeeShopGallery"
import CoffeeShopRating from "./CoffeeShopRating"
import { coffeeShopPath } from "@/constants/routes"
import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"
import type { Feedback } from "@/types/feedback"

interface CoffeeShopDetailProps {
  shop: CoffeeShopWithPhotos
  feedback?: Feedback[]
  onGetDirections?: () => void
}

export default function CoffeeShopDetail({
  shop,
  feedback = [],
  onGetDirections,
}: CoffeeShopDetailProps) {
  const averageRating =
    feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
      : 0

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`

  return (
    <div className="space-y-5">
      test masarap
      {/* Gallery */}
      <CoffeeShopGallery photos={shop.coffee_shop_photos ?? []} />

      {/* Header */}
      <div className="space-y-2">
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
          <CoffeeShopRating rating={averageRating} count={feedback.length} size="md" />
        ) : (
          <div className="flex items-center gap-1.5 text-[#C4A882]">
            <Star className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm italic">No reviews yet</span>
          </div>
        )}
      </div>

      <Separator className="bg-[#E8DDD0]" />

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={onGetDirections}
          className="flex-1 gap-2 bg-[#6B3F1F] hover:bg-[#4A2810] text-white h-11 shadow-md shadow-[#6B3F1F]/20 font-semibold"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </Button>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            className="gap-2 border-[#E8DDD0] text-[#5C3A1E] hover:bg-[#EDE3D8] h-11"
          >
            <ExternalLink className="w-4 h-4" />
            Maps
          </Button>
        </a>
      </div>

      {/* Reviews CTA */}
      <Link
        to={coffeeShopPath(shop.id)}
        className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#2A1208] to-[#3D1F0D] text-white hover:from-[#3D1F0D] hover:to-[#4A2810] transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-4 h-4 text-[#D4863A]" strokeWidth={1.8} />
          <div>
            <p className="text-sm font-semibold">View Full Details</p>
            <p className="text-[11px] text-[#9C7A5B]">Reviews, photos & more</p>
          </div>
        </div>
        <span className="text-[#D4863A] text-lg group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  )
}