import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Coffee,
  LayoutDashboard,
  MapPin,
  Ticket,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"

const navItems = [
  {
    label: "Dashboard",
    href: ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Coffee Shops",
    href: ROUTES.ADMIN.SHOPS,
    icon: MapPin,
  },
  {
    label: "Feedback Tokens",
    href: ROUTES.ADMIN.TOKENS,
    icon: Ticket,
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate(ROUTES.ADMIN.LOGIN)
      toast.success("Signed out successfully")
    } catch {
      toast.error("Failed to sign out")
    }
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#2A1208] flex flex-col z-40 shadow-xl">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#3D1F0D]">
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#6B3F1F] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Coffee className="w-4.5 h-4.5 text-[#FAF7F2]" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-[#FAF7F2] font-bold"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}
            >
              Kape't Here
            </span>
            <span className="text-[10px] text-[#7A5C3A] tracking-widest uppercase">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-[#5C3A1E] uppercase tracking-widest font-semibold px-3 mb-3">
          Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          // Active if path starts with the href (handles nested routes)
          const isActive =
            location.pathname === item.href ||
            (item.href !== ROUTES.ADMIN.DASHBOARD &&
              location.pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-[#6B3F1F] text-[#FAF7F2] shadow-md"
                  : "text-[#9C7A5B] hover:bg-[#3D1F0D] hover:text-[#D4A574]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4.5 h-4.5 shrink-0 transition-colors",
                    isActive ? "text-[#D4A574]" : "text-[#7A5C3A] group-hover:text-[#D4A574]"
                  )}
                  strokeWidth={1.8}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-[#D4A574] opacity-70" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info + Sign Out */}
      <div className="border-t border-[#3D1F0D] p-3 space-y-1">
        {user && (
          <div className="px-3 py-2.5 rounded-xl bg-[#1A0A03]">
            <p className="text-[10px] text-[#5C3A1E] uppercase tracking-widest mb-0.5">
              Signed in as
            </p>
            <p className="text-xs text-[#D4A574] font-medium truncate">
              {user.email}
            </p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#9C7A5B] hover:bg-[#3D1F0D] hover:text-[#E57373] transition-all duration-200 group"
        >
          <LogOut
            className="w-4.5 h-4.5 shrink-0 text-[#7A5C3A] group-hover:text-[#E57373] transition-colors"
            strokeWidth={1.8}
          />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}