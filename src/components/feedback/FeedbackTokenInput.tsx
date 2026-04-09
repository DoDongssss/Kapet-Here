import { useState } from "react"
import { Ticket, ArrowRight, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FeedbackTokenInputProps {
  onValidToken: (token: string) => void
  isValidating?: boolean
  error?: string | null
  className?: string
}

export default function FeedbackTokenInput({
  onValidToken,
  isValidating = false,
  error = null,
  className,
}: FeedbackTokenInputProps) {
  const [token, setToken] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (token.trim()) onValidToken(token.trim().toUpperCase())
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Icon header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#EDE3D8] flex items-center justify-center mb-4 shadow-inner">
          <Ticket className="w-7 h-7 text-[#6B3F1F]" strokeWidth={1.6} />
        </div>
        <h2
          className="text-2xl font-bold text-[#2A1208]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Enter Your Token
        </h2>
        <p className="text-sm text-[#9C7A5B] mt-2 max-w-xs leading-relaxed">
          You need a one-time token from the coffee shop to submit your feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            placeholder="e.g. KAPE-ABC123"
            maxLength={32}
            disabled={isValidating}
            className={cn(
              "h-12 text-center text-base font-mono tracking-widest uppercase bg-white border-[#E8DDD0]",
              "focus:border-[#6B3F1F] focus:ring-[#6B3F1F]/20",
              error && "border-red-400 focus:border-red-400"
            )}
            style={{ fontFamily: "'DM Sans', monospace" }}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-500 text-center animate-in fade-in duration-200">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={!token.trim() || isValidating}
          className="w-full h-12 bg-[#6B3F1F] hover:bg-[#5A3418] text-white gap-2 text-sm font-semibold"
        >
          {isValidating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Validating token...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-[#C4A882] text-center mt-5">
        Each token can only be used once and expires after a set period.
      </p>
    </div>
  )
}