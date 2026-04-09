import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCoffeeShops } from "@/hooks/useCoffeeShops"
import { coffeeShopService } from "@/services/coffeeShopService"
import CoffeeShopTable from "@/components/admin/CoffeeShopTable"
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog"
import PageHeader from "@/components/shared/PageHeader"
import { PageSpinner } from "@/components/shared/LoadingSpinner"
import ErrorMessage from "@/components/shared/ErrorMessage"
import { ROUTES } from "@/constants/routes"
import type { CoffeeShop } from "@/types/coffeeShop"

export default function AdminShopsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: shops = [], isLoading, error, refetch } = useCoffeeShops()
  const [shopToDelete, setShopToDelete] = useState<CoffeeShop | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!shopToDelete) return
    setIsDeleting(true)
    try {
      await coffeeShopService.delete(shopToDelete.id)
      queryClient.invalidateQueries({ queryKey: ["coffee_shops"] })
      toast.success(`"${shopToDelete.name}" deleted successfully`)
      setShopToDelete(null)
    } catch {
      toast.error("Failed to delete coffee shop. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) return <PageSpinner label="Loading coffee shops..." />

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load shops"
        message="Could not fetch coffee shops from the database."
        onRetry={() => refetch()}
        className="min-h-[50vh]"
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coffee Shops"
        subtitle={`${shops.length} shop${shops.length !== 1 ? "s" : ""} in South Cotabato`}
        actions={
          <Button
            onClick={() => navigate(ROUTES.ADMIN.SHOP_NEW)}
            className="gap-2 bg-[#6B3F1F] hover:bg-[#5A3418] text-white"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Add Shop
          </Button>
        }
      />

      <CoffeeShopTable
        shops={shops}
        onDelete={(shop) => setShopToDelete(shop)}
      />

      <DeleteConfirmDialog
        shop={shopToDelete}
        onOpenChange={(open) => !open && setShopToDelete(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}