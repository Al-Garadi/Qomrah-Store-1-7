import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import FlashSaleTimer from "@modules/home/components/flash-sale-timer"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  return collections.map((collection) => (
    <li key={collection.id}>
      {collection.handle === 'flash-deals' && (
        <div className="mb-4 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-2 text-red-600">Flash Sale Ending Soon!</h3>
          {/* Timer set for 2 days from now as example */}
          <FlashSaleTimer targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()} />
        </div>
      )}
      <ProductRail collection={collection} region={region} />
    </li>
  ))
}
