export const ROUTES = {
  HOME: "/",
  COFFEE_SHOP: "/shop/:id",
  FEEDBACK: "/feedback",
  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    SHOPS: "/admin/shops",
    SHOP_NEW: "/admin/shops/new",
    SHOP_EDIT: "/admin/shops/:id/edit",
    TOKENS: "/admin/tokens",
  },
} as const

export function coffeeShopPath(id: string) {
  return `/shop/${id}`
}

export function adminShopEditPath(id: string) {
  return `/admin/shops/${id}/edit`
}