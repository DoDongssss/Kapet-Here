import { useState } from "react"
import { Trash2, Plus, Loader2, ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import ImageUpload from "@/components/shared/ImageUpload"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { CoffeeShopPhoto } from "@/types/coffeeShop"

interface PhotoManagerProps {
  shopId: string
  photos: CoffeeShopPhoto[]
  onUpload: (file: File) => Promise<void>
  onDelete: (photoId: string) => Promise<void>
  isUploading?: boolean
  className?: string
}

export default function PhotoManager({
  photos,
  onUpload,
  onDelete,
  isUploading = false,
  className,
}: PhotoManagerProps) {
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<CoffeeShopPhoto | null>(null)

  const handleUpload = async () => {
    if (!pendingFile) return
    try {
      await onUpload(pendingFile)
      setPendingFile(null)
      toast.success("Photo uploaded!")
    } catch {
      toast.error("Upload failed")
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    setDeletingId(confirmDelete.id)
    try {
      await onDelete(confirmDelete.id)
      toast.success("Photo deleted")
    } catch {
      toast.error("Delete failed")
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3
        className="text-base font-semibold text-[#2A1208]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Photos
        <span className="ml-2 text-sm font-normal text-[#9C7A5B]">({photos.length})</span>
      </h3>

      {/* Existing photos grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group rounded-xl overflow-hidden border border-[#E8DDD0] bg-[#EDE3D8] aspect-square"
            >
              <img
                src={photo.image_url}
                alt="Shop photo"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Delete overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setConfirmDelete(photo)}
                  disabled={deletingId === photo.id}
                  className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  {deletingId === photo.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-[#D8C9B8] bg-[#F5F0E8]">
          <ImageOff className="w-7 h-7 text-[#C4A882]" strokeWidth={1.5} />
          <p className="text-sm text-[#9C7A5B]">No photos yet</p>
        </div>
      )}

      {/* Upload new photo */}
      <div className="space-y-3 pt-2 border-t border-[#E8DDD0]">
        <p className="text-sm font-medium text-[#5C3A1E]">Add New Photo</p>
        <ImageUpload
          value={pendingFile}
          onChange={setPendingFile}
          label=""
          previewClassName="h-36"
        />
        {pendingFile && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            size="sm"
            className="w-full bg-[#6B3F1F] hover:bg-[#5A3418] text-white gap-2"
          >
            {isUploading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
            ) : (
              <><Plus className="w-3.5 h-3.5" /> Upload Photo</>
            )}
          </Button>
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Delete this photo?"
        description="This photo will be permanently removed from the coffee shop."
        confirmLabel="Delete Photo"
        variant="danger"
        isLoading={!!deletingId}
        onConfirm={handleDelete}
      />
    </div>
  )
}