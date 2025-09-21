import React from 'react';
import { GoodsReceiptNote } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface GRNsTableProps {
  grns: GoodsReceiptNote[];
  onEdit: (grn: GoodsReceiptNote) => void;
  onDelete: (grn: GoodsReceiptNote) => void;
  onView: (grn: GoodsReceiptNote) => void;
}

export function GRNsTable({ grns, onEdit, onDelete, onView }: GRNsTableProps) {
  const getStatusColor = (status: GoodsReceiptNote['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: GoodsReceiptNote['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <AlertTriangle className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goods Receipt Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {grns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No goods receipt notes found. Create your first GRN to get started.
            </div>
          ) : (
            grns.map((grn) => (
              <div
                key={grn.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{grn.grnNumber}</h3>
                    <p className="text-sm text-gray-600">{grn.supplierName}</p>
                    {grn.asnNumber && (
                      <p className="text-sm text-gray-500">ASN: {grn.asnNumber}</p>
                    )}
                    {grn.poNumber && (
                      <p className="text-sm text-gray-500">PO: {grn.poNumber}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(grn.status)}>
                      {getStatusIcon(grn.status)}
                      <span className="ml-1">{grn.status.replace('_', ' ')}</span>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(grn)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(grn)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(grn)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Received Date</p>
                    <p className="text-gray-600">
                      {new Date(grn.receivedDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Received By</p>
                    <p className="text-gray-600">{grn.receivedByName}</p>
                  </div>

                  <div>
                    <p className="font-medium">Items & Quantity</p>
                    <p className="text-gray-600">
                      {grn.totalItems} items<br />
                      {grn.totalQuantityReceived.toLocaleString()} received
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Value Received</p>
                    <p className="text-gray-600">
                      ${grn.totalValueReceived.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Expected: {grn.totalQuantityExpected.toLocaleString()} |
                    Putaway: {grn.putawayCompleted ? 'Completed' : 'Pending'}
                  </div>

                  {grn.discrepancies && grn.discrepancies.length > 0 && (
                    <Badge variant="destructive">
                      {grn.discrepancies.length} Discrepanc{grn.discrepancies.length > 1 ? 'ies' : 'y'}
                    </Badge>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(grn.createdAt).toLocaleDateString()} |
                  Updated: {new Date(grn.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
