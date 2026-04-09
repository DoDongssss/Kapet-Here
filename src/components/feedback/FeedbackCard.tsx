import { format } from "date-fns"
import { MessageSquare } from "lucide-react"
import CoffeeShopRating from "@/components/coffee-shop/CoffeeShopRating"
import { cn } from "@/lib/utils"
import type { Feedback } from "@/types/feedback"

interface FeedbackCardProps {
  feedback: Feedback
  className?: string
}

export default function FeedbackCard({ feedback, className }: FeedbackCardProps) {
  const createdAt = feedback.created_at
    ? format(new Date(feedback.created_at), "MMM d, yyyy")
    : null

  return (
    <div className={cn(
      "bg-white border border-[#E8DDD0] rounded-2xl p-4 space-y-3",
      "active:bg-[#FAF7F2] transition-colors",
      className
    )}>
      {/* Top: rating + date */}
      <div className="flex items-center justify-between gap-2">
        <CoffeeShopRating rating={feedback.rating} size="sm" showNumber={false} />
        {createdAt && (
          <span className="text-xs text-[#C4A882] flex-shrink-0">{createdAt}</span>
        )}
      </div>

      {/* Comment */}
      {feedback.comment ? (
        <div className="flex gap-2 items-start">
          <MessageSquare className="w-3.5 h-3.5 text-[#C4A882] flex-shrink-0 mt-0.5" strokeWidth={1.8} />
          <p className="text-sm text-[#3D1F0D] leading-relaxed">{feedback.comment}</p>
        </div>
      ) : (
        <p className="text-xs text-[#C4A882] italic">No written comment.</p>
      )}

      {/* Photo — full width, natural aspect ratio */}
      {feedback.photo_url && (
        <div className="rounded-xl overflow-hidden border border-[#E8DDD0]">
          <img
            src={feedback.photo_url}
            alt="Customer photo"
            className="w-full object-cover max-h-52"
            loading="lazy"
          />
        </div>
      )}
    </div>
  )
}