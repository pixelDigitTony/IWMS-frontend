import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '../api';

const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  unitOfMeasureId: z.string().min(1, 'Unit of measure is required'),
  barcode: z.string().optional(),
  minimumStockLevel: z.number().min(0, 'Minimum stock level must be non-negative'),
  maximumStockLevel: z.number().min(0, 'Maximum stock level must be non-negative'),
  isActive: z.boolean(),
  attributes: z.record(z.any()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  categories: Array<{ id: string; name: string }>;
  unitsOfMeasure: Array<{ id: string; name: string; code: string }>;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  categories,
  unitsOfMeasure,
  onSubmit,
  onCancel,
  isLoading
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: product?.sku || '',
      name: product?.name || '',
      description: product?.description || '',
      categoryId: product?.categoryId || '',
      unitOfMeasureId: product?.unitOfMeasureId || '',
      barcode: product?.barcode || '',
      minimumStockLevel: product?.minimumStockLevel || 0,
      maximumStockLevel: product?.maximumStockLevel || 0,
      isActive: product?.isActive ?? true,
      attributes: product?.attributes || {},
    },
  });

  const isActive = watch('isActive');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {product ? 'Edit Product' : 'Create New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                {...register('sku')}
                placeholder="Enter SKU"
              />
              {errors.sku && (
                <p className="text-sm text-red-600">{errors.sku.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <select
                id="categoryId"
                {...register('categoryId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitOfMeasureId">Unit of Measure *</Label>
              <select
                id="unitOfMeasureId"
                {...register('unitOfMeasureId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select unit of measure</option>
                {unitsOfMeasure.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.code})
                  </option>
                ))}
              </select>
              {errors.unitOfMeasureId && (
                <p className="text-sm text-red-600">{errors.unitOfMeasureId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              {...register('barcode')}
              placeholder="Enter barcode (optional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimumStockLevel">Minimum Stock Level</Label>
              <Input
                id="minimumStockLevel"
                type="number"
                {...register('minimumStockLevel', { valueAsNumber: true })}
                placeholder="Enter minimum stock level"
              />
              {errors.minimumStockLevel && (
                <p className="text-sm text-red-600">{errors.minimumStockLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maximumStockLevel">Maximum Stock Level</Label>
              <Input
                id="maximumStockLevel"
                type="number"
                {...register('maximumStockLevel', { valueAsNumber: true })}
                placeholder="Enter maximum stock level"
              />
              {errors.maximumStockLevel && (
                <p className="text-sm text-red-600">{errors.maximumStockLevel.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
