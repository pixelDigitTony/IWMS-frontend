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
import { UnitOfMeasure } from '../api';

const unitOfMeasureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  type: z.enum(['COUNT', 'WEIGHT', 'VOLUME', 'LENGTH', 'AREA']),
  baseUnit: z.string().min(1, 'Base unit is required'),
  conversionFactor: z.number().min(0.0001, 'Conversion factor must be greater than 0'),
  isActive: z.boolean(),
});

type UnitOfMeasureFormData = z.infer<typeof unitOfMeasureSchema>;

interface UnitOfMeasureFormProps {
  unitOfMeasure?: UnitOfMeasure;
  onSubmit: (data: UnitOfMeasureFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UnitOfMeasureForm({
  unitOfMeasure,
  onSubmit,
  onCancel,
  isLoading
}: UnitOfMeasureFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UnitOfMeasureFormData>({
    resolver: zodResolver(unitOfMeasureSchema),
    defaultValues: {
      name: unitOfMeasure?.name || '',
      code: unitOfMeasure?.code || '',
      description: unitOfMeasure?.description || '',
      type: unitOfMeasure?.type || 'COUNT',
      baseUnit: unitOfMeasure?.baseUnit || '',
      conversionFactor: unitOfMeasure?.conversionFactor || 1,
      isActive: unitOfMeasure?.isActive ?? true,
    },
  });

  const isActive = watch('isActive');
  const selectedType = watch('type');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {unitOfMeasure ? 'Edit Unit of Measure' : 'Create New Unit of Measure'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Unit Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter unit name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Unit Code *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="Enter unit code (e.g., KG, EA)"
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter unit description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Unit Type *</Label>
              <select
                id="type"
                {...register('type')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="COUNT">Count</option>
                <option value="WEIGHT">Weight</option>
                <option value="VOLUME">Volume</option>
                <option value="LENGTH">Length</option>
                <option value="AREA">Area</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseUnit">Base Unit *</Label>
              <Input
                id="baseUnit"
                {...register('baseUnit')}
                placeholder="Enter base unit (e.g., KG for grams)"
              />
              {errors.baseUnit && (
                <p className="text-sm text-red-600">{errors.baseUnit.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conversionFactor">Conversion Factor *</Label>
            <Input
              id="conversionFactor"
              type="number"
              step="0.0001"
              {...register('conversionFactor', { valueAsNumber: true })}
              placeholder="Enter conversion factor to base unit"
            />
            {errors.conversionFactor && (
              <p className="text-sm text-red-600">{errors.conversionFactor.message}</p>
            )}
            <p className="text-xs text-gray-500">
              How many of this unit equal one base unit? (e.g., 1000 for grams to kilograms)
            </p>
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
              {isLoading ? 'Saving...' : (unitOfMeasure ? 'Update Unit' : 'Create Unit')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
