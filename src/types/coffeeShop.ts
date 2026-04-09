export interface CoffeeShop {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  created_at?: string
}

export interface CoffeeShopPhoto {
  id: string
  coffee_shop_id: string
  image_url: string
}

export interface CoffeeShopWithPhotos extends CoffeeShop {
  coffee_shop_photos: CoffeeShopPhoto[]
}