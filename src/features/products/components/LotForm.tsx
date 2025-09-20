import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lot } from '../api';

const lotSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  lotNumber: z.string().min(1, 'Lot number is required'),
  expiryDate: z.string().optional(),
  manufactureDate: z.string().optional(),
  supplierBatchNumber: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be greater than 0'),
  reservedQuantity: z.number().min(0, 'Reserved quantity must be non-negative'),
  availableQuantity: z.number().min(0, 'Available quantity must be non-negative'),
  locationId: z.string().optional(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'QUARANTINE', 'CONSUMED']),
  attributes: z.record(z.any()).optional(),
});

type LotFormData = z.infer<typeof lotSchema>;

interface LotFormProps {
  lot?: Lot;
  products: Array<{ id: string; name: string; sku: string }>;
  locations?: Array<{ id: string; name: string }>;
  onSubmit: (data: LotFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LotForm({
  lot,
  products,
  locations = [],
  onSubmit,
  onCancel,
  isLoading
}: LotFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LotFormData>({
    resolver: zodResolver(lotSchema),
    defaultValues: {
      productId: lot?.productId || '',
      lotNumber: lot?.lotNumber || '',
      expiryDate: lot?.expiryDate || '',
      manufactureDate: lot?.manufactureDate || '',
      supplierBatchNumber: lot?.supplierBatchNumber || '',
      quantity: lot?.quantity || 0,
      reservedQuantity: lot?.reservedQuantity || 0,
      availableQuantity: lot?.availableQuantity || 0,
      locationId: lot?.locationId || '',
      status: lot?.status || 'ACTIVE',
      attributes: lot?.attributes || {},
    },
  });

  const selectedStatus = watch('status');
  const quantity = watch('quantity');
  const reservedQuantity = watch('reservedQuantity');

  // Auto-calculate available quantity
  React.useEffect(() => {
    const available = quantity - reservedQuantity;
    if (available >= 0) {
      setValue('availableQuantity', available);
    }
  }, [quantity, reservedQuantity, setValue]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {lot ? 'Edit Lot' : 'Create New Lot'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product *</Label>
              <select
                id="productId"
                {...register('productId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
              {errors.productId && (
                <p className="text-sm text-red-600">{errors.productId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lotNumber">Lot Number *</Label>
              <Input
                id="lotNumber"
                {...register('lotNumber')}
                placeholder="Enter lot number"
              />
              {errors.lotNumber && (
                <p className="text-sm text-red-600">{errors.lotNumber.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufactureDate">Manufacture Date</Label>
              <Input
                id="manufactureDate"
                type="date"
                {...register('manufactureDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                {...register('expiryDate')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierBatchNumber">Supplier Batch Number</Label>
            <Input
              id="supplierBatchNumber"
              {...register('supplierBatchNumber')}
              placeholder="Enter supplier batch number"
            />
          </div>

          {locations.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="locationId">Location</Label>
              <select
                id="locationId"
                {...register('locationId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select location (optional)</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register('status')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="QUARANTINE">Quarantine</option>
              <option value="CONSUMED">Consumed</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Total Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                placeholder="Enter total quantity"
              />
              {errors.quantity && (
                <p className="text-sm text-red-600">{errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservedQuantity">Reserved Quantity</Label>
              <Input
                id="reservedQuantity"
                type="number"
                {...register('reservedQuantity', { valueAsNumber: true })}
                placeholder="Enter reserved quantity"
              />
              {errors.reservedQuantity && (
                <p className="text-sm text-red-600">{errors.reservedQuantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableQuantity">Available Quantity</Label>
              <Input
                id="availableQuantity"
                type="number"
                {...register('availableQuantity', { valueAsNumber: true })}
                placeholder="Auto-calculated"
                readOnly
                className="bg-gray-50"
              />
              {errors.availableQuantity && (
                <p className="text-sm text-red-600">{errors.availableQuantity.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (lot ? 'Update Lot' : 'Create Lot')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
