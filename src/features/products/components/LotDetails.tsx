import React from 'react';
import { Lot } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package2, Calendar, MapPin, Settings, AlertTriangle } from 'lucide-react';

interface LotDetailsProps {
  lot: Lot;
  onEdit: (lot: Lot) => void;
  onDelete: (lot: Lot) => void;
}

export function LotDetails({ lot, onEdit, onDelete }: LotDetailsProps) {
  const getStatusColor = (status: Lot['status']) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      case 'QUARANTINE': return 'bg-yellow-100 text-yellow-800';
      case 'CONSUMED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityPercentage = (lot: Lot) => {
    return Math.round((lot.availableQuantity / lot.quantity) * 100);
  };

  const isExpired = (lot: Lot) => {
    return lot.expiryDate && new Date(lot.expiryDate) < new Date();
  };

  const isLowStock = (lot: Lot) => {
    return lot.availableQuantity < (lot.quantity * 0.1); // Less than 10% available
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{lot.productName}</CardTitle>
              <p className="text-gray-600 mt-1">Lot: {lot.lotNumber}</p>
              <p className="text-gray-600">SKU: {lot.productSku}</p>
            </div>
            <div className="flex space-x-2">
              <Badge className={getStatusColor(lot.status)}>
                {lot.status}
              </Badge>
              {isExpired(lot) && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Expired
                </Badge>
              )}
              {isLowStock(lot) && (
                <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                  <Package2 className="h-3 w-3 mr-1" />
                  Low Stock
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div>
                <p className="font-medium">Quantity Overview</p>
                <div className="space-y-2 mt-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {lot.availableQuantity.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Available: {lot.availableQuantity.toLocaleString()}<br />
                    Reserved: {lot.reservedQuantity.toLocaleString()}<br />
                    Total: {lot.quantity.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium">Availability</p>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>{getAvailabilityPercentage(lot)}%</span>
                  </div>
                  <Progress
                    value={getAvailabilityPercentage(lot)}
                    className="h-2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600">
                    {lot.locationName || 'Not assigned'}
                  </p>
                </div>
              </div>

              {lot.supplierBatchNumber && (
                <div>
                  <p className="font-medium">Supplier Batch</p>
                  <p className="text-gray-600">{lot.supplierBatchNumber}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {lot.manufactureDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Manufacture Date</p>
                    <p className="text-gray-600">
                      {new Date(lot.manufactureDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {lot.expiryDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Expiry Date</p>
                    <p className={`text-gray-600 ${isExpired(lot) ? 'text-red-600 font-semibold' : ''}`}>
                      {new Date(lot.expiryDate).toLocaleDateString()}
                      {isExpired(lot) && ' (EXPIRED)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.keys(lot.attributes).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Lot Attributes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(lot.attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                  <Badge variant="outline">{String(value)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Created</p>
                <p className="text-sm text-gray-600">
                  {new Date(lot.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {lot.updatedAt !== lot.createdAt && (
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-gray-600">
                    {new Date(lot.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
