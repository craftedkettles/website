
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/product-card'
import { prisma } from '@/lib/db'

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        inStock: true
      },
      include: {
        collection: true
      },
      take: 4,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Convert Decimal to number for client component compatibility
    const serializedProducts = products.map((product: any) => ({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      collection: product.collection ? {
        ...product.collection,
        price: Number(product.collection.price)
      } : null
    }))

    return serializedProducts
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (!products?.length) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#F5E6CA] to-[#D6B79E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#4B302D] mb-4">
            Featured Timepieces
          </h2>
          <p className="text-xl text-[#4B302D]/70 max-w-2xl mx-auto">
            Discover our most coveted luxury watches, each crafted with precision and designed for the modern connoisseur
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/shop">
            <Button size="lg" className="bg-[#BD6A5C] hover:bg-[#4B302D] text-white">
              View All Watches
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
