
import { ProductCard } from './product-card'

interface RelatedProductsProps {
  products: Array<{
    id: string
    name: string
    slug: string
    price: any
    originalPrice?: any | null
    featuredImage?: string | null
    dialColor?: string | null
    isFeatured?: boolean
    isNewArrival?: boolean
    inStock: boolean
    collection?: {
      name: string
      slug: string
    }
  }>
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products?.length) {
    return null
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-[#4B302D] mb-8">
        You Might Also Like
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
