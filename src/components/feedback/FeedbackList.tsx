import { MessageSquare } from "lucide-react"
import FeedbackCard from "./FeedbackCard"
import CoffeeShopRating from "@/components/coffee-shop/CoffeeShopRating"
import EmptyState from "@/components/shared/EmptyState"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import type { Feedback } from "@/types/feedback"

interface FeedbackListProps {
  feedback: Feedback[]
  isLoading?: boolean
  className?: string
}

export default function FeedbackList({ feedback, isLoading, className }: FeedbackListProps) {
  const averageRating =
    feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
      : 0

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: feedback.filter((f) => f.rating === star).length,
  }))

  if (isLoading) {
    return <LoadingSpinner className="py-12" label="Loading reviews..." />
  }

  return (
    <div className={className}>
      {/* Rating summary card */}
      {feedback.length > 0 && (
        <div className="bg-[#EDE3D8] rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-5">
            {/* Big number */}
            <div className="flex flex-col items-center flex-shrink-0">
              <span
                className="text-5xl font-bold text-[#2A1208] leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {averageRating.toFixed(1)}
              </span>
              <CoffeeShopRating
                rating={averageRating}
                size="sm"
                showNumber={false}
                className="mt-1.5"
              />
              <span className="text-xs text-[#9C7A5B] mt-1">
                {feedback.length} {feedback.length === 1 ? "review" : "reviews"}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px self-stretch bg-[#D8C9B8]" />

            {/* Distribution bars */}
            <div className="flex-1 space-y-1.5">
              {distribution.map(({ star, count }) => {
                const pct = (count / feedback.length) * 100
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-[11px] text-[#9C7A5B] w-3 text-right flex-shrink-0">
                      {star}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-[#D8C9B8] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#D4863A] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#9C7A5B] w-4 flex-shrink-0">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {feedback.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description="Be the first to share your experience at this coffee shop."
          />
        ) : (
          feedback.map((item) => (
            <FeedbackCard key={item.id} feedback={item} />
          ))
        )}
      </div>
    </div>
  )
}