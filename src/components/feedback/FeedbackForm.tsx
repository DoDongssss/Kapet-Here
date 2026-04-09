import { useState } from "react"
import { useForm, useWatch  } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import StarRating from "./StarRating"
import FeedbackPhotoUpload from "./FeedbackPhotoUpload"
import { useSubmitFeedback } from "@/hooks/useSubmitFeedback"
import { cn } from "@/lib/utils"

const schema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().max(500, "Comment must be 500 characters or less").optional(),
})

type FormValues = z.infer<typeof schema>

interface FeedbackFormProps {
  token: string
  shopName: string
  className?: string
}

export default function FeedbackForm({ token, shopName, className }: FeedbackFormProps) {
  const [photo, setPhoto] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const { mutate: submitFeedback, isPending } = useSubmitFeedback()

  const {
    handleSubmit,
    setValue,
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, comment: "" },
  })


const rating = useWatch({ control, name: "rating" })
const comment = useWatch({ control, name: "comment" }) ?? ""

  const onSubmit = (data: FormValues) => {
    submitFeedback(
      { token, rating: data.rating, comment: data.comment, photo },
      {
        onSuccess: () => setSubmitted(true),
      }
    )
  }

  // Success state
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center animate-in zoom-in duration-300">
          <CheckCircle2 className="w-9 h-9 text-green-500" strokeWidth={1.8} />
        </div>
        <div className="space-y-1.5">
          <h2
            className="text-2xl font-bold text-[#2A1208]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Thank You!
          </h2>
          <p className="text-sm text-[#9C7A5B] max-w-xs leading-relaxed">
            Your feedback for <strong className="text-[#5C3A1E]">{shopName}</strong> has been submitted successfully.
          </p>
        </div>
        <p className="text-xs text-[#C4A882]">
          Your token has been used and can't be reused.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
      {/* Shop label */}
      <div className="px-4 py-3 rounded-xl bg-[#EDE3D8] border border-[#D8C9B8]">
        <p className="text-xs text-[#9C7A5B] uppercase tracking-wider">Reviewing</p>
        <p
          className="text-base font-semibold text-[#2A1208] mt-0.5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {shopName}
        </p>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#5C3A1E]">
          Your Rating <span className="text-red-400">*</span>
        </Label>
        <StarRating
          value={rating}
          onChange={(val) => setValue("rating", val, { shouldValidate: true })}
          size="lg"
          disabled={isPending}
        />
        {errors.rating && (
          <p className="text-xs text-red-500">{errors.rating.message}</p>
        )}
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#5C3A1E]">
          Comment{" "}
          <span className="font-normal text-[#9C7A5B]">(optional)</span>
        </Label>
        <Textarea
          {...register("comment")}
          placeholder="Share your experience — the coffee, the ambiance, the service..."
          disabled={isPending}
          maxLength={500}
          className="resize-none h-28 bg-white border-[#E8DDD0] focus:border-[#6B3F1F] focus:ring-[#6B3F1F]/20 text-[#3D1F0D] placeholder-[#C4A882]"
        />
        <div className="flex justify-between items-center">
          {errors.comment ? (
            <p className="text-xs text-red-500">{errors.comment.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-[#C4A882]">{comment.length}/500</span>
        </div>
      </div>

      {/* Photo */}
      <FeedbackPhotoUpload
        value={photo}
        onChange={setPhoto}
        disabled={isPending}
      />

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending || rating === 0}
        className="w-full h-12 bg-[#6B3F1F] hover:bg-[#5A3418] text-white gap-2 font-semibold"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Feedback
          </>
        )}
      </Button>
    </form>
  )
}