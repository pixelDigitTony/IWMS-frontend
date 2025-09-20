import React from 'react';
import { Location } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Package, Calendar, Settings } from 'lucide-react';

interface LocationDetailsProps {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
}

export function LocationDetails({ location, onEdit, onDelete }: LocationDetailsProps) {
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{location.name}</CardTitle>
              <p className="text-gray-600 mt-1">{location.code}</p>
            </div>
            <div className="flex space-x-2">
              <Badge className={getTypeColor(location.type)}>
                {location.type}
              </Badge>
              <Badge variant={location.isActive ? 'default' : 'secondary'}>
                {location.isActive ? 'Active' : 'Inactive'}
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
                  <p className="font-medium">Warehouse</p>
                  <p className="text-gray-600">{location.warehouseName}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Parent Location</p>
                  <p className="text-gray-600">
                    {location.parentLocationName || 'None'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-gray-600">
                    {location.usedCapacity.toLocaleString()} / {location.capacity.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span>{getCapacityPercentage(location)}%</span>
                </div>
                <Progress
                  value={getCapacityPercentage(location)}
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
                    {new Date(location.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-gray-600">
                    {new Date(location.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.keys(location.attributes).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Attributes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(location.attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                  <Badge variant="outline">{String(value)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
