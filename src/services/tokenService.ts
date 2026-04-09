import { supabase } from "@/lib/supabase"
import type { FeedbackToken } from "@/types/feedback"

export const tokenService = {
  async generate(shopId: string): Promise<string> {
    const { data, error } = await supabase.rpc("generate_feedback_token", {
      p_coffee_shop_id: shopId,
    })
    if (error) throw error
    return data as string
  },

  async getAll(): Promise<FeedbackToken[]> {
    const { data, error } = await supabase
      .from("feedback_tokens")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) throw error
    return data as FeedbackToken[]
  },

  async getByShop(shopId: string): Promise<FeedbackToken[]> {
    const { data, error } = await supabase
      .from("feedback_tokens")
      .select("*")
      .eq("coffee_shop_id", shopId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data as FeedbackToken[]
  },
}