
'use client'

import { useState, useEffect } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { Loader2, CreditCard, User, MapPin } from 'lucide-react'

interface CheckoutFormProps {
  session?: any
  clientSecret?: string
  orderId?: string
  orderNumber?: string
  onSubmit: (data: any) => void
  onPaymentSuccess?: (paymentIntentId: string) => void
  isLoading: boolean
}

export function CheckoutForm({
  session,
  clientSecret,
  orderId,
  orderNumber,
  onSubmit,
  onPaymentSuccess,
  isLoading
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerEmail: session?.user?.email || '',
    customerName: session?.user?.name || '',
    customerPhone: '',
    shippingAddress: {
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      company: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'GB',
      phone: '',
    },
    billingAddress: {
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      company: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'GB',
      phone: '',
    },
    sameAsShipping: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const countries = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'AT', name: 'Austria' },
    { code: 'IE', name: 'Ireland' },
    { code: 'NO', name: 'Norway' },
    { code: 'SE', name: 'Sweden' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'JP', name: 'Japan' },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerEmail) newErrors.customerEmail = 'Email is required'
    if (!formData.customerName) newErrors.customerName = 'Name is required'
    if (!formData.shippingAddress.firstName) newErrors.shippingFirstName = 'First name is required'
    if (!formData.shippingAddress.lastName) newErrors.shippingLastName = 'Last name is required'
    if (!formData.shippingAddress.addressLine1) newErrors.shippingAddressLine1 = 'Address is required'
    if (!formData.shippingAddress.city) newErrors.shippingCity = 'City is required'
    if (!formData.shippingAddress.postalCode) newErrors.shippingPostalCode = 'Postal code is required'

    if (!formData.sameAsShipping) {
      if (!formData.billingAddress.firstName) newErrors.billingFirstName = 'First name is required'
      if (!formData.billingAddress.lastName) newErrors.billingLastName = 'Last name is required'
      if (!formData.billingAddress.addressLine1) newErrors.billingAddressLine1 = 'Address is required'
      if (!formData.billingAddress.city) newErrors.billingCity = 'City is required'
      if (!formData.billingAddress.postalCode) newErrors.billingPostalCode = 'Postal code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (clientSecret && stripe && elements) {
        // Handle payment
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
        })

        if (error) {
          throw new Error(error.message)
        }

        if (paymentIntent?.status === 'succeeded') {
          await onPaymentSuccess?.(paymentIntent.id)
        }
      } else {
        // Create payment intent
        const billingAddress = formData.sameAsShipping 
          ? formData.shippingAddress 
          : formData.billingAddress

        await onSubmit({
          customerEmail: formData.customerEmail,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone || undefined,
          shippingAddress: formData.shippingAddress,
          billingAddress,
        })
      }
    } catch (error) {
      console.error('Checkout error:', error)
      // Error will be handled by parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateShippingAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }))
  }

  const updateBillingAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value
      }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[#BD6A5C]" />
          <h3 className="text-lg font-semibold text-[#4B302D]">Contact Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Full Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className={errors.customerName ? 'border-red-500' : ''}
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="customerEmail">Email Address *</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
              className={errors.customerEmail ? 'border-red-500' : ''}
            />
            {errors.customerEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="customerPhone">Phone Number</Label>
          <Input
            id="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
          />
        </div>
      </div>

      <Separator />

      {/* Shipping Address */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-[#BD6A5C]" />
          <h3 className="text-lg font-semibold text-[#4B302D]">Shipping Address</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shippingFirstName">First Name *</Label>
            <Input
              id="shippingFirstName"
              value={formData.shippingAddress.firstName}
              onChange={(e) => updateShippingAddress('firstName', e.target.value)}
              className={errors.shippingFirstName ? 'border-red-500' : ''}
            />
            {errors.shippingFirstName && (
              <p className="text-red-500 text-sm mt-1">{errors.shippingFirstName}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="shippingLastName">Last Name *</Label>
            <Input
              id="shippingLastName"
              value={formData.shippingAddress.lastName}
              onChange={(e) => updateShippingAddress('lastName', e.target.value)}
              className={errors.shippingLastName ? 'border-red-500' : ''}
            />
            {errors.shippingLastName && (
              <p className="text-red-500 text-sm mt-1">{errors.shippingLastName}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="shippingCompany">Company (Optional)</Label>
          <Input
            id="shippingCompany"
            value={formData.shippingAddress.company}
            onChange={(e) => updateShippingAddress('company', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="shippingAddressLine1">Address Line 1 *</Label>
          <Input
            id="shippingAddressLine1"
            value={formData.shippingAddress.addressLine1}
            onChange={(e) => updateShippingAddress('addressLine1', e.target.value)}
            className={errors.shippingAddressLine1 ? 'border-red-500' : ''}
          />
          {errors.shippingAddressLine1 && (
            <p className="text-red-500 text-sm mt-1">{errors.shippingAddressLine1}</p>
          )}
        </div>

        <div>
          <Label htmlFor="shippingAddressLine2">Address Line 2</Label>
          <Input
            id="shippingAddressLine2"
            value={formData.shippingAddress.addressLine2}
            onChange={(e) => updateShippingAddress('addressLine2', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="shippingCity">City *</Label>
            <Input
              id="shippingCity"
              value={formData.shippingAddress.city}
              onChange={(e) => updateShippingAddress('city', e.target.value)}
              className={errors.shippingCity ? 'border-red-500' : ''}
            />
            {errors.shippingCity && (
              <p className="text-red-500 text-sm mt-1">{errors.shippingCity}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="shippingState">State/Province</Label>
            <Input
              id="shippingState"
              value={formData.shippingAddress.state}
              onChange={(e) => updateShippingAddress('state', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="shippingPostalCode">Postal Code *</Label>
            <Input
              id="shippingPostalCode"
              value={formData.shippingAddress.postalCode}
              onChange={(e) => updateShippingAddress('postalCode', e.target.value)}
              className={errors.shippingPostalCode ? 'border-red-500' : ''}
            />
            {errors.shippingPostalCode && (
              <p className="text-red-500 text-sm mt-1">{errors.shippingPostalCode}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="shippingCountry">Country *</Label>
          <Select 
            value={formData.shippingAddress.country}
            onValueChange={(value) => updateShippingAddress('country', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Billing Address */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sameAsShipping"
            checked={formData.sameAsShipping}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, sameAsShipping: !!checked }))
            }
          />
          <Label htmlFor="sameAsShipping">
            Billing address same as shipping address
          </Label>
        </div>

        {!formData.sameAsShipping && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billingFirstName">First Name *</Label>
                  <Input
                    id="billingFirstName"
                    value={formData.billingAddress.firstName}
                    onChange={(e) => updateBillingAddress('firstName', e.target.value)}
                    className={errors.billingFirstName ? 'border-red-500' : ''}
                  />
                  {errors.billingFirstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingFirstName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="billingLastName">Last Name *</Label>
                  <Input
                    id="billingLastName"
                    value={formData.billingAddress.lastName}
                    onChange={(e) => updateBillingAddress('lastName', e.target.value)}
                    className={errors.billingLastName ? 'border-red-500' : ''}
                  />
                  {errors.billingLastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingLastName}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="billingAddressLine1">Address Line 1 *</Label>
                <Input
                  id="billingAddressLine1"
                  value={formData.billingAddress.addressLine1}
                  onChange={(e) => updateBillingAddress('addressLine1', e.target.value)}
                  className={errors.billingAddressLine1 ? 'border-red-500' : ''}
                />
                {errors.billingAddressLine1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingAddressLine1}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingCity">City *</Label>
                  <Input
                    id="billingCity"
                    value={formData.billingAddress.city}
                    onChange={(e) => updateBillingAddress('city', e.target.value)}
                    className={errors.billingCity ? 'border-red-500' : ''}
                  />
                  {errors.billingCity && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingCity}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="billingPostalCode">Postal Code *</Label>
                  <Input
                    id="billingPostalCode"
                    value={formData.billingAddress.postalCode}
                    onChange={(e) => updateBillingAddress('postalCode', e.target.value)}
                    className={errors.billingPostalCode ? 'border-red-500' : ''}
                  />
                  {errors.billingPostalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingPostalCode}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="billingCountry">Country *</Label>
                  <Select 
                    value={formData.billingAddress.country}
                    onValueChange={(value) => updateBillingAddress('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment */}
      {clientSecret && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-[#BD6A5C]" />
              <h3 className="text-lg font-semibold text-[#4B302D]">Payment Details</h3>
            </div>
            <PaymentElement />
          </div>
        </>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <RainbowButton 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || isLoading || (!clientSecret && !stripe)}
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {clientSecret ? 'Processing Payment...' : 'Preparing Checkout...'}
            </>
          ) : (
            clientSecret ? `Complete Order` : 'Continue to Payment'
          )}
        </RainbowButton>
      </div>
    </form>
  )
}
