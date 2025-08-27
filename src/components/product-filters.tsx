
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/currency'
import { X, Filter } from 'lucide-react'

interface Collection {
  id: string
  name: string
  slug: string
  price: any
}

interface ProductFiltersProps {
  collections: Collection[]
}

export function ProductFilters({ collections }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedFilters, setSelectedFilters] = useState<{
    collection: string
    sortBy: string
    priceRange: string
  }>({
    collection: searchParams?.get('collection') || 'all',
    sortBy: searchParams?.get('sortBy') || 'newest',
    priceRange: searchParams?.get('priceRange') || 'all',
  })

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
  ]

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-175', label: 'Under £175' },
    { value: '175-180', label: '£175 - £180' },
    { value: '180-185', label: '£180 - £185' },
    { value: '185+', label: '£185+' },
  ]

  const updateFilters = (key: string, value: string) => {
    const newFilters = { ...selectedFilters, [key]: value }
    setSelectedFilters(newFilters)

    // Update URL
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all') {
        params.set(k, v)
      }
    })

    const queryString = params.toString()
    const newUrl = queryString ? `/shop?${queryString}` : '/shop'
    router.push(newUrl)
  }

  const clearFilters = () => {
    setSelectedFilters({
      collection: 'all',
      sortBy: 'newest',
      priceRange: 'all',
    })
    router.push('/shop')
  }

  const hasActiveFilters = selectedFilters.collection !== 'all' || 
                          selectedFilters.priceRange !== 'all' ||
                          selectedFilters.sortBy !== 'newest'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearFilters}
              className="text-[#BD6A5C] hover:text-[#4B302D]"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Collection Filter */}
        <div>
          <h3 className="font-semibold text-[#4B302D] mb-3">Collection</h3>
          <div className="space-y-2">
            <button
              onClick={() => updateFilters('collection', 'all')}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedFilters.collection === 'all'
                  ? 'bg-[#BD6A5C] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              All Collections
            </button>
            {collections?.map((collection) => (
              <button
                key={collection.id}
                onClick={() => updateFilters('collection', collection.slug)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedFilters.collection === collection.slug
                    ? 'bg-[#BD6A5C] text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{collection.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {formatPrice(Number(collection.price), 'GBP')}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div>
          <h3 className="font-semibold text-[#4B302D] mb-3">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => updateFilters('priceRange', range.value)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedFilters.priceRange === range.value
                    ? 'bg-[#BD6A5C] text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sort By */}
        <div>
          <h3 className="font-semibold text-[#4B302D] mb-3">Sort By</h3>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilters('sortBy', option.value)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedFilters.sortBy === option.value
                    ? 'bg-[#BD6A5C] text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-[#4B302D] mb-3">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {selectedFilters.collection !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {collections?.find(c => c.slug === selectedFilters.collection)?.name}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => updateFilters('collection', 'all')}
                    />
                  </Badge>
                )}
                {selectedFilters.priceRange !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {priceRanges.find(p => p.value === selectedFilters.priceRange)?.label}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => updateFilters('priceRange', 'all')}
                    />
                  </Badge>
                )}
                {selectedFilters.sortBy !== 'newest' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {sortOptions.find(s => s.value === selectedFilters.sortBy)?.label}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => updateFilters('sortBy', 'newest')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
