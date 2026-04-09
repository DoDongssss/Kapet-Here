import { MapPin, MessageSquare, Ticket, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stat {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  bg: string
  sub?: string
}

interface AdminStatsProps {
  totalShops: number
  totalFeedback: number
  totalTokens: number
  usedTokens: number
  averageRating: number
  className?: string
}

export default function AdminStats({
  totalShops,
  totalFeedback,
  totalTokens,
  usedTokens,
  averageRating,
  className,
}: AdminStatsProps) {
  const stats: Stat[] = [
    {
      label: "Coffee Shops",
      value: totalShops,
      icon: MapPin,
      color: "text-[#6B3F1F]",
      bg: "bg-[#EDE3D8]",
    },
    {
      label: "Total Reviews",
      value: totalFeedback,
      icon: MessageSquare,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Tokens Generated",
      value: totalTokens,
      icon: Ticket,
      color: "text-blue-700",
      bg: "bg-blue-50",
      sub: `${usedTokens} used`,
    },
    {
      label: "Avg. Rating",
      value: averageRating > 0 ? averageRating.toFixed(1) : "—",
      icon: Star,
      color: "text-[#D4863A]",
      bg: "bg-amber-50",
      sub: "out of 5.0",
    },
  ]

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#E8DDD0] p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
              <Icon className={cn("w-5 h-5", stat.color)} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xs text-[#9C7A5B] font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <p
                className="text-3xl font-bold text-[#2A1208] mt-0.5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </p>
              {stat.sub && (
                <p className="text-xs text-[#C4A882] mt-0.5">{stat.sub}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}