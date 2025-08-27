
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCart } from '@/hooks/use-cart'
import { useCurrency } from '@/hooks/use-currency'
import { formatPrice } from '@/lib/currency'
import { toast } from 'sonner'

interface ProductDetailProps {
  product: {
    id: string
    name: string
    description?: string | null
    shortDescription?: string | null
    price: any
    originalPrice?: any | null
    featuredImage?: string | null
    images: string[]
    dialColor?: string | null
    caseSize?: string | null
    caseMaterial?: string | null
    movement?: string | null
    waterResistance?: string | null
    braceletType?: string | null
    weight?: string | null
    features: string[]
    inStock: boolean
    collection?: {
      name: string
      slug: string
    }
  }
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem, isLoading } = useCart()
  const { currency } = useCurrency()

  const handleAddToCart = async () => {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || product.description || '',
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const price = Number(product.price)
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null

  const specifications = [
    { label: 'Dial Color', value: product.dialColor },
    { label: 'Case Size', value: product.caseSize },
    { label: 'Case Material', value: product.caseMaterial },
    { label: 'Movement', value: product.movement },
    { label: 'Water Resistance', value: product.waterResistance },
    { label: 'Bracelet Type', value: product.braceletType },
    { label: 'Weight', value: product.weight },
  ].filter(spec => spec.value)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <motion.div
          className="relative aspect-square bg-gradient-to-br from-[#F5E6CA] to-[#D6B79E] rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {product.featuredImage && (
            <Image
              src={product.featuredImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
          
          {/* Image Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {!product.inStock && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
            {originalPrice && originalPrice > price && (
              <Badge variant="destructive">
                Save {formatPrice(originalPrice - price, currency)}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Thumbnail Images */}
        {product.images?.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-[#BD6A5C]'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        {product.collection && (
          <div className="text-sm text-[#BD6A5C] font-medium uppercase tracking-wide">
            {product.collection.name} Collection
          </div>
        )}

        {/* Product Name */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#4B302D] mb-2">
            {product.name}
          </h1>
          {product.shortDescription && (
            <p className="text-lg text-[#4B302D]/70">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-[#4B302D]">
            {formatPrice(price, currency)}
          </div>
          {originalPrice && originalPrice > price && (
            <div className="text-xl text-gray-500 line-through">
              {formatPrice(originalPrice, currency)}
            </div>
          )}
        </div>

        {/* Key Features */}
        {product.features?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.features.map((feature) => (
              <Badge key={feature} variant="outline" className="border-[#BD6A5C] text-[#BD6A5C]">
                {feature}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isLoading}
            className="flex-1 bg-[#BD6A5C] hover:bg-[#4B302D] text-white h-12"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="border-[#BD6A5C] text-[#BD6A5C] hover:bg-[#BD6A5C] hover:text-white"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="border-[#BD6A5C] text-[#BD6A5C] hover:bg-[#BD6A5C] hover:text-white"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-[#4B302D]/70">
            <Shield className="w-4 h-4 text-[#BD6A5C]" />
            <span>2 Year Warranty</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#4B302D]/70">
            <Truck className="w-4 h-4 text-[#BD6A5C]" />
            <span>Free UK Shipping</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#4B302D]/70">
            <RotateCcw className="w-4 h-4 text-[#BD6A5C]" />
            <span>30 Day Returns</span>
          </div>
        </div>

        <Separator />

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-4">
            <div className="prose max-w-none text-[#4B302D]/80">
              <p>{product.description || product.shortDescription}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-4">
            <div className="space-y-4">
              {specifications.map((spec) => (
                <div key={spec.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-[#4B302D]">{spec.label}</span>
                  <span className="text-[#4B302D]/70">{spec.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
