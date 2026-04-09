import { useState } from "react"
import { Coffee } from "lucide-react"
import CoffeeShopCard from "./CoffeeShopCard"
import SearchBar from "@/components/shared/SearchBar"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import EmptyState from "@/components/shared/EmptyState"
import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"

interface CoffeeShopListProps {
  shops: CoffeeShopWithPhotos[]
  isLoading?: boolean
}

export default function CoffeeShopList({ shops, isLoading }: CoffeeShopListProps) {
  const [search, setSearch] = useState("")

  const filtered = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-[#FAF7F2]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#E8DDD0]">
        <h2
          className="text-lg font-bold text-[#2A1208] mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Coffee Shops
          <span className="ml-2 text-sm font-normal text-[#9C7A5B]">
            ({shops.length})
          </span>
        </h2>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or location..."
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          <LoadingSpinner className="mt-12" label="Finding coffee shops..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Coffee}
            title={search ? "No results found" : "No coffee shops yet"}
            description={
              search
                ? `No shops matching "${search}"`
                : "Coffee shops will appear here once added."
            }
          />
        ) : (
          filtered.map((shop) => (
            <CoffeeShopCard key={shop.id} shop={shop} />
          ))
        )}
      </div>
    </div>
  )
}