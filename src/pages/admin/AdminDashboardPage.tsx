import { useNavigate } from "react-router-dom"
import { Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCoffeeShops } from "@/hooks/useCoffeeShops"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/store/useAuthStore"
import AdminStats from "@/components/admin/AdminStats"
import TokenGenerator from "@/components/admin/TokenGenerator"
import PageHeader from "@/components/shared/PageHeader"
import { PageSpinner } from "@/components/shared/LoadingSpinner"
import { ROUTES } from "@/constants/routes"
import type { Feedback } from "@/types/feedback"
import type { FeedbackToken } from "@/types/feedback"

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: shops = [], isLoading: shopsLoading } = useCoffeeShops()

  const { data: feedback = [] } = useQuery<Feedback[]>({
    queryKey: ["all_feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
      if (error) throw error
      return data as Feedback[]
    },
  })

  const { data: tokens = [], refetch: refetchTokens } = useQuery<FeedbackToken[]>({
    queryKey: ["feedback_tokens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback_tokens")
        .select("*")
      if (error) throw error
      return data as FeedbackToken[]
    },
  })

  const averageRating =
    feedback.length > 0
      ? feedback.reduce((s, f) => s + f.rating, 0) / feedback.length
      : 0

  const usedTokens = tokens.filter((t) => t.is_used).length

  if (shopsLoading) return <PageSpinner label="Loading dashboard..." />

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle={`${greeting}${user?.email ? `, ${user.email.split("@")[0]}` : ""}! Here's your overview.`}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(ROUTES.ADMIN.SHOP_NEW)}
              className="gap-2 bg-[#6B3F1F] hover:bg-[#5A3418] text-white"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Add Shop
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <AdminStats
        totalShops={shops.length}
        totalFeedback={feedback.length}
        totalTokens={tokens.length}
        usedTokens={usedTokens}
        averageRating={averageRating}
      />

      {/* Two-column: Token generator + Recent shops */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Token generator */}
        <div className="space-y-3">
          <h2
            className="text-base font-semibold text-[#2A1208]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quick Token
          </h2>
          <TokenGenerator
            shops={shops}
            onTokenGenerated={() => refetchTokens()}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN.TOKENS)}
            className="gap-1.5 text-[#6B3F1F] hover:bg-[#EDE3D8] w-full justify-between"
          >
            View all tokens
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Recent coffee shops */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2
              className="text-base font-semibold text-[#2A1208]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Recent Shops
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN.SHOPS)}
              className="gap-1 text-[#6B3F1F] hover:bg-[#EDE3D8] text-xs"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden">
            {shops.slice(0, 5).map((shop, idx) => (
              <div
                key={shop.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-[#FAF7F2] transition-colors cursor-pointer ${
                  idx < shops.slice(0, 5).length - 1 ? "border-b border-[#F0E8DF]" : ""
                }`}
                onClick={() => navigate(`/admin/shops/${shop.id}/edit`)}
              >
                <div className="w-8 h-8 rounded-lg bg-[#EDE3D8] flex items-center justify-center flex-shrink-0">
                  <span
                    className="text-sm font-bold text-[#6B3F1F]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {shop.name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2A1208] truncate">{shop.name}</p>
                  <p className="text-xs text-[#9C7A5B] truncate">{shop.location}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#C4A882] flex-shrink-0" />
              </div>
            ))}

            {shops.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-[#9C7A5B]">No coffee shops added yet.</p>
                <Button
                  size="sm"
                  onClick={() => navigate(ROUTES.ADMIN.SHOP_NEW)}
                  className="mt-3 bg-[#6B3F1F] hover:bg-[#5A3418] text-white gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Shop
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}