export interface Feedback {
  id: string
  coffee_shop_id: string
  token_id: string
  rating: number
  comment: string | null
  photo_url: string | null
  created_at?: string
}

export interface FeedbackToken {
  id: string
  coffee_shop_id: string
  token: string
  is_used: boolean
  expires_at: string
  used_at: string | null
  created_at?: string
}

export interface SubmitFeedbackPayload {
  token: string
  rating: number
  comment?: string
  photo_url?: string | null
}