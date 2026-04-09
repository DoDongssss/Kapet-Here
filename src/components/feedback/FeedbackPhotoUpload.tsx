import { Camera, X } from "lucide-react"
import { useDropzone, type FileRejection } from "react-dropzone"
import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"

interface FeedbackPhotoUploadProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  disabled?: boolean
  className?: string
}

export default function FeedbackPhotoUpload({
  value,
  onChange,
  disabled = false,
  className,
}: FeedbackPhotoUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setError(null)
      if (rejected.length > 0) {
        setError(rejected[0].errors[0]?.message ?? "File not accepted")
        return
      }
      if (accepted[0]) onChange(accepted[0])
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 8 * 1024 * 1024,
    multiple: false,
    disabled,
  })

  const previewUrl =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === "string"
      ? value
      : null

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-[#5C3A1E]">
        Add a Photo{" "}
        <span className="font-normal text-[#9C7A5B]">(optional)</span>
      </p>

      {previewUrl ? (
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#E8DDD0] bg-[#EDE3D8] group">
          <img
            src={previewUrl}
            alt="Your photo"
            className="w-full h-full object-cover"
          />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#2A1208]/70 text-white flex items-center justify-center hover:bg-[#2A1208] transition-colors backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {/* <div className="absolute bottom-0 inset-x-0 bg-linear-to- from-black/40 to-transparent p-3">
            <p className="text-white text-xs">{value?.name}</p>
          </div> */}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center gap-3 h-36 rounded-xl border-2 border-dashed transition-all duration-200",
            isDragActive
              ? "border-[#6B3F1F] bg-[#EDE3D8]"
              : "border-[#D8C9B8] bg-[#F5F0E8] hover:border-[#9C7A5B] hover:bg-[#EDE3D8]",
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "cursor-pointer"
          )}
        >
          <input {...getInputProps()} />
          <div className="w-10 h-10 rounded-xl bg-[#EDE3D8] flex items-center justify-center">
            <Camera className="w-5 h-5 text-[#9C7A5B]" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#5C3A1E]">
              {isDragActive ? "Drop photo here" : "Tap to upload a photo"}
            </p>
            <p className="text-xs text-[#9C7A5B] mt-0.5">JPG, PNG, WEBP — max 8MB</p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}