import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { CoffeeShop } from "@/types/coffeeShop"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  location: z.string().min(3, "Location is required").max(200),
  latitude: z
    .number({ error: "Latitude must be a number" })
    .min(-90)
    .max(90),
  longitude: z
    .number({ error: "Longitude must be a number" })
    .min(-180)
    .max(180),
})

export type CoffeeShopFormValues = z.infer<typeof schema>

interface CoffeeShopFormProps {
  defaultValues?: Partial<CoffeeShop>
  onSubmit: (data: CoffeeShopFormValues) => void
  isLoading?: boolean
  className?: string
}

interface FieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-[#5C3A1E]">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function CoffeeShopForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  className,
}: CoffeeShopFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CoffeeShopFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      location: defaultValues?.location ?? "",
      latitude: defaultValues?.latitude,
      longitude: defaultValues?.longitude,
    },
  })

  // Helper to detect coords from location input (e.g. pasted from Google Maps)
  const parseCoords = (raw: string) => {
    const match = raw.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/)
    if (match) {
      setValue("latitude", parseFloat(match[1]), { shouldValidate: true })
      setValue("longitude", parseFloat(match[2]), { shouldValidate: true })
    }
  }

  const inputClass =
    "bg-white border-[#E8DDD0] focus:border-[#6B3F1F] focus:ring-[#6B3F1F]/20 text-[#3D1F0D] placeholder-[#C4A882] h-10"

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-5 bg-white rounded-2xl border border-[#E8DDD0] p-6", className)}
    >
      <Field label="Shop Name" error={errors.name?.message} required>
        <Input
          {...register("name")}
          placeholder="e.g. Kape ni Manong"
          disabled={isLoading}
          className={inputClass}
        />
      </Field>

      <Field label="Location / Address" error={errors.location?.message} required>
        <Input
          {...register("location")}
          placeholder="e.g. Koronadal City, South Cotabato"
          disabled={isLoading}
          className={inputClass}
        />
      </Field>

      {/* Coords row */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Latitude" error={errors.latitude?.message} required>
          <Input
            {...register("latitude", { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="6.2969"
            disabled={isLoading}
            className={inputClass}
          />
        </Field>
        <Field label="Longitude" error={errors.longitude?.message} required>
          <Input
            {...register("longitude", { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="124.8548"
            disabled={isLoading}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Paste coords helper */}
      <div className="p-3 rounded-xl bg-[#F5F0E8] border border-[#E8DDD0]">
        <p className="text-xs text-[#9C7A5B] font-medium mb-1.5 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          Paste coordinates from Google Maps
        </p>
        <Input
          placeholder="e.g. 6.2969, 124.8548"
          onChange={(e) => parseCoords(e.target.value)}
          disabled={isLoading}
          className="h-8 text-xs bg-white border-[#E8DDD0] text-[#5C3A1E] placeholder-[#C4A882]"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-[#6B3F1F] hover:bg-[#5A3418] text-white gap-2 font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {defaultValues?.id ? "Save Changes" : "Add Coffee Shop"}
          </>
        )}
      </Button>
    </form>
  )
}