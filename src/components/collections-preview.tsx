
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/currency'
import { prisma } from '@/lib/db'

async function getCollections() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: {
        price: 'asc'
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    // Convert Decimal to number for client component compatibility
    const serializedCollections = collections.map((collection: any) => ({
      ...collection,
      price: Number(collection.price)
    }))

    return serializedCollections
  } catch (error) {
    console.error('Error fetching collections:', error)
    return []
  }
}

export async function CollectionsPreview() {
  const collections = await getCollections()

  if (!collections?.length) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#D6B79E] to-[#BD6A5C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Collections
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Four distinct collections, each crafted with precision and designed for different styles and occasions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((collection: any) => (
            <div
              key={collection.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group"
            >
              {/* Collection Image */}
              {collection.image && (
                <div className="relative aspect-square mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              )}

              {/* Collection Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2">
                    {collection.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wide">
                      Starting at
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {formatPrice(Number(collection.price), 'GBP')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs uppercase tracking-wide">
                      Models
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {collection._count.products}+
                    </p>
                  </div>
                </div>

                <Link href={`/collections/${collection.slug}`} className="block">
                  <Button
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                  >
                    Explore Collection
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/collections">
            <Button size="lg" className="bg-white text-[#BD6A5C] hover:bg-white/90">
              View All Collections
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
