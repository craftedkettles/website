
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface GooeyTextProps {
  text: string
  className?: string
  interval?: number
}

export function GooeyText({ text, className = '', interval = 3000 }: GooeyTextProps) {
  const [currentText, setCurrentText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)

  const textVariations = [
    text,
    text.replace(/luxury/gi, 'premium'),
    text.replace(/watch/gi, 'timepiece'),
    text.replace(/crafted/gi, 'engineered'),
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * textVariations.length)
        setCurrentText(textVariations[randomIndex] || text)
        setIsAnimating(false)
      }, 500)
    }, interval)

    return () => clearInterval(timer)
  }, [text, interval])

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{
        filter: isAnimating ? 'url(#gooey)' : 'none',
      }}
    >
      <svg width="0" height="0">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
          </filter>
        </defs>
      </svg>
      
      <motion.span
        className="block"
        animate={{
          scaleY: isAnimating ? [1, 1.1, 1] : 1,
          scaleX: isAnimating ? [1, 0.9, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
      >
        {currentText}
      </motion.span>
    </motion.div>
  )
}
