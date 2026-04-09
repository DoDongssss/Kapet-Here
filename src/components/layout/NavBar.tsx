import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { MapPin, Menu, X, Coffee } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Explore Map",      href: ROUTES.HOME     },
    { label: "Submit Feedback",  href: ROUTES.FEEDBACK },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled || menuOpen
            ? "bg-[#FAF7F2]/98 backdrop-blur-md shadow-sm border-b border-[#E8DDD0]"
            : "bg-[#FAF7F2]/80 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">

            {/* ── Logo ── */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group shrink-0">
              <div className="relative">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#6B3F1F] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <Coffee className="w-4 h-4 text-[#FAF7F2]" strokeWidth={1.8} />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#D4863A] rounded-full border-2 border-[#FAF7F2]" />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-[#3D1F0D] font-bold tracking-tight text-[1rem] md:text-[1.1rem]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Kape't Here
                </span>
                <span className="text-[9px] md:text-[10px] text-[#9C7A5B] tracking-widest uppercase font-medium">
                  South Cotabato
                </span>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    location.pathname === link.href
                      ? "bg-[#6B3F1F] text-[#FAF7F2]"
                      : "text-[#5C3A1E] hover:bg-[#EDE3D8] hover:text-[#3D1F0D]"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="w-px h-5 bg-[#D8C9B8] mx-2" />

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDE3D8] text-[#6B3F1F] text-xs font-medium">
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                <span>South Cotabato</span>
              </div>
            </nav>

            {/* ── Mobile: location pill + hamburger ── */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EDE3D8] text-[#6B3F1F]">
                <MapPin className="w-3 h-3" strokeWidth={2} />
                <span className="text-[10px] font-semibold">South Cotabato</span>
              </div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-[#5C3A1E] hover:bg-[#EDE3D8] transition-colors"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen
                  ? <X className="w-4.5 h-4.5" />
                  : <Menu className="w-4.5 h-4.5" />
                }
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile dropdown menu ── */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            menuOpen ? "max-h-52 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          )}
        >
          <div className="border-t border-[#E8DDD0] bg-[#FAF7F2] px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  location.pathname === link.href
                    ? "bg-[#6B3F1F] text-[#FAF7F2]"
                    : "text-[#5C3A1E] hover:bg-[#EDE3D8]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Spacer — matches header height */}
      <div className="h-14 md:h-16" />
    </>
  )
}