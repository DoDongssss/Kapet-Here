import { useState } from "react"
import { Ticket, Loader2, Copy, CheckCheck, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGenerateToken } from "@/hooks/useGenerateToken"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { CoffeeShop } from "@/types/coffeeShop"

interface TokenGeneratorProps {
  shops: CoffeeShop[]
  onTokenGenerated?: () => void
  className?: string
}

export default function TokenGenerator({ shops, onTokenGenerated, className }: TokenGeneratorProps) {
  const [selectedShopId, setSelectedShopId] = useState<string>("")
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { mutate: generateToken, isPending } = useGenerateToken()

  const handleGenerate = () => {
    if (!selectedShopId) return
    generateToken(selectedShopId, {
    onSuccess: (token: string) => {
      setGeneratedToken(token)
      onTokenGenerated?.()
      toast.success("Token generated successfully!")
    },
    onError: () => toast.error("Failed to generate token"),
  })
  }

  const handleCopy = async () => {
    if (!generatedToken) return
    await navigator.clipboard.writeText(generatedToken)
    setCopied(true)
    toast.success("Token copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setGeneratedToken(null)
    setCopied(false)
  }

  return (
    <div className={cn("bg-white rounded-2xl border border-[#E8DDD0] p-5 space-y-4", className)}>
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#EDE3D8] flex items-center justify-center">
          <Ticket className="w-4.5 h-4.5 text-[#6B3F1F]" strokeWidth={1.8} />
        </div>
        <div>
          <h3
            className="text-sm font-semibold text-[#2A1208]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Generate Feedback Token
          </h3>
          <p className="text-xs text-[#9C7A5B]">One-time use token for guests</p>
        </div>
      </div>

      {/* Shop selector */}
      <Select value={selectedShopId} onValueChange={setSelectedShopId} disabled={isPending}>
        <SelectTrigger className="bg-white border-[#E8DDD0] text-[#3D1F0D] focus:ring-[#6B3F1F]/20">
          <SelectValue placeholder="Select a coffee shop..." />
        </SelectTrigger>
        <SelectContent className="bg-white border-[#E8DDD0]">
          {shops.map((shop) => (
            <SelectItem
              key={shop.id}
              value={shop.id}
              className="text-[#3D1F0D] focus:bg-[#EDE3D8]"
            >
              {shop.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Generated token display */}
      {generatedToken && (
        <div className="p-4 rounded-xl bg-[#F5F0E8] border border-[#D8C9B8] space-y-2 animate-in fade-in duration-200">
          <p className="text-xs text-[#9C7A5B] font-medium">Generated Token</p>
          <div className="flex items-center gap-2">
            <code
              className="flex-1 text-sm font-mono font-semibold text-[#2A1208] tracking-widest bg-white px-3 py-2 rounded-lg border border-[#E8DDD0] truncate"
            >
              {generatedToken}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className={cn(
                "shrink-0 gap-1.5 border-[#E8DDD0]",
                copied
                  ? "text-green-600 border-green-200 bg-green-50"
                  : "text-[#5C3A1E] hover:bg-[#EDE3D8]"
              )}
            >
              {copied ? (
                <><CheckCheck className="w-3.5 h-3.5" /> Copied</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy</>
              )}
            </Button>
          </div>
          <p className="text-xs text-[#C4A882]">
            Share this token with the customer. It expires in 7 days.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleGenerate}
          disabled={!selectedShopId || isPending}
          className="flex-1 bg-[#6B3F1F] hover:bg-[#5A3418] text-white gap-2"
          size="sm"
        >
          {isPending ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
          ) : (
            <><Ticket className="w-3.5 h-3.5" /> Generate Token</>
          )}
        </Button>
        {generatedToken && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="border-[#E8DDD0] text-[#9C7A5B] hover:bg-[#EDE3D8]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}