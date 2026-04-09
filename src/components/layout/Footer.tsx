import { Link } from "react-router-dom"
import { Coffee, MapPin, Heart, ArrowUpRight } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function Footer() {
  return (
    <footer className="bg-[#2A1208] text-[#C4A882]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main grid ── */}
        <div className="py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#6B3F1F] flex items-center justify-center shrink-0">
                <Coffee className="w-4 h-4 text-[#FAF7F2]" strokeWidth={1.8} />
              </div>
              <span
                className="text-[#FAF7F2] font-bold text-lg"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Kape't Here
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#7A5C3A] max-w-xs">
              Discover the finest coffee shops across South Cotabato. Explore,
              visit, and share your experience with the community.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#5C3A1E]">
              <MapPin className="w-3.5 h-3.5 text-[#7A5C3A]" />
              <span>South Cotabato, Philippines</span>
            </div>
          </div>

          {/* Explore links */}
          <div className="space-y-4">
            <h3
              className="text-[#FAF7F2] text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to={ROUTES.HOME}
                  className="group flex items-center gap-1.5 text-sm text-[#7A5C3A] hover:text-[#D4863A] transition-colors duration-200"
                >
                  Coffee Shop Map
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.FEEDBACK}
                  className="group flex items-center gap-1.5 text-sm text-[#7A5C3A] hover:text-[#D4863A] transition-colors duration-200"
                >
                  Submit Feedback
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-5 border-t border-[#3D1F0D] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#4A2810]">
            © {new Date().getFullYear()} Kape't Here. All rights reserved.
          </p>
          <p className="text-xs text-[#4A2810] flex items-center gap-1">
            Made with{" "}
            <Heart className="w-3 h-3 text-[#D4863A] fill-[#D4863A] mx-0.5" />
            for coffee lovers in South Cotabato
          </p>
        </div>

      </div>
    </footer>
  )
}