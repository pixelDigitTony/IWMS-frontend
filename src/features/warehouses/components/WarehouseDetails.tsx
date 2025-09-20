import React from 'react';
import { Warehouse, getLocations } from '../api';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, User, Calendar, Building2 } from 'lucide-react';
import { LocationsTable } from './LocationsTable';

interface WarehouseDetailsProps {
  warehouse: Warehouse;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
}

export function WarehouseDetails({ warehouse, onEdit, onDelete }: WarehouseDetailsProps) {
  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ['locations', warehouse.id],
    queryFn: () => getLocations(warehouse.id),
  });

  const getCapacityPercentage = (warehouse: Warehouse) => {
    return Math.round((warehouse.usedCapacity / warehouse.totalCapacity) * 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{warehouse.name}</CardTitle>
              <p className="text-gray-600 mt-1">{warehouse.code}</p>
              {warehouse.description && (
                <p className="text-gray-700 mt-2">{warehouse.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Badge variant={warehouse.isActive ? 'default' : 'secondary'}>
                {warehouse.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">
                    {warehouse.address}<br />
                    {warehouse.city}, {warehouse.state} {warehouse.zipCode}<br />
                    {warehouse.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Manager</p>
                  <p className="text-gray-600">
                    {warehouse.managerName || 'Not assigned'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-gray-600">
                    {warehouse.usedCapacity.toLocaleString()} / {warehouse.totalCapacity.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span>{getCapacityPercentage(warehouse)}%</span>
                </div>
                <Progress
                  value={getCapacityPercentage(warehouse)}
                  className="h-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-gray-600">
                    {new Date(warehouse.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-gray-600">
                    {new Date(warehouse.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Locations ({locations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {locationsLoading ? (
            <div className="text-center py-8">Loading locations...</div>
          ) : (
            <LocationsTable
              locations={locations}
              onEdit={() => {}} // TODO: Implement location editing
              onDelete={() => {}} // TODO: Implement location deletion
              onView={() => {}} // TODO: Implement location viewing
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
