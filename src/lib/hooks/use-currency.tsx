
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CurrencyContextType {
  currency: string
  setCurrency: (currency: string) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState('GBP')

  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency')
    if (savedCurrency) {
      setCurrencyState(savedCurrency)
    }
  }, [])

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('preferred-currency', newCurrency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
