
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/use-cart'
import { useCurrency } from '@/hooks/use-currency'
import { formatPrice } from '@/lib/currency'
import { toast } from 'sonner'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: any // Decimal type from Prisma
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
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem, isLoading } = useCart()
  const { currency } = useCurrency()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.inStock) {
      toast.error('This product is currently out of stock')
      return
    }

    try {
      await addItem(product.id)
    } catch (error) {
      toast.error('Failed to add item to cart')
    }
  }

  const price = Number(product.price)
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/20 transition-all duration-500 group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ 
          y: -8,
          scale: 1.02,
          rotateX: 5,
          rotateY: 5,
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        style={{
          transformStyle: "preserve-3d",
          boxShadow: isHovered 
            ? "0 25px 50px rgba(189, 106, 92, 0.15), 0 12px 30px rgba(75, 48, 45, 0.1)" 
            : "0 10px 25px rgba(189, 106, 92, 0.08)"
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-[#F5E6CA] to-[#D6B79E] overflow-hidden">
          {product.featuredImage && (
            <Image
              src={product.featuredImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {product.isFeatured && (
              <Badge className="bg-[#BD6A5C] text-white">Featured</Badge>
            )}
            {product.isNewArrival && (
              <Badge className="bg-green-500 text-white">New</Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={(e) => e.preventDefault()}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Add to Cart Overlay */}
          <motion.div
            className="absolute inset-x-0 bottom-0 p-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 50, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              className="w-full bg-[#BD6A5C] hover:bg-[#4B302D] text-white"
              onClick={handleAddToCart}
              disabled={!product.inStock || isLoading}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <motion.div 
          className="p-6 space-y-3 bg-gradient-to-b from-transparent to-[#F5E6CA]/20"
          animate={{
            background: isHovered 
              ? "linear-gradient(to bottom, rgba(245, 230, 202, 0.1), rgba(245, 230, 202, 0.3))"
              : "linear-gradient(to bottom, transparent, rgba(245, 230, 202, 0.2))"
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Collection */}
          {product.collection && (
            <motion.p 
              className="text-xs text-[#BD6A5C] font-medium uppercase tracking-widest"
              whileHover={{ letterSpacing: "0.1em" }}
            >
              {product.collection.name}
            </motion.p>
          )}

          {/* Name */}
          <motion.h3 
            className="font-bold text-[#4B302D] text-lg leading-tight"
            animate={{ 
              color: isHovered ? "#BD6A5C" : "#4B302D",
              scale: isHovered ? 1.02 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            {product.name}
          </motion.h3>

          {/* Dial Color */}
          {product.dialColor && (
            <motion.p 
              className="text-sm text-[#4B302D]/70 font-medium"
              animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
              {product.dialColor} Dial
            </motion.p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-x-2">
              <motion.span 
                className="text-xl font-bold text-[#4B302D]"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {formatPrice(price, currency)}
              </motion.span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice, currency)}
                </span>
              )}
            </div>
            
            {originalPrice && originalPrice > price && (
              <Badge variant="destructive" className="text-xs bg-[#BD6A5C] hover:bg-[#4B302D] border-none">
                Save {formatPrice(originalPrice - price, currency)}
              </Badge>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Link>
  )
}
