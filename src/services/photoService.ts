import { supabase } from "@/lib/supabase"
import { uploadCoffeeShopImage, deleteCoffeeShopImage } from "@/lib/supabaseStorage"
import type { CoffeeShopPhoto } from "@/types/coffeeShop"

export const photoService = {
  async getByShopId(shopId: string): Promise<CoffeeShopPhoto[]> {
    const { data, error } = await supabase
      .from("coffee_shop_photos")
      .select("*")
      .eq("coffee_shop_id", shopId)
      .order("created_at", { ascending: true })
    if (error) throw error
    return data as CoffeeShopPhoto[]
  },

  async upload(shopId: string, file: File): Promise<CoffeeShopPhoto> {
    // 1. Upload file to storage
    const publicUrl = await uploadCoffeeShopImage(shopId, file)
    console.log(publicUrl)
    // 2. Insert record into DB
    const { data, error } = await supabase
      .from("coffee_shop_photos")
      .insert({ coffee_shop_id: shopId, image_url: publicUrl })
      .select()
      .single()

    if (error) throw error
    return data as CoffeeShopPhoto
  },

  async delete(photoId: string, imageUrl: string): Promise<void> {
    // Parse path from public URL:  .../coffee-shop-images/{path}
    const urlParts = imageUrl.split("/coffee-shop-images/")
    const storagePath = urlParts[1]

    // 1. Delete from storage (best effort)
    if (storagePath) {
      await deleteCoffeeShopImage(storagePath).catch(console.warn)
    }

    // 2. Delete DB record
    const { error } = await supabase
      .from("coffee_shop_photos")
      .delete()
      .eq("id", photoId)
    if (error) throw error
  },
}