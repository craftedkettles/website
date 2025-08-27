
'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ShaderBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function ShaderBackground({ children, className = '' }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Shader-like animation variables
    let time = 0
    const colors = ['#F5E6CA', '#D6B79E', '#BD6A5C', '#4B302D'] // Brand colors

    const animate = () => {
      time += 0.005
      const rect = canvas.getBoundingClientRect()
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
      
      // Animate color stops based on time
      const color1Index = Math.floor(time * 2) % colors.length
      const color2Index = (color1Index + 1) % colors.length
      const color3Index = (color1Index + 2) % colors.length
      
      gradient.addColorStop(0, colors[color1Index] + '20')
      gradient.addColorStop(0.5, colors[color2Index] + '15')
      gradient.addColorStop(1, colors[color3Index] + '10')
      
      // Clear and fill
      ctx.clearRect(0, 0, rect.width, rect.height)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, rect.width, rect.height)
      
      // Add floating particles
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time + i) * rect.width * 0.3) + (rect.width * 0.5)
        const y = (Math.cos(time * 0.8 + i) * rect.height * 0.3) + (rect.height * 0.5)
        const size = Math.sin(time * 2 + i) * 2 + 3
        
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = colors[i % colors.length] + '40'
        ctx.fill()
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
