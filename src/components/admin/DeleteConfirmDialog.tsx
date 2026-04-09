import ConfirmDialog from "@/components/shared/ConfirmDialog"
import type { CoffeeShop } from "@/types/coffeeShop"

interface DeleteConfirmDialogProps {
  shop: CoffeeShop | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading?: boolean
}

export default function DeleteConfirmDialog({
  shop,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  return (
    <ConfirmDialog
      open={!!shop}
      onOpenChange={onOpenChange}
      title={`Delete "${shop?.name}"?`}
      description="This will permanently delete the coffee shop, all its photos, and associated feedback tokens. This action cannot be undone."
      confirmLabel="Delete Shop"
      cancelLabel="Keep It"
      variant="danger"
      isLoading={isLoading}
      onConfirm={onConfirm}
    />
  )
}