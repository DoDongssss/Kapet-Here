import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit2, Trash2, MapPin, Coffee, Plus, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SearchBar from "@/components/shared/SearchBar"
import EmptyState from "@/components/shared/EmptyState"
import { adminShopEditPath, ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import type { CoffeeShop } from "@/types/coffeeShop"

interface CoffeeShopTableProps {
  shops: CoffeeShop[]
  onDelete: (shop: CoffeeShop) => void
  className?: string
}

type SortKey = "name" | "location"

export default function CoffeeShopTable({ shops, onDelete, className }: CoffeeShopTableProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortAsc, setSortAsc] = useState(true)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v)
    else { setSortKey(key); setSortAsc(true) }
  }

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
    ) : (
      <ChevronUp className="w-3.5 h-3.5 opacity-20" />
    )

  const filtered = shops
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey])
      return sortAsc ? cmp : -cmp
    })

  return (
    <div className={cn("bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 border-b border-[#E8DDD0]">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search shops..."
          className="w-full sm:max-w-xs"
        />
        <Button
          onClick={() => navigate(ROUTES.ADMIN.SHOP_NEW)}
          className="gap-2 bg-[#6B3F1F] hover:bg-[#5A3418] text-white shrink-0"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Shop
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Coffee}
          title="No coffee shops found"
          description={search ? `No results for "${search}"` : "Add your first coffee shop to get started."}
          actionLabel={!search ? "Add Coffee Shop" : undefined}
          onAction={!search ? () => navigate(ROUTES.ADMIN.SHOP_NEW) : undefined}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8DDD0] bg-[#FAF7F2]">
                {[
                  { key: "name" as SortKey, label: "Name" },
                  { key: "location" as SortKey, label: "Location" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left font-semibold text-[#5C3A1E] cursor-pointer select-none hover:text-[#2A1208] transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold text-[#5C3A1E]">Coordinates</th>
                <th className="px-4 py-3 text-right font-semibold text-[#5C3A1E]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DF]">
              {filtered.map((shop) => (
                <tr key={shop.id} className="hover:bg-[#FAF7F2] transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#EDE3D8] flex items-center justify-center shrink-0">
                        <Coffee className="w-3.5 h-3.5 text-[#6B3F1F]" strokeWidth={1.8} />
                      </div>
                      <span
                        className="font-medium text-[#2A1208]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {shop.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-[#9C7A5B]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                      <span className="truncate max-w-50">{shop.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge
                      variant="outline"
                      className="text-xs font-mono text-[#9C7A5B] border-[#E8DDD0] bg-[#FAF7F2]"
                    >
                      {shop.latitude.toFixed(4)}, {shop.longitude.toFixed(4)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(adminShopEditPath(shop.id))}
                        className="h-8 w-8 p-0 text-[#6B3F1F] hover:bg-[#EDE3D8]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(shop)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer count */}
          <div className="px-4 py-3 border-t border-[#F0E8DF] bg-[#FAF7F2]">
            <p className="text-xs text-[#C4A882]">
              Showing {filtered.length} of {shops.length} shops
            </p>
          </div>
        </div>
      )}
    </div>
  )
}