import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { uploadFeedbackPhoto } from "@/lib/supabaseStorage"
// import type { SubmitFeedbackPayload } from "@/types/feedback"

interface SubmitFeedbackArgs {
  token: string
  rating: number
  comment?: string
  photo: File | null
}

async function submitFeedback({
  token,
  rating,
  comment,
  photo,
}: SubmitFeedbackArgs): Promise<void> {
  // 1. Upload photo first if provided
  let photo_url: string | null = null
  if (photo) {
    photo_url = await uploadFeedbackPhoto(token, photo)
  }

  // 2. Call the submit_feedback RPC
  const { error } = await supabase.rpc("submit_feedback", {
    p_token: token.toLowerCase(),
    p_rating: rating,
    p_comment: comment ?? null,
    p_photo_url: photo_url,
  })

  if (error) throw error
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      // Invalidate feedback queries so lists refresh
      queryClient.invalidateQueries({ queryKey: ["feedback"] })
    },
  })
}