import React from 'react';
import { Location } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, Eye } from 'lucide-react';

interface LocationsTableProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
  onView: (location: Location) => void;
}

export function LocationsTable({ locations, onEdit, onDelete, onView }: LocationsTableProps) {
  const getCapacityPercentage = (location: Location) => {
    return Math.round((location.usedCapacity / location.capacity) * 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTypeColor = (type: Location['type']) => {
    switch (type) {
      case 'ZONE': return 'bg-blue-100 text-blue-800';
      case 'BIN': return 'bg-green-100 text-green-800';
      case 'SHELF': return 'bg-yellow-100 text-yellow-800';
      case 'RACK': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No locations found. Create your first location to get started.
            </div>
          ) : (
            locations.map((location) => (
              <div
                key={location.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.code}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(location.type)}>
                      {location.type}
                    </Badge>
                    <Badge variant={location.isActive ? 'default' : 'secondary'}>
                      {location.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(location)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(location)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Warehouse</p>
                    <p className="text-gray-600">{location.warehouseName}</p>
                  </div>

                  <div>
                    <p className="font-medium">Parent Location</p>
                    <p className="text-gray-600">
                      {location.parentLocationName || 'None'}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Capacity Usage</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{location.usedCapacity.toLocaleString()} / {location.capacity.toLocaleString()}</span>
                        <span>{getCapacityPercentage(location)}%</span>
                      </div>
                      <Progress
                        value={getCapacityPercentage(location)}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                {Object.keys(location.attributes).length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-sm mb-2">Attributes</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(location.attributes).map(([key, value]) => (
                        <Badge key={key} variant="outline">
                          {key}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
