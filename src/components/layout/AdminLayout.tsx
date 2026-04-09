import { useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import { ROUTES } from "@/constants/routes"
import Sidebar from "./Sidebar"

export default function AdminLayout() {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#6B3F1F] border-t-transparent animate-spin" />
          <p className="text-sm text-[#9C7A5B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Verifying session...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN.LOGIN} replace />
  }

  return (
    <div className="min-h-screen flex bg-[#F5F0E8] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-64">
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}