
'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/currency'
import { SHIPPING_COSTS, INTERNATIONAL_SHIPPING_GBP } from '@/lib/stripe'
import { Truck, Shield, Clock } from 'lucide-react'

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    featuredImage?: string | null
    slug: string
    inStock: boolean
  }
}

interface OrderSummaryProps {
  items: CartItem[]
  currency: string
}

export function OrderSummary({ items, currency }: OrderSummaryProps) {
  const calculations = useMemo(() => {
    const subtotal = items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    )
    
    // Shipping costs: £4.99 for UK, £14.99 for international
    let shippingCost = 0
    if (currency === 'GBP') {
      shippingCost = SHIPPING_COSTS.GBP // £4.99 for UK
    } else {
      // For international orders, convert £14.99 to local currency
      shippingCost = INTERNATIONAL_SHIPPING_GBP
      if (currency === 'USD') shippingCost = 18.99 // ~£14.99 in USD
      if (currency === 'EUR') shippingCost = 16.99 // ~£14.99 in EUR
    }
    
    // No VAT calculation since all prices already include VAT
    const total = subtotal + shippingCost

    return {
      subtotal,
      shippingCost,
      total,
      itemCount: items.reduce((total, item) => total + item.quantity, 0)
    }
  }, [items, currency])

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-[#4B302D] flex items-center gap-2">
          Order Summary
          <Badge variant="secondary" className="bg-[#BD6A5C]/10 text-[#BD6A5C]">
            {calculations.itemCount} item{calculations.itemCount !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Items List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              {/* Product Image */}
              <div className="relative w-16 h-16 bg-gradient-to-br from-[#F5E6CA] to-[#D6B79E] rounded-lg overflow-hidden flex-shrink-0">
                {item.product?.featuredImage && (
                  <Image
                    src={item.product.featuredImage}
                    alt={item.product?.name || 'Product'}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
                {item.quantity > 1 && (
                  <div className="absolute -top-2 -right-2 bg-[#BD6A5C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.quantity}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#4B302D] text-sm leading-tight">
                  <Link 
                    href={`/products/${item.product?.slug}`}
                    className="hover:text-[#BD6A5C] transition-colors"
                  >
                    {item.product?.name}
                  </Link>
                </h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-[#4B302D]/70">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-semibold text-[#4B302D]">
                    {formatPrice((item.product?.price || 0) * item.quantity, currency)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Totals */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#4B302D]/70">Subtotal (VAT included)</span>
            <span className="text-[#4B302D]">
              {formatPrice(calculations.subtotal, currency)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-[#4B302D]/70">Shipping</span>
            <span className="text-[#4B302D]">
              {calculations.shippingCost <= 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                formatPrice(calculations.shippingCost, currency)
              )}
            </span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between text-lg font-bold">
            <span className="text-[#4B302D]">Total</span>
            <span className="text-[#4B302D]">
              {formatPrice(calculations.total, currency)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Trust Indicators */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-[#4B302D]/70">
            <Shield className="w-4 h-4 text-[#BD6A5C]" />
            <span>Secure SSL encryption</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[#4B302D]/70">
            <Truck className="w-4 h-4 text-[#BD6A5C]" />
            <span>UK shipping £4.99 • International £14.99</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[#4B302D]/70">
            <Clock className="w-4 h-4 text-[#BD6A5C]" />
            <span>2-5 business days delivery</span>
          </div>
        </div>

        {/* Note for international customers */}
        {currency !== 'GBP' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>International Order:</strong> You may be responsible for customs duties and taxes upon delivery.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
