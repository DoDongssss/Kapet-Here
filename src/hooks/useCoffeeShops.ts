import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { CoffeeShopWithPhotos } from "@/types/coffeeShop"

async function fetchCoffeeShops(): Promise<CoffeeShopWithPhotos[]> {
  const { data, error } = await supabase
    .from("coffee_shops")
    .select("*, coffee_shop_photos(*)")
    .order("name", { ascending: true })

  if (error) throw error
  return data as CoffeeShopWithPhotos[]
}

export function useCoffeeShops() {
  return useQuery({
    queryKey: ["coffee_shops"],
    queryFn: fetchCoffeeShops,
    staleTime: 1000 * 60 * 5,
  })
}