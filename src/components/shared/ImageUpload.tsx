import { useCallback, useState } from "react"
import { useDropzone, type FileRejection } from "react-dropzone"
import { Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  label?: string
  maxSizeMB?: number
  className?: string
  previewClassName?: string
  disabled?: boolean
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload image",
  maxSizeMB = 5,
  className,
  previewClassName,
  disabled = false,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
        setError(null)
        if (rejected.length > 0) {
        setError(rejected[0].errors[0]?.message ?? "Invalid file")
        return
        }
        if (accepted[0]) onChange(accepted[0])
    },
    [onChange]
    )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    disabled,
  })

  // Resolve preview URL
  const previewUrl =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === "string"
      ? value
      : null

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <p className="text-sm font-medium text-[#5C3A1E]">{label}</p>
      )}

      {previewUrl ? (
        <div className={cn("relative rounded-xl overflow-hidden border border-[#E8DDD0] bg-[#EDE3D8]", previewClassName ?? "h-48")}>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#2A1208]/70 text-white flex items-center justify-center hover:bg-[#2A1208] transition-colors backdrop-blur-sm"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
            previewClassName ?? "h-48",
            isDragActive
              ? "border-[#6B3F1F] bg-[#EDE3D8]"
              : "border-[#D8C9B8] bg-[#F5F0E8] hover:border-[#9C7A5B] hover:bg-[#EDE3D8]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-xl bg-[#EDE3D8] flex items-center justify-center">
            {isDragActive ? (
              <Upload className="w-5 h-5 text-[#6B3F1F]" />
            ) : (
              <ImageIcon className="w-5 h-5 text-[#9C7A5B]" strokeWidth={1.5} />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#5C3A1E]">
              {isDragActive ? "Drop image here" : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-[#9C7A5B] mt-0.5">
              JPG, PNG, WEBP — max {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}