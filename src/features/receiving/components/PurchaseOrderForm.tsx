import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PurchaseOrder } from '../api';

const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'Supplier is required'),
  poNumber: z.string().min(1, 'PO number is required'),
  orderDate: z.string().min(1, 'Order date is required'),
  expectedDeliveryDate: z.string().min(1, 'Expected delivery date is required'),
  totalItems: z.number().min(1, 'Total items must be at least 1'),
  totalQuantity: z.number().min(1, 'Total quantity must be at least 1'),
  totalValue: z.number().min(0, 'Total value must be non-negative'),
  currency: z.string().min(1, 'Currency is required'),
  notes: z.string().optional(),
});

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrder;
  suppliers: Array<{ id: string; name: string }>;
  onSubmit: (data: PurchaseOrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PurchaseOrderForm({
  purchaseOrder,
  suppliers,
  onSubmit,
  onCancel,
  isLoading
}: PurchaseOrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplierId: purchaseOrder?.supplierId || '',
      poNumber: purchaseOrder?.poNumber || '',
      orderDate: purchaseOrder?.orderDate ? purchaseOrder.orderDate.split('T')[0] : '',
      expectedDeliveryDate: purchaseOrder?.expectedDeliveryDate ? purchaseOrder.expectedDeliveryDate.split('T')[0] : '',
      totalItems: purchaseOrder?.totalItems || 0,
      totalQuantity: purchaseOrder?.totalQuantity || 0,
      totalValue: purchaseOrder?.totalValue || 0,
      currency: purchaseOrder?.currency || 'USD',
      notes: purchaseOrder?.notes || '',
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {purchaseOrder ? 'Edit Purchase Order' : 'Create New Purchase Order'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierId">Supplier *</Label>
              <select
                id="supplierId"
                {...register('supplierId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {errors.supplierId && (
                <p className="text-sm text-red-600">{errors.supplierId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="poNumber">PO Number *</Label>
              <Input
                id="poNumber"
                {...register('poNumber')}
                placeholder="Enter PO number"
              />
              {errors.poNumber && (
                <p className="text-sm text-red-600">{errors.poNumber.message}</p>
              )}
            </div>
          </div>

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
              <Label htmlFor="expectedDeliveryDate">Expected Delivery Date *</Label>
              <Input
                id="expectedDeliveryDate"
                type="date"
                {...register('expectedDeliveryDate')}
              />
              {errors.expectedDeliveryDate && (
                <p className="text-sm text-red-600">{errors.expectedDeliveryDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="currency">Currency *</Label>
              <select
                id="currency"
                {...register('currency')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
              {errors.currency && (
                <p className="text-sm text-red-600">{errors.currency.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalValue">Total Value *</Label>
            <Input
              id="totalValue"
              type="number"
              step="0.01"
              {...register('totalValue', { valueAsNumber: true })}
              placeholder="Total order value"
            />
            {errors.totalValue && (
              <p className="text-sm text-red-600">{errors.totalValue.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Enter additional notes (optional)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (purchaseOrder ? 'Update PO' : 'Create PO')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
