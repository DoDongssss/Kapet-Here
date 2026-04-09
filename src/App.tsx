import { Routes, Route } from "react-router-dom"
import { ROUTES } from "@/constants/routes"

// Public pages
import HomePage from "@/pages/HomePage"
import CoffeeShopPage from "@/pages/CoffeeShopPage"
import FeedbackPage from "@/pages/FeedbackPage"
import NotFoundPage from "@/pages/NotFoundPage"

// Admin pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage"
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage"
import AdminShopsPage from "@/pages/admin/AdminShopsPage"
import AdminShopEditPage from "@/pages/admin/AdminShopEditPage"
import AdminTokensPage from "@/pages/admin/AdminTokensPage"

// Layouts
import AppLayout from "@/components/layout/AppLayout"
import AdminLayout from "@/components/layout/AdminLayout"

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.COFFEE_SHOP} element={<CoffeeShopPage />} />
        <Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} />
      </Route>

      {/* Admin routes */}
      <Route path={ROUTES.ADMIN.LOGIN} element={<AdminLoginPage />} />
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboardPage />} />
        <Route path={ROUTES.ADMIN.SHOPS} element={<AdminShopsPage />} />
        <Route path={ROUTES.ADMIN.SHOP_NEW} element={<AdminShopEditPage />} />
        <Route path={ROUTES.ADMIN.SHOP_EDIT} element={<AdminShopEditPage />} />
        <Route path={ROUTES.ADMIN.TOKENS} element={<AdminTokensPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App