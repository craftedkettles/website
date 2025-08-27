
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  UserCircle,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CurrencySelector } from '@/components/ui/currency-selector'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCart } from '@/hooks/use-cart'
import { useCurrency } from '@/hooks/use-currency'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()
  const { itemCount } = useCart()
  const { currency, setCurrency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F5E6CA]/95 backdrop-blur-md shadow-md border-b border-[#D6B79E]/20'
          : 'bg-gradient-to-r from-[#F5E6CA]/80 via-[#D6B79E]/60 to-[#F5E6CA]/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image
                src="https://cdn.abacus.ai/images/a043a86a-1ac3-4280-8ac8-a4b533d04c69.png"
                alt="Crafted Kettles"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-[#4B302D]">
              Crafted Kettles
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#4B302D] hover:text-[#BD6A5C] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Currency Selector */}
            <CurrencySelector 
              currentCurrency={currency}
              onCurrencyChange={setCurrency}
            />

            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="text-[#4B302D] hover:text-[#BD6A5C]"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#4B302D] hover:text-[#BD6A5C]"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#BD6A5C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#4B302D] hover:text-[#BD6A5C]"
                >
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {session ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="flex items-center">
                        <UserCircle className="w-4 h-4 mr-2" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/signin">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/signup">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#4B302D]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#F5E6CA]/95 backdrop-blur-md shadow-lg rounded-lg mt-2 p-4 border border-[#D6B79E]/20"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#4B302D] hover:text-[#BD6A5C] transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
