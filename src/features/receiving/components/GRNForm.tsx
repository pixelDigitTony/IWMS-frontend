import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoodsReceiptNote } from '../api';

const grnSchema = z.object({
  asnId: z.string().optional(),
  poId: z.string().optional(),
  supplierId: z.string().min(1, 'Supplier is required'),
  receivedDate: z.string().min(1, 'Received date is required'),
  receivedBy: z.string().min(1, 'Received by is required'),
  totalItems: z.number().min(1, 'Total items must be at least 1'),
  totalQuantityReceived: z.number().min(0, 'Total quantity received must be non-negative'),
  totalValueReceived: z.number().min(0, 'Total value received must be non-negative'),
  notes: z.string().optional(),
});

type GRNFormData = z.infer<typeof grnSchema>;

interface GRNFormProps {
  grn?: GoodsReceiptNote;
  suppliers: Array<{ id: string; name: string }>;
  asns: Array<{ id: string; asnNumber: string; poNumber: string }>;
  pos: Array<{ id: string; poNumber: string }>;
  onSubmit: (data: GRNFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function GRNForm({
  grn,
  suppliers,
  asns,
  pos,
  onSubmit,
  onCancel,
  isLoading
}: GRNFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<GRNFormData>({
    resolver: zodResolver(grnSchema),
    defaultValues: {
      asnId: grn?.asnId || '',
      poId: grn?.poId || '',
      supplierId: grn?.supplierId || '',
      receivedDate: grn?.receivedDate ? grn.receivedDate.split('T')[0] : '',
      receivedBy: grn?.receivedBy || '',
      totalItems: grn?.totalItems || 0,
      totalQuantityReceived: grn?.totalQuantityReceived || 0,
      totalValueReceived: grn?.totalValueReceived || 0,
      notes: grn?.notes || '',
    },
  });

  const selectedSupplier = watch('supplierId');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {grn ? 'Edit Goods Receipt Note' : 'Create New Goods Receipt Note'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asnId">ASN (Optional)</Label>
              <select
                id="asnId"
                {...register('asnId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">No ASN</option>
                {asns.map((asn) => (
                  <option key={asn.id} value={asn.id}>
                    {asn.asnNumber} (PO: {asn.poNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poId">PO (Optional)</Label>
              <select
                id="poId"
                {...register('poId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">No PO</option>
                {pos.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.poNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receivedDate">Received Date *</Label>
              <Input
                id="receivedDate"
                type="date"
                {...register('receivedDate')}
              />
              {errors.receivedDate && (
                <p className="text-sm text-red-600">{errors.receivedDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivedBy">Received By *</Label>
              <Input
                id="receivedBy"
                {...register('receivedBy')}
                placeholder="Enter receiver name"
              />
              {errors.receivedBy && (
                <p className="text-sm text-red-600">{errors.receivedBy.message}</p>
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
              <Label htmlFor="totalQuantityReceived">Quantity Received *</Label>
              <Input
                id="totalQuantityReceived"
                type="number"
                {...register('totalQuantityReceived', { valueAsNumber: true })}
                placeholder="Total quantity"
              />
              {errors.totalQuantityReceived && (
                <p className="text-sm text-red-600">{errors.totalQuantityReceived.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalValueReceived">Value Received *</Label>
              <Input
                id="totalValueReceived"
                type="number"
                step="0.01"
                {...register('totalValueReceived', { valueAsNumber: true })}
                placeholder="Total value"
              />
              {errors.totalValueReceived && (
                <p className="text-sm text-red-600">{errors.totalValueReceived.message}</p>
              )}
            </div>
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
              {isLoading ? 'Saving...' : (grn ? 'Update GRN' : 'Create GRN')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
