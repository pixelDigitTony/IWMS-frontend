import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransferRequest } from '../api';

const transferSchema = z.object({
  fromWarehouseId: z.string().min(1, 'From warehouse is required'),
  toWarehouseId: z.string().min(1, 'To warehouse is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFormProps {
  transfer?: TransferRequest;
  warehouses: Array<{ id: string; name: string }>;
  onSubmit: (data: TransferFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TransferForm({
  transfer,
  warehouses,
  onSubmit,
  onCancel,
  isLoading
}: TransferFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromWarehouseId: transfer?.fromWarehouseId || '',
      toWarehouseId: transfer?.toWarehouseId || '',
      priority: transfer?.priority || 'MEDIUM',
      reason: transfer?.reason || '',
      notes: transfer?.notes || '',
    },
  });

  const selectedFromWarehouse = watch('fromWarehouseId');
  const availableToWarehouses = warehouses.filter(w => w.id !== selectedFromWarehouse);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {transfer ? 'Edit Transfer Request' : 'Create New Transfer Request'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromWarehouseId">From Warehouse *</Label>
              <select
                id="fromWarehouseId"
                {...register('fromWarehouseId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select source warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              {errors.fromWarehouseId && (
                <p className="text-sm text-red-600">{errors.fromWarehouseId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toWarehouseId">To Warehouse *</Label>
              <select
                id="toWarehouseId"
                {...register('toWarehouseId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={!selectedFromWarehouse}
              >
                <option value="">Select destination warehouse</option>
                {availableToWarehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              {errors.toWarehouseId && (
                <p className="text-sm text-red-600">{errors.toWarehouseId.message}</p>
              )}
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder="Enter reason for transfer"
              rows={3}
            />
            {errors.reason && (
              <p className="text-sm text-red-600">{errors.reason.message}</p>
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
              {isLoading ? 'Saving...' : (transfer ? 'Update Transfer' : 'Create Transfer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
