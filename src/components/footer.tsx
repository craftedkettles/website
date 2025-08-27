
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/craftedkettles',
      icon: Instagram,
    },
  ]

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Policies', href: '/policies' },
  ]

  return (
    <footer className="bg-[#4B302D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="https://cdn.abacus.ai/images/a043a86a-1ac3-4280-8ac8-a4b533d04c69.png"
                  alt="Crafted Kettles"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold">Crafted Kettles</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Luxury microbrand offering modified Seiko watches at accessible prices. 
              Where precision engineering meets distinctive design.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#BD6A5C]" />
                <a href="mailto:info@craftedkettles.com" className="hover:text-[#BD6A5C] transition-colors">
                  info@craftedkettles.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#BD6A5C]" />
                <a href="tel:+447392614868" className="hover:text-[#BD6A5C] transition-colors">
                  +44 7392 614868
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="space-y-4">
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#BD6A5C] p-2 rounded-lg hover:bg-[#D6B79E] transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              
              {/* TikTok */}
              <div className="text-sm text-gray-300">
                Follow us on TikTok: @craftedkettles
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 Crafted Kettles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
