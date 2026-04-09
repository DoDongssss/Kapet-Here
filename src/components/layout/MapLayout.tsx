import { Outlet } from "react-router-dom"

export default function MapLayout() {
  return (
    <div className="w-full h-dvh overflow-hidden bg-[#FAF7F2]">
      <Outlet />
    </div>
  )
}