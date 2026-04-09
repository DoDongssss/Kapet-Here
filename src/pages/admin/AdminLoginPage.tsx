import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Coffee, Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/useAuthStore"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormValues = z.infer<typeof schema>

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { signIn, isAuthenticated, checkSession } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  // Redirect if already logged in
  useEffect(() => {
    checkSession().then(() => {
      if (isAuthenticated) navigate(ROUTES.ADMIN.DASHBOARD, { replace: true })
    })
  }, [isAuthenticated])

  const onSubmit = async (data: FormValues) => {
    setAuthError(null)
    try {
      await signIn(data.email, data.password)
      navigate(ROUTES.ADMIN.DASHBOARD, { replace: true })
    } catch (err) {
      setAuthError("Invalid email or password. Please try again.")
    }
  }

  const inputClass =
    "h-11 bg-white/80 border-[#E8DDD0] focus:border-[#6B3F1F] focus:ring-[#6B3F1F]/20 text-[#3D1F0D] placeholder-[#C4A882]"

  return (
    <div className="min-h-screen bg-[#2A1208] flex items-center justify-center p-4">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #D4863A 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, #D4863A 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-[#FAF7F2] rounded-3xl shadow-2xl overflow-hidden">
          {/* Top accent band */}
          <div className="h-1.5 bg-gradient-to-r from-[#6B3F1F] via-[#D4863A] to-[#6B3F1F]" />

          <div className="p-8 space-y-6">
            {/* Logo */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#2A1208] flex items-center justify-center shadow-lg">
                <Coffee className="w-6 h-6 text-[#D4863A]" strokeWidth={1.8} />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold text-[#2A1208]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Admin Access
                </h1>
                <p className="text-xs text-[#9C7A5B] mt-0.5 tracking-wide">
                  Kape't Here · Management Panel
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#5C3A1E]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4A882]" />
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="admin@kapethere.com"
                    disabled={isSubmitting}
                    className={cn(inputClass, "pl-9")}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#5C3A1E]">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4A882]" />
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className={cn(inputClass, "pl-9 pr-10")}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4A882] hover:text-[#9C7A5B] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Auth error */}
              {authError && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 text-center animate-in fade-in duration-200">
                  {authError}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#2A1208] hover:bg-[#3D1F0D] text-white font-semibold gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>

          {/* Bottom note */}
          <div className="px-8 pb-6 text-center">
            <p className="text-xs text-[#C4A882]">
              Restricted to authorized administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}