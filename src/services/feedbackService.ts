import { supabase } from "@/lib/supabase"
import type { Feedback } from "@/types/feedback"

export const feedbackService = {
  async getByShopId(shopId: string): Promise<Feedback[]> {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("coffee_shop_id", shopId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data as Feedback[]
  },

  async validateToken(token: string): Promise<{ valid: boolean; shopId?: string; error?: string }> {
    const { data, error } = await supabase.rpc("use_feedback_token", {
      p_token: token,
    })
    if (error) {
      return { valid: false, error: error.message }
    }
    return { valid: true, shopId: data?.coffee_shop_id }
  },

  async submit(payload: {
    token: string
    rating: number
    comment?: string | null
    photo_url?: string | null
  }): Promise<void> {
    const { error } = await supabase.rpc("submit_feedback", {
      p_token: payload.token,
      p_rating: payload.rating,
      p_comment: payload.comment ?? null,
      p_photo_url: payload.photo_url ?? null,
    })
    if (error) throw error
  },
}