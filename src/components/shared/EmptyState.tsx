import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#EDE3D8] flex items-center justify-center">
          <Icon className="w-7 h-7 text-[#9C7A5B]" strokeWidth={1.5} />
        </div>
      )}
      <div className="space-y-1.5 max-w-xs">
        <h3
          className="text-[#3D1F0D] font-semibold text-base"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[#9C7A5B] leading-relaxed">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="bg-[#6B3F1F] hover:bg-[#5A3418] text-white mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}