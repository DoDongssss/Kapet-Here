import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  label?: string
  className?: string
}

const sizeMap = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
}

export default function LoadingSpinner({
  size = "md",
  label = "Loading...",
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full border-[#E8DDD0] border-t-[#6B3F1F] animate-spin",
          sizeMap[size]
        )}
        role="status"
        aria-label={label}
      />
      {label && (
        <p className="text-sm text-[#9C7A5B] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </p>
      )}
    </div>
  )
}

/** Full-page centered spinner */
export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" label={label ?? "Loading..."} />
    </div>
  )
}