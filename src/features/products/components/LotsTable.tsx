import React from 'react';
import { Lot } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, Eye, Package2, AlertTriangle } from 'lucide-react';

interface LotsTableProps {
  lots: Lot[];
  onEdit: (lot: Lot) => void;
  onDelete: (lot: Lot) => void;
  onView: (lot: Lot) => void;
}

export function LotsTable({ lots, onEdit, onDelete, onView }: LotsTableProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Lots</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No lots found. Create your first lot to get started.
            </div>
          ) : (
            lots.map((lot) => (
              <div
                key={lot.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  isExpired(lot) ? 'border-red-200 bg-red-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{lot.productName}</h3>
                    <p className="text-sm text-gray-600">{lot.lotNumber}</p>
                  </div>
                  <div className="flex items-center space-x-2">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(lot)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(lot)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(lot)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Product SKU</p>
                    <p className="text-gray-600">{lot.productSku}</p>
                  </div>

                  <div>
                    <p className="font-medium">Quantity</p>
                    <p className="text-gray-600">
                      Available: {lot.availableQuantity.toLocaleString()}<br />
                      Reserved: {lot.reservedQuantity.toLocaleString()}<br />
                      Total: {lot.quantity.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Availability</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{getAvailabilityPercentage(lot)}%</span>
                      </div>
                      <Progress
                        value={getAvailabilityPercentage(lot)}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">
                      {lot.locationName || 'Not assigned'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {lot.manufactureDate && (
                    <div>
                      <p className="font-medium text-sm">Manufacture Date</p>
                      <p className="text-gray-600">
                        {new Date(lot.manufactureDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {lot.expiryDate && (
                    <div>
                      <p className="font-medium text-sm">Expiry Date</p>
                      <p className={`text-gray-600 ${isExpired(lot) ? 'text-red-600 font-semibold' : ''}`}>
                        {new Date(lot.expiryDate).toLocaleDateString()}
                        {isExpired(lot) && ' (EXPIRED)'}
                      </p>
                    </div>
                  )}
                </div>

                {lot.supplierBatchNumber && (
                  <div className="mt-3">
                    <p className="font-medium text-sm">Supplier Batch</p>
                    <p className="text-gray-600">{lot.supplierBatchNumber}</p>
                  </div>
                )}

                {Object.keys(lot.attributes).length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-sm mb-2">Attributes</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(lot.attributes).map(([key, value]) => (
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
