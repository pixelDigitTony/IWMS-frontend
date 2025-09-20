import React from 'react';
import { TransferItem } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Edit, CheckCircle, Clock, Package, Truck } from 'lucide-react';

interface TransferItemsTableProps {
  items: TransferItem[];
  onEdit?: (item: TransferItem) => void;
  showActions?: boolean;
}

export function TransferItemsTable({ items, onEdit, showActions = true }: TransferItemsTableProps) {
  const getProgressPercentage = (item: TransferItem) => {
    return Math.round((item.pickedQuantity / item.requestedQuantity) * 100);
  };

  const getStatusColor = (item: TransferItem) => {
    if (item.receivedQuantity >= item.requestedQuantity) {
      return 'bg-green-100 text-green-800';
    } else if (item.shippedQuantity >= item.requestedQuantity) {
      return 'bg-blue-100 text-blue-800';
    } else if (item.packedQuantity >= item.requestedQuantity) {
      return 'bg-purple-100 text-purple-800';
    } else if (item.pickedQuantity >= item.requestedQuantity) {
      return 'bg-indigo-100 text-indigo-800';
    } else if (item.allocatedQuantity >= item.requestedQuantity) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (item: TransferItem) => {
    if (item.receivedQuantity >= item.requestedQuantity) {
      return 'RECEIVED';
    } else if (item.shippedQuantity >= item.requestedQuantity) {
      return 'SHIPPED';
    } else if (item.packedQuantity >= item.requestedQuantity) {
      return 'PACKED';
    } else if (item.pickedQuantity >= item.requestedQuantity) {
      return 'PICKED';
    } else if (item.allocatedQuantity >= item.requestedQuantity) {
      return 'ALLOCATED';
    } else {
      return 'REQUESTED';
    }
  };

  const getStatusIcon = (item: TransferItem) => {
    if (item.receivedQuantity >= item.requestedQuantity) {
      return <CheckCircle className="h-4 w-4" />;
    } else if (item.shippedQuantity >= item.requestedQuantity) {
      return <Truck className="h-4 w-4" />;
    } else if (item.packedQuantity >= item.requestedQuantity) {
      return <Package className="h-4 w-4" />;
    } else if (item.pickedQuantity >= item.requestedQuantity) {
      return <CheckCircle className="h-4 w-4" />;
    } else if (item.allocatedQuantity >= item.requestedQuantity) {
      return <Clock className="h-4 w-4" />;
    } else {
      return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items in this transfer. Add items to get started.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{item.productName}</h3>
                    <p className="text-sm text-gray-600">{item.productSku}</p>
                    {item.lotNumber && (
                      <p className="text-sm text-gray-500">Lot: {item.lotNumber}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(item)}>
                      {getStatusIcon(item)}
                      <span className="ml-1">{getStatusText(item)}</span>
                    </Badge>
                    {showActions && onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Requested</p>
                    <p className="text-gray-600">
                      {item.requestedQuantity.toLocaleString()} {item.unitOfMeasure}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Allocated</p>
                    <p className="text-gray-600">
                      {item.allocatedQuantity.toLocaleString()} {item.unitOfMeasure}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Picked</p>
                    <p className="text-gray-600">
                      {item.pickedQuantity.toLocaleString()} {item.unitOfMeasure}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Progress</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{getProgressPercentage(item)}%</span>
                      </div>
                      <Progress
                        value={getProgressPercentage(item)}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <p className="font-medium">Packed</p>
                    <p className="text-gray-600">
                      {item.packedQuantity.toLocaleString()} {item.unitOfMeasure}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Shipped</p>
                    <p className="text-gray-600">
                      {item.shippedQuantity.toLocaleString()} {item.unitOfMeasure}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Received</p>
                    <p className="text-gray-600">
                      {item.receivedQuantity.toLocaleString()} {item.unitOfMeasure}
                    </p>
                  </div>
                </div>

                {item.expiryDate && (
                  <div className="mt-3">
                    <p className="font-medium text-sm">Expiry Date</p>
                    <p className="text-gray-600">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {item.notes && (
                  <div className="mt-3">
                    <p className="font-medium text-sm">Notes</p>
                    <p className="text-gray-600">{item.notes}</p>
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
