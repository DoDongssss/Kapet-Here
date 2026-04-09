import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

type BrandWatermarkProps = {
  isDrawerOpen: boolean;
  location?: string;
};

export default function BrandWatermark({
  isDrawerOpen,
  location = "South Cotabato",
}: BrandWatermarkProps) {
  return (
    <div
      className={cn(
        "absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center px-3 py-2 rounded-xl backdrop-blur-md bg-white/40 border border-white/30 shadow-sm transition-all max-w-[85vw]",
        isDrawerOpen ? "z-100" : "z-100"
      )}
    >
      <p className="text-[14px] md:text-[20px] font-bold text-[#3B1F14] leading-none font-playfair drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
        Kape't Here
      </p>

      <div className="w-20 h-[1px] bg-[#A67C52] mt-1 mb-1 rounded-full" />

      <div className="flex items-center gap-1 text-[7px] md:text-[9px] font-medium tracking-widest text-[#A67C52] font-sans">
        <span>FIND YOUR CUP</span>

        {location && (
          <>
            <span className="opacity-50">•</span>
            <MapPin size={10} className="opacity-70" />
            <span className="truncate max-w-25">{location}</span>
          </>
        )}
      </div>
    </div>
  );
}