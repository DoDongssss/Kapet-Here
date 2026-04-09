import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCoffeeShop } from "@/hooks/useCoffeeShop"
import { useImageUpload } from "@/hooks/useImageUpload"
import { coffeeShopService } from "@/services/coffeeShopService"
import { photoService } from "@/services/photoService"
import CoffeeShopForm, { type CoffeeShopFormValues } from "@/components/admin/CoffeeShopForm"
import PhotoManager from "@/components/admin/PhotoManager"
import PageHeader from "@/components/shared/PageHeader"
import { PageSpinner } from "@/components/shared/LoadingSpinner"
import ErrorMessage from "@/components/shared/ErrorMessage"
import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/constants/routes"

export default function AdminShopEditPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: shop, isLoading, error } = useCoffeeShop(id)
  const { upload, isUploading } = useImageUpload()
  const [isSaving, setIsSaving] = useState(false)

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["coffee_shops"] })
    queryClient.invalidateQueries({ queryKey: ["coffee_shop", id] })
  }

  const handleSubmit = async (values: CoffeeShopFormValues) => {
    setIsSaving(true)
    try {
      if (isEditing && id) {
        await coffeeShopService.update(id, values)
        toast.success("Coffee shop updated!")
      } else {
        const created = await coffeeShopService.create(values)
        toast.success("Coffee shop added!")
        invalidate()
        navigate(`/admin/shops/${created.id}/edit`, { replace: true })
        return
      }
      invalidate()
    } catch {
      toast.error("Failed to save. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoUpload = async (file: File) => {
    if (!id && !shop?.id) {
      toast.error("Save the shop first before uploading photos.")
      return
    }
    const shopId = id ?? shop!.id
    await upload(shopId, file)

    // Insert photo record into DB
    await photoService.upload(shopId, file)
    invalidate()
  }

  const handlePhotoDelete = async (photoId: string) => {
    const photo = shop?.coffee_shop_photos?.find((p) => p.id === photoId)
    if (!photo) return
    await photoService.delete(photoId, photo.image_url)
    invalidate()
  }

  if (isEditing && isLoading) return <PageSpinner label="Loading shop..." />

  if (isEditing && error) {
    return (
      <ErrorMessage
        title="Shop not found"
        message="This coffee shop doesn't exist or was removed."
        onRetry={() => navigate(ROUTES.ADMIN.SHOPS)}
        className="min-h-[50vh]"
      />
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title={isEditing ? `Edit: ${shop?.name ?? "…"}` : "Add Coffee Shop"}
        subtitle={
          isEditing
            ? "Update the details for this coffee shop."
            : "Fill in the details to add a new coffee shop to the map."
        }
        backHref={ROUTES.ADMIN.SHOPS}
      />

      {/* Shop details form */}
      <CoffeeShopForm
        defaultValues={shop}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />

      {/* Photo management — only available after shop is created */}
      {isEditing && shop && (
        <>
          <Separator className="bg-[#E8DDD0]" />
          <div className="bg-white rounded-2xl border border-[#E8DDD0] p-6">
            <PhotoManager
              shopId={shop.id}
              photos={shop.coffee_shop_photos ?? []}
              onUpload={handlePhotoUpload}
              onDelete={handlePhotoDelete}
              isUploading={isUploading}
            />
          </div>
        </>
      )}

      {!isEditing && (
        <p className="text-xs text-[#9C7A5B] text-center">
          💡 You can add photos after saving the coffee shop.
        </p>
      )}
    </div>
  )
}