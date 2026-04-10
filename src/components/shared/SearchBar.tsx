import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search coffee shops...",
  className,
  autoFocus = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-200",
        isFocused
          ? "border-[#6B3F1F] shadow-sm shadow-[#6B3F1F]/10 ring-2 ring-[#6B3F1F]/10"
          : "backdrop-blur-md bg-white/40 border-white/30 shadow-sm transition-all",
        className
      )}
    >
      <Search
        className={cn(
          "w-4 h-4 shrink-0 transition-colors",
          isFocused ? "text-[#6B3F1F]" : "text-[#C4A882]"
        )}
        strokeWidth={2}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-[#3D1F0D] placeholder-[#C4A882] outline-none min-w-0"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="w-5 h-5 rounded-full bg-[#EDE3D8] text-[#9C7A5B] flex items-center justify-center hover:bg-[#D8C9B8] transition-colors shrink-0"
          aria-label="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}