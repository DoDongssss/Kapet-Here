import { useState } from "react"
import { uploadCoffeeShopImage } from "@/lib/supabaseStorage"

interface UseImageUploadReturn {
  upload: (shopId: string, file: File) => Promise<string>
  isUploading: boolean
  error: string | null
  reset: () => void
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (shopId: string, file: File): Promise<string> => {
    setIsUploading(true)
    setError(null)
    try {
      const url = await uploadCoffeeShopImage(shopId, file)
      return url
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed"
      setError(msg)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const reset = () => {
    setError(null)
    setIsUploading(false)
  }

  return { upload, isUploading, error, reset }
}