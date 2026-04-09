import { supabase } from "@/lib/supabase"
import type { CoffeeShop, CoffeeShopWithPhotos } from "@/types/coffeeShop"
import type { CoffeeShopFormValues } from "@/components/admin/CoffeeShopForm"

export const coffeeShopService = {
  async getAll(): Promise<CoffeeShopWithPhotos[]> {
    const { data, error } = await supabase
      .from("coffee_shops")
      .select("*, coffee_shop_photos(*)")
      .order("name", { ascending: true })
    if (error) throw error
    return data as CoffeeShopWithPhotos[]
  },

  async getById(id: string): Promise<CoffeeShopWithPhotos> {
    const { data, error } = await supabase
      .from("coffee_shops")
      .select("*, coffee_shop_photos(*)")
      .eq("id", id)
      .single()
    if (error) throw error
    return data as CoffeeShopWithPhotos
  },

  async create(values: CoffeeShopFormValues): Promise<CoffeeShop> {
    const { data, error } = await supabase
      .from("coffee_shops")
      .insert({
        name: values.name,
        location: values.location,
        latitude: values.latitude,
        longitude: values.longitude,
      })
      .select()
      .single()
    if (error) throw error
    return data as CoffeeShop
  },

  async update(id: string, values: CoffeeShopFormValues): Promise<CoffeeShop> {
    const { data, error } = await supabase
      .from("coffee_shops")
      .update({
        name: values.name,
        location: values.location,
        latitude: values.latitude,
        longitude: values.longitude,
      })
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return data as CoffeeShop
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("coffee_shops")
      .delete()
      .eq("id", id)
    if (error) throw error
  },
}