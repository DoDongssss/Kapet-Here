import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useCoffeeShops } from "@/hooks/useCoffeeShops"
import TokenGenerator from "@/components/admin/TokenGenerator"
import TokenTable from "@/components/admin/TokenTable"
import PageHeader from "@/components/shared/PageHeader"
import { PageSpinner } from "@/components/shared/LoadingSpinner"
import ErrorMessage from "@/components/shared/ErrorMessage"
import { Badge } from "@/components/ui/badge"
import type { FeedbackToken } from "@/types/feedback"

export default function AdminTokensPage() {
  const { data: shops = [], isLoading: shopsLoading } = useCoffeeShops()

  const {
    data: tokens = [],
    isLoading: tokensLoading,
    error,
    refetch,
  } = useQuery<FeedbackToken[]>({
    queryKey: ["feedback_tokens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback_tokens")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as FeedbackToken[]
    },
  })

  // Build a shopId → shopName map for TokenTable
  const shopNames = Object.fromEntries(shops.map((s) => [s.id, s.name]))

  // Stats
  const activeTokens = tokens.filter((t) => {
    const expired = new Date(t.expires_at) < new Date()
    return !t.is_used && !expired
  }).length
  const usedTokens = tokens.filter((t) => t.is_used).length
  const expiredTokens = tokens.filter((t) => {
    return !t.is_used && new Date(t.expires_at) < new Date()
  }).length

  if (shopsLoading || tokensLoading) return <PageSpinner label="Loading tokens..." />

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load tokens"
        message="Could not fetch feedback tokens."
        onRetry={() => refetch()}
        className="min-h-[50vh]"
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feedback Tokens"
        subtitle="Generate one-time tokens for guests to submit reviews."
        actions={
          <div className="flex items-center gap-2">
            <Badge className="gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
              {activeTokens} active
            </Badge>
            <Badge className="gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
              {usedTokens} used
            </Badge>
            {expiredTokens > 0 && (
              <Badge className="gap-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-50">
                {expiredTokens} expired
              </Badge>
            )}
          </div>
        }
      />

      {/* Two-column: generator + info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator panel */}
        <div className="lg:col-span-1 space-y-4">
          <TokenGenerator
            shops={shops}
            onTokenGenerated={() => refetch()}
          />

          {/* How it works */}
          <div className="bg-white rounded-2xl border border-[#E8DDD0] p-4 space-y-3">
            <h3
              className="text-sm font-semibold text-[#2A1208]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              How Tokens Work
            </h3>
            <ol className="space-y-2">
              {[
                "Generate a token for a specific coffee shop.",
                "Share the token with the customer (print or message).",
                "Customer enters the token on the Feedback page.",
                "Token is marked used after one submission.",
              ].map((step, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-[#9C7A5B]">
                  <span className="w-5 h-5 rounded-full bg-[#EDE3D8] text-[#6B3F1F] font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Token table */}
        <div className="lg:col-span-2">
          <TokenTable tokens={tokens} shopNames={shopNames} />
        </div>
      </div>
    </div>
  )
}