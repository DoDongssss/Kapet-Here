import { format } from "date-fns"
import { CheckCircle2, Clock, XCircle, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import EmptyState from "@/components/shared/EmptyState"
import { cn } from "@/lib/utils"
import type { FeedbackToken } from "@/types/feedback"

interface TokenTableProps {
  tokens: FeedbackToken[]
  shopNames?: Record<string, string>
  className?: string
}

function TokenStatusBadge({ token }: { token: FeedbackToken }) {
  const now = new Date()
  const expired = new Date(token.expires_at) < now && !token.is_used

  if (token.is_used) {
    return (
      <Badge className="gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
        <CheckCircle2 className="w-3 h-3" /> Used
      </Badge>
    )
  }
  if (expired) {
    return (
      <Badge className="gap-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-50">
        <XCircle className="w-3 h-3" /> Expired
      </Badge>
    )
  }
  return (
    <Badge className="gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
      <Clock className="w-3 h-3" /> Active
    </Badge>
  )
}

export default function TokenTable({ tokens, shopNames = {}, className }: TokenTableProps) {
  if (tokens.length === 0) {
    return (
      <EmptyState
        icon={Ticket}
        title="No tokens yet"
        description="Generate a token for a coffee shop to get started."
        className={className}
      />
    )
  }

  return (
    <div className={cn("bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8DDD0] bg-[#FAF7F2]">
              {["Token", "Coffee Shop", "Status", "Expires", "Used At"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-[#5C3A1E] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E8DF]">
            {tokens.map((token) => (
              <tr key={token.id} className="hover:bg-[#FAF7F2] transition-colors">
                <td className="px-4 py-3">
                  <code className="text-xs font-mono font-semibold text-[#3D1F0D] bg-[#F5F0E8] px-2 py-1 rounded-md">
                    {token.token}
                  </code>
                </td>
                <td className="px-4 py-3 text-[#5C3A1E] text-xs">
                  {shopNames[token.coffee_shop_id] ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <TokenStatusBadge token={token} />
                </td>
                <td className="px-4 py-3 text-xs text-[#9C7A5B]">
                  {format(new Date(token.expires_at), "MMM d, yyyy")}
                </td>
                <td className="px-4 py-3 text-xs text-[#9C7A5B]">
                  {token.used_at
                    ? format(new Date(token.used_at), "MMM d, yyyy")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-[#F0E8DF] bg-[#FAF7F2]">
          <p className="text-xs text-[#C4A882]">{tokens.length} total tokens</p>
        </div>
      </div>
    </div>
  )
}