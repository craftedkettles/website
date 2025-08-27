
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { toast } from 'sonner'

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

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalAmount: number
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = async (productId: string) => {
    setIsLoading(true)
    try {
      // Fetch product details
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) throw new Error('Product not found')
      
      const product = await response.json()
      
      if (!product.inStock) {
        toast.error('This product is currently out of stock')
        return
      }

      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.productId === productId)
        
        if (existingItem) {
          return prevItems.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          return [...prevItems, {
            id: `cart-${productId}-${Date.now()}`,
            productId,
            quantity: 1,
            product: {
              id: product.id,
              name: product.name,
              price: Number(product.price),
              featuredImage: product.featuredImage,
              slug: product.slug,
              inStock: product.inStock,
            }
          }]
        }
      })
      
      toast.success('Added to cart')
    } catch (error) {
      toast.error('Failed to add item to cart')
      console.error('Add to cart error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId))
    toast.success('Removed from cart')
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = async () => {
    setItems([])
    toast.success('Cart cleared')
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalAmount = items.reduce((total, item) => total + (item.product.price * item.quantity), 0)

  const value: CartContextType = {
    items,
    itemCount,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
