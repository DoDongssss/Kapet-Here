import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Feedback } from "@/types/feedback"

async function fetchFeedback(shopId: string): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("coffee_shop_id", shopId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Feedback[]
}

export function useFeedback(shopId?: string) {
  return useQuery({
    queryKey: ["feedback", shopId],
    queryFn: () => fetchFeedback(shopId!),
    enabled: !!shopId,
    staleTime: 1000 * 60 * 2,
  })
}