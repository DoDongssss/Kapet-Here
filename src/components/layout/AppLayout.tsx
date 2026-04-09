import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./NavBar"
import Footer from "./Footer"

export default function AppLayout() {
  const { pathname } = useLocation()
  const isMapPage = pathname === "/" || pathname === "/home"

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] font-sans">
      {/* On map page: hide navbar on mobile, show on desktop */}
      <div className={isMapPage ? "hidden md:block" : "block"}>
        <Navbar />
      </div>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {!isMapPage && <Footer />}
    </div>
  )
}