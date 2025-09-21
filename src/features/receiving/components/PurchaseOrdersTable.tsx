import React from 'react';
import { PurchaseOrder } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[];
  onEdit: (po: PurchaseOrder) => void;
  onDelete: (po: PurchaseOrder) => void;
  onView: (po: PurchaseOrder) => void;
}

export function PurchaseOrdersTable({ purchaseOrders, onEdit, onDelete, onView }: PurchaseOrdersTableProps) {
  const getStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PARTIALLY_RECEIVED': return 'bg-yellow-100 text-yellow-800';
      case 'FULLY_RECEIVED': return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'CONFIRMED':
      case 'FULLY_RECEIVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      case 'PARTIALLY_RECEIVED':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchaseOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No purchase orders found. Create your first purchase order to get started.
            </div>
          ) : (
            purchaseOrders.map((po) => (
              <div
                key={po.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{po.poNumber}</h3>
                    <p className="text-sm text-gray-600">{po.supplierName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(po.status)}>
                      {getStatusIcon(po.status)}
                      <span className="ml-1">{po.status.replace('_', ' ')}</span>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(po)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(po)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(po)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Order Date</p>
                    <p className="text-gray-600">
                      {new Date(po.orderDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Expected Delivery</p>
                    <p className="text-gray-600">
                      {new Date(po.expectedDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Items & Quantity</p>
                    <p className="text-gray-600">
                      {po.totalItems} items<br />
                      {po.totalQuantity.toLocaleString()} total
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Total Value</p>
                    <p className="text-gray-600">
                      {po.currency} {po.totalValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {po.notes && (
                  <div className="mt-3">
                    <p className="font-medium text-sm">Notes</p>
                    <p className="text-gray-600 text-sm">{po.notes}</p>
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(po.createdAt).toLocaleDateString()} |
                  Updated: {new Date(po.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
