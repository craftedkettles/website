
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface BackgroundPathsProps {
  className?: string
}

export function BackgroundPaths({ className = '' }: BackgroundPathsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={className} />
  }

  const paths = [
    {
      d: "M0,100 Q50,50 100,100 T200,100",
      delay: 0,
      duration: 8,
    },
    {
      d: "M0,150 Q100,50 200,150 T400,150", 
      delay: 2,
      duration: 10,
    },
    {
      d: "M0,200 Q75,100 150,200 T300,200",
      delay: 4,
      duration: 12,
    },
  ]

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path, index) => (
          <motion.path
            key={index}
            d={path.d}
            stroke="#BD6A5C"
            strokeWidth="2"
            strokeOpacity="0.1"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: path.duration,
              delay: path.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Animated text along path */}
        <motion.text
          className="text-xs fill-current text-[#4B302D]/20"
          initial={{ x: -100, opacity: 0 }}
          animate={{ 
            x: [0, 300, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <textPath href="#textPath" startOffset="0%">
            Crafted Kettles • Luxury Timepieces • 
          </textPath>
        </motion.text>
        
        <defs>
          <path id="textPath" d="M0,150 Q100,50 200,150 T400,150" />
        </defs>
      </svg>
    </div>
  )
}
