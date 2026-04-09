import { useState } from "react"
// import { useSearchParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import FeedbackTokenInput from "@/components/feedback/FeedbackTokenInput"
import FeedbackForm from "@/components/feedback/FeedbackForm"
import { Coffee } from "lucide-react"

interface ValidatedToken {
  token: string
  shopId: string
  shopName: string
}

export default function FeedbackPage() {
  // const [searchParams] = useSearchParams()
  const [validated, setValidated] = useState<ValidatedToken | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Support ?token=XXX pre-fill from QR codes
  // const prefilledToken = searchParams.get("token") ?? ""

  const handleTokenSubmit = async (token: string) => {
    setIsValidating(true)
    setError(null)

    try {
      // Check token exists, not used, not expired
      const { data, error: rpcError } = await supabase.rpc("validate_feedback_token", {
        p_token: token.toLowerCase(),
      })

      if (rpcError) {
        // Parse common error messages into friendly strings
        if (rpcError.message.includes("not found")) {
          setError("Token not found. Please check and try again.")
        } else if (rpcError.message.includes("already used")) {
          setError("This token has already been used.")
        } else if (rpcError.message.includes("expired")) {
          setError("This token has expired.")
        } else {
          setError("Invalid token. Please check and try again.")
        }
        return
      }

      // Fetch the shop name for display
      const shopId = data?.coffee_shop_id
      if (!shopId) {
        setError("Token is valid but couldn't identify the coffee shop.")
        return
      }

      const { data: shop, error: shopError } = await supabase
        .from("coffee_shops")
        .select("name")
        .eq("id", shopId)
        .single()

      if (shopError || !shop) {
        setError("Could not load coffee shop details.")
        return
      }

      setValidated({ token, shopId, shopName: shop.name })
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Page hero strip */}
      <div className="bg-[#2A1208] py-10 px-4">
        <div className="max-w-lg mx-auto text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#6B3F1F] flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-5 h-5 text-[#FAF7F2]" strokeWidth={1.8} />
          </div>
          <h1
            className="text-3xl font-bold text-[#FAF7F2]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {validated ? "Write Your Review" : "Submit Feedback"}
          </h1>
          <p className="text-sm text-[#9C7A5B] max-w-sm mx-auto">
            {validated
              ? `Share your honest experience at ${validated.shopName}`
              : "Enter your one-time token to leave a review for a coffee shop."}
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="border-b border-[#E8DDD0] bg-white">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          {[
            { step: 1, label: "Enter Token", done: !!validated },
            { step: 2, label: "Write Review", done: false },
          ].map(({ step, label, done }, idx) => {
            const isActive = idx === 0 ? !validated : !!validated
            return (
              <div key={step} className="flex items-center gap-2">
                {idx > 0 && (
                  <div className={`flex-1 h-px w-8 ${validated ? "bg-[#6B3F1F]" : "bg-[#E8DDD0]"}`} />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                      done
                        ? "bg-[#6B3F1F] text-white"
                        : isActive
                        ? "bg-[#D4863A] text-white"
                        : "bg-[#EDE3D8] text-[#9C7A5B]"
                    }`}
                  >
                    {done ? "✓" : step}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:inline ${
                      isActive ? "text-[#2A1208]" : "text-[#C4A882]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 py-10">
        {!validated ? (
          <FeedbackTokenInput
            onValidToken={handleTokenSubmit}
            isValidating={isValidating}
            error={error}
          />
        ) : (
          <FeedbackForm
            token={validated.token}
            shopName={validated.shopName}
          />
        )}
      </div>
    </div>
  )
}