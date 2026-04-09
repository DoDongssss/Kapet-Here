import { Link } from "react-router-dom"
import { Coffee, MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Decorative element */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-[#EDE3D8] flex items-center justify-center">
          <Coffee
            className="w-14 h-14 text-[#C4A882]"
            strokeWidth={1.2}
          />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#D4863A] flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">?</span>
        </div>
      </div>

      {/* Text */}
      <h1
        className="text-6xl font-bold text-[#2A1208] mb-3"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        404
      </h1>
      <h2
        className="text-xl font-semibold text-[#5C3A1E] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Page Not Found
      </h2>
      <p className="text-sm text-[#9C7A5B] max-w-xs leading-relaxed mb-8">
        Looks like this brew doesn't exist. The page you're looking for may have
        been moved or removed.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to={ROUTES.HOME}>
          <Button className="gap-2 bg-[#6B3F1F] hover:bg-[#5A3418] text-white">
            <MapPin className="w-4 h-4" />
            Explore the Map
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="gap-2 border-[#E8DDD0] text-[#5C3A1E] hover:bg-[#EDE3D8]"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    </div>
  )
}