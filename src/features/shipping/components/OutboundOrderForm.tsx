import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OutboundOrder } from '../api';

const outboundOrderSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  orderNumber: z.string().min(1, 'Order number is required'),
  orderDate: z.string().min(1, 'Order date is required'),
  requestedShipDate: z.string().min(1, 'Requested ship date is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  totalItems: z.number().min(1, 'Total items must be at least 1'),
  totalQuantity: z.number().min(1, 'Total quantity must be at least 1'),
  totalWeight: z.number().min(0, 'Total weight must be non-negative'),
  totalVolume: z.number().min(0, 'Total volume must be non-negative'),
  shippingMethod: z.string().min(1, 'Shipping method is required'),
  carrier: z.string().min(1, 'Carrier is required'),
  estimatedShippingCost: z.number().min(0, 'Shipping cost must be non-negative'),
  specialInstructions: z.string().optional(),
  shippingAddress: z.object({
    company: z.string().min(1, 'Company is required'),
    contact: z.string().min(1, 'Contact is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
});

type OutboundOrderFormData = z.infer<typeof outboundOrderSchema>;

interface OutboundOrderFormProps {
  order?: OutboundOrder;
  customers: Array<{ id: string; name: string }>;
  onSubmit: (data: OutboundOrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function OutboundOrderForm({
  order,
  customers,
  onSubmit,
  onCancel,
  isLoading
}: OutboundOrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OutboundOrderFormData>({
    resolver: zodResolver(outboundOrderSchema),
    defaultValues: {
      customerId: order?.customerId || '',
      orderNumber: order?.orderNumber || '',
      orderDate: order?.orderDate ? order.orderDate.split('T')[0] : '',
      requestedShipDate: order?.requestedShipDate ? order.requestedShipDate.split('T')[0] : '',
      priority: order?.priority || 'MEDIUM',
      totalItems: order?.totalItems || 0,
      totalQuantity: order?.totalQuantity || 0,
      totalWeight: order?.totalWeight || 0,
      totalVolume: order?.totalVolume || 0,
      shippingMethod: order?.shippingMethod || '',
      carrier: order?.carrier || '',
      estimatedShippingCost: order?.estimatedShippingCost || 0,
      specialInstructions: order?.specialInstructions || '',
      shippingAddress: {
        company: order?.shippingAddress.company || '',
        contact: order?.shippingAddress.contact || '',
        address: order?.shippingAddress.address || '',
        city: order?.shippingAddress.city || '',
        state: order?.shippingAddress.state || '',
        zipCode: order?.shippingAddress.zipCode || '',
        country: order?.shippingAddress.country || '',
      },
    },
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {order ? 'Edit Outbound Order' : 'Create New Outbound Order'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer *</Label>
              <select
                id="customerId"
                {...register('customerId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-sm text-red-600">{errors.customerId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number *</Label>
              <Input
                id="orderNumber"
                {...register('orderNumber')}
                placeholder="Enter order number"
              />
              {errors.orderNumber && (
                <p className="text-sm text-red-600">{errors.orderNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                {...register('priority')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date *</Label>
              <Input
                id="orderDate"
                type="date"
                {...register('orderDate')}
              />
              {errors.orderDate && (
                <p className="text-sm text-red-600">{errors.orderDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestedShipDate">Requested Ship Date *</Label>
              <Input
                id="requestedShipDate"
                type="date"
                {...register('requestedShipDate')}
              />
              {errors.requestedShipDate && (
                <p className="text-sm text-red-600">{errors.requestedShipDate.message}</p>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalItems">Total Items *</Label>
              <Input
                id="totalItems"
                type="number"
                {...register('totalItems', { valueAsNumber: true })}
                placeholder="Total items"
              />
              {errors.totalItems && (
                <p className="text-sm text-red-600">{errors.totalItems.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalQuantity">Total Quantity *</Label>
              <Input
                id="totalQuantity"
                type="number"
                {...register('totalQuantity', { valueAsNumber: true })}
                placeholder="Total quantity"
              />
              {errors.totalQuantity && (
                <p className="text-sm text-red-600">{errors.totalQuantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalWeight">Total Weight (kg)</Label>
              <Input
                id="totalWeight"
                type="number"
                step="0.1"
                {...register('totalWeight', { valueAsNumber: true })}
                placeholder="Total weight"
              />
              {errors.totalWeight && (
                <p className="text-sm text-red-600">{errors.totalWeight.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalVolume">Total Volume (m³)</Label>
              <Input
                id="totalVolume"
                type="number"
                step="0.01"
                {...register('totalVolume', { valueAsNumber: true })}
                placeholder="Total volume"
              />
              {errors.totalVolume && (
                <p className="text-sm text-red-600">{errors.totalVolume.message}</p>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shippingMethod">Shipping Method *</Label>
              <select
                id="shippingMethod"
                {...register('shippingMethod')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select method</option>
                <option value="Ground">Ground</option>
                <option value="Express">Express</option>
                <option value="Freight">Freight</option>
                <option value="Overnight">Overnight</option>
              </select>
              {errors.shippingMethod && (
                <p className="text-sm text-red-600">{errors.shippingMethod.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier *</Label>
              <select
                id="carrier"
                {...register('carrier')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select carrier</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="DHL">DHL</option>
                <option value="USPS">USPS</option>
              </select>
              {errors.carrier && (
                <p className="text-sm text-red-600">{errors.carrier.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedShippingCost">Shipping Cost *</Label>
              <Input
                id="estimatedShippingCost"
                type="number"
                step="0.01"
                {...register('estimatedShippingCost', { valueAsNumber: true })}
                placeholder="Estimated cost"
              />
              {errors.estimatedShippingCost && (
                <p className="text-sm text-red-600">{errors.estimatedShippingCost.message}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress.company">Company *</Label>
                  <Input
                    id="shippingAddress.company"
                    {...register('shippingAddress.company')}
                    placeholder="Company name"
                  />
                  {errors.shippingAddress?.company && (
                    <p className="text-sm text-red-600">{errors.shippingAddress.company.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingAddress.contact">Contact Person *</Label>
                  <Input
                    id="shippingAddress.contact"
                    {...register('shippingAddress.contact')}
                    placeholder="Contact person"
                  />
                  {errors.shippingAddress?.contact && (
                    <p className="text-sm text-red-600">{errors.shippingAddress.contact.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress.address">Address *</Label>
                <Input
                  id="shippingAddress.address"
                  {...register('shippingAddress.address')}
                  placeholder="Street address"
                />
                {errors.shippingAddress?.address && (
                  <p className="text-sm text-red-600">{errors.shippingAddress.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress.city">City *</Label>
                  <Input
                    id="shippingAddress.city"
                    {...register('shippingAddress.city')}
                    placeholder="City"
                  />
                  {errors.shippingAddress?.city && (
                    <p className="text-sm text-red-600">{errors.shippingAddress.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingAddress.state">State *</Label>
                  <Input
                    id="shippingAddress.state"
                    {...register('shippingAddress.state')}
                    placeholder="State"
                  />
                  {errors.shippingAddress?.state && (
                    <p className="text-sm text-red-600">{errors.shippingAddress.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingAddress.zipCode">ZIP Code *</Label>
                  <Input
                    id="shippingAddress.zipCode"
                    {...register('shippingAddress.zipCode')}
                    placeholder="ZIP code"
                  />
                  {errors.shippingAddress?.zipCode && (
                    <p className="text-sm text-red-600">{errors.shippingAddress.zipCode.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingAddress.country">Country *</Label>
                  <Input
                    id="shippingAddress.country"
                    {...register('shippingAddress.country')}
                    placeholder="Country"
                  />
                  {errors.shippingAddress?.country && (
                    <p className="text-sm text-red-600">{errors.shippingAddress.country.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              {...register('specialInstructions')}
              placeholder="Enter special shipping instructions (optional)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (order ? 'Update Order' : 'Create Order')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
