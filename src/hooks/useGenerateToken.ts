import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

async function generateFeedbackToken(shopId: string): Promise<string> {
  const { data, error } = await supabase.rpc("generate_feedback_token", {
    p_coffee_shop_id: shopId,
  })

  if (error) throw error
  return data as string
}

export function useGenerateToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateFeedbackToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback_tokens"] })
    },
  })
}