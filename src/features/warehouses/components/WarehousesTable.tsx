import React from 'react';
import { Warehouse } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, Eye } from 'lucide-react';

interface WarehousesTableProps {
  warehouses: Warehouse[];
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
  onView: (warehouse: Warehouse) => void;
}

export function WarehousesTable({ warehouses, onEdit, onDelete, onView }: WarehousesTableProps) {
  const getCapacityPercentage = (warehouse: Warehouse) => {
    return Math.round((warehouse.usedCapacity / warehouse.totalCapacity) * 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {warehouses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No warehouses found. Create your first warehouse to get started.
            </div>
          ) : (
            warehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{warehouse.name}</h3>
                    <p className="text-sm text-gray-600">{warehouse.code}</p>
                    {warehouse.description && (
                      <p className="text-sm text-gray-500 mt-1">{warehouse.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={warehouse.isActive ? 'default' : 'secondary'}>
                      {warehouse.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(warehouse)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(warehouse)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(warehouse)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">
                      {warehouse.address}<br />
                      {warehouse.city}, {warehouse.state} {warehouse.zipCode}<br />
                      {warehouse.country}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Manager</p>
                    <p className="text-gray-600">
                      {warehouse.managerName || 'Not assigned'}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Capacity Usage</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{warehouse.usedCapacity.toLocaleString()} / {warehouse.totalCapacity.toLocaleString()}</span>
                        <span>{getCapacityPercentage(warehouse)}%</span>
                      </div>
                      <Progress
                        value={getCapacityPercentage(warehouse)}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
