import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"

async function fetchCoffeeShop(id: string): Promise<CoffeeShopWithPhotos> {
  const { data, error } = await supabase
    .from("coffee_shops")
    .select("*, coffee_shop_photos(*)")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as CoffeeShopWithPhotos
}

export function useCoffeeShop(id?: string) {
  return useQuery({
    queryKey: ["coffee_shop", id],
    queryFn: () => fetchCoffeeShop(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}