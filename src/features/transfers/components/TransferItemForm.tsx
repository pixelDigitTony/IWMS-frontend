import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { TransferItem } from '../api';

const transferItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  requestedQuantity: z.number().min(1, 'Quantity must be greater than 0'),
  notes: z.string().optional(),
});

type TransferItemFormData = {
  items: Array<{
    productId: string;
    requestedQuantity: number;
    notes?: string;
  }>;
};

interface TransferItemFormProps {
  transferId?: string;
  products: Array<{ id: string; name: string; sku: string }>;
  existingItems?: TransferItem[];
  onSubmit: (data: TransferItemFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TransferItemForm({
  transferId,
  products,
  existingItems = [],
  onSubmit,
  onCancel,
  isLoading
}: TransferItemFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<TransferItemFormData>({
    resolver: zodResolver(z.object({
      items: z.array(transferItemSchema).min(1, 'At least one item is required')
    })),
    defaultValues: {
      items: existingItems.length > 0
        ? existingItems.map(item => ({
            productId: item.productId,
            requestedQuantity: item.requestedQuantity,
            notes: item.notes || '',
          }))
        : [{ productId: '', requestedQuantity: 0, notes: '' }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  const addItem = () => {
    append({ productId: '', requestedQuantity: 0, notes: '' });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {transferId ? 'Edit Transfer Items' : 'Add Transfer Items'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Item {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`items.${index}.productId`}>Product *</Label>
                    <select
                      id={`items.${index}.productId`}
                      {...register(`items.${index}.productId`)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                    {errors.items?.[index]?.productId && (
                      <p className="text-sm text-red-600">
                        {errors.items[index]?.productId?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`items.${index}.requestedQuantity`}>
                      Quantity *
                    </Label>
                    <Input
                      id={`items.${index}.requestedQuantity`}
                      type="number"
                      {...register(`items.${index}.requestedQuantity`, {
                        valueAsNumber: true
                      })}
                      placeholder="Enter quantity"
                    />
                    {errors.items?.[index]?.requestedQuantity && (
                      <p className="text-sm text-red-600">
                        {errors.items[index]?.requestedQuantity?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`items.${index}.notes`}>Notes</Label>
                    <Input
                      id={`items.${index}.notes`}
                      {...register(`items.${index}.notes`)}
                      placeholder="Optional notes"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Item
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Items'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
