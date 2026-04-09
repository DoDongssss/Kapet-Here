import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  actions?: ReactNode
  className?: string
}

export default function PageHeader({
  title,
  subtitle,
  backHref,
  actions,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className={cn(
      "flex items-start justify-between gap-4 mb-6 md:mb-8",
      className
    )}>
      <div className="flex items-start gap-3 min-w-0">
        {backHref && (
          <button
            onClick={() => navigate(backHref)}
            className="mt-0.5 w-8 h-8 rounded-lg border border-[#E8DDD0] bg-white flex items-center justify-center text-[#9C7A5B] hover:bg-[#EDE3D8] hover:text-[#5C3A1E] transition-colors shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <div className="min-w-0">
          <h1
            className="text-xl md:text-2xl font-bold text-[#2A1208] leading-tight truncate"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-[#9C7A5B] mt-0.5 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}