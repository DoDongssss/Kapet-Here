import { MapPinned } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface LocationPermissionPopupProps {
  open: boolean
  onAllow: () => void
  onDismiss: () => void
}

export default function LocationPermissionPopup({
  open,
  onAllow,
  onDismiss,
}: LocationPermissionPopupProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[600]"
            onClick={onDismiss}
          />

          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[700] w-[90vw] max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8DDD0]"
          >
            <div className="p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4863A] to-[#C07830] flex items-center justify-center mx-auto mb-4">
                <MapPinned className="w-8 h-8 text-white" strokeWidth={2} />
              </div>

              <h3
                className="text-xl font-bold text-[#2A1208] text-center mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Enable Location
              </h3>

              <p className="text-sm text-[#9C7A5B] text-center mb-6 leading-relaxed">
                Allow location access to find nearby coffee shops and get
                directions to your favorite spots.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={onAllow}
                  className="w-full py-3 px-4 rounded-xl bg-[#6B3F1F] text-white font-semibold text-sm hover:bg-[#5C3519] active:scale-[0.98] transition-all"
                >
                  Enable Location
                </button>
                <button
                  onClick={onDismiss}
                  className="w-full py-3 px-4 rounded-xl bg-[#F5F0E8] text-[#9C7A5B] font-semibold text-sm hover:bg-[#EDE3D8] active:scale-[0.98] transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}