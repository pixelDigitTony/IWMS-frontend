import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Location } from '../api';

const locationSchema = z.object({
  warehouseId: z.string().min(1, 'Warehouse is required'),
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  type: z.enum(['ZONE', 'BIN', 'SHELF', 'RACK']),
  capacity: z.number().min(1, 'Capacity must be greater than 0'),
  isActive: z.boolean(),
  parentLocationId: z.string().optional(),
  attributes: z.record(z.any()).optional(),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface LocationFormProps {
  location?: Location;
  warehouses: Array<{ id: string; name: string }>;
  parentLocations?: Array<{ id: string; name: string }>;
  onSubmit: (data: LocationFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LocationForm({
  location,
  warehouses,
  parentLocations = [],
  onSubmit,
  onCancel,
  isLoading
}: LocationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      warehouseId: location?.warehouseId || '',
      name: location?.name || '',
      code: location?.code || '',
      type: location?.type || 'ZONE',
      capacity: location?.capacity || 0,
      isActive: location?.isActive ?? true,
      parentLocationId: location?.parentLocationId || '',
      attributes: location?.attributes || {},
    },
  });

  const isActive = watch('isActive');
  const selectedType = watch('type');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {location ? 'Edit Location' : 'Create New Location'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warehouseId">Warehouse *</Label>
              <select
                id="warehouseId"
                {...register('warehouseId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              {errors.warehouseId && (
                <p className="text-sm text-red-600">{errors.warehouseId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Location Type *</Label>
              <select
                id="type"
                {...register('type')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ZONE">Zone</option>
                <option value="BIN">Bin</option>
                <option value="SHELF">Shelf</option>
                <option value="RACK">Rack</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter location name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Location Code *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="Enter location code"
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity *</Label>
            <Input
              id="capacity"
              type="number"
              {...register('capacity', { valueAsNumber: true })}
              placeholder="Enter capacity"
            />
            {errors.capacity && (
              <p className="text-sm text-red-600">{errors.capacity.message}</p>
            )}
          </div>

          {parentLocations.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="parentLocationId">Parent Location</Label>
              <select
                id="parentLocationId"
                {...register('parentLocationId')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">No parent</option>
                {parentLocations.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              {isLoading ? 'Saving...' : (location ? 'Update Location' : 'Create Location')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
