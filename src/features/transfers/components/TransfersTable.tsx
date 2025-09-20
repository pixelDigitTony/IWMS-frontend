import React from 'react';
import { TransferRequest } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface TransfersTableProps {
  transfers: TransferRequest[];
  onEdit: (transfer: TransferRequest) => void;
  onDelete: (transfer: TransferRequest) => void;
  onView: (transfer: TransferRequest) => void;
  onApprove?: (transfer: TransferRequest) => void;
  onAllocate?: (transfer: TransferRequest) => void;
  onPick?: (transfer: TransferRequest) => void;
  onPack?: (transfer: TransferRequest) => void;
  onDispatch?: (transfer: TransferRequest) => void;
  onReceive?: (transfer: TransferRequest) => void;
  onReconcile?: (transfer: TransferRequest) => void;
}

export function TransfersTable({
  transfers,
  onEdit,
  onDelete,
  onView,
  onApprove,
  onAllocate,
  onPick,
  onPack,
  onDispatch,
  onReceive,
  onReconcile
}: TransfersTableProps) {
  const getStatusColor = (status: TransferRequest['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'ALLOCATED': return 'bg-purple-100 text-purple-800';
      case 'PICKED': return 'bg-indigo-100 text-indigo-800';
      case 'PACKED': return 'bg-pink-100 text-pink-800';
      case 'DISPATCHED': return 'bg-orange-100 text-orange-800';
      case 'IN_TRANSIT': return 'bg-cyan-100 text-cyan-800';
      case 'RECEIVED': return 'bg-green-100 text-green-800';
      case 'RECONCILED': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TransferRequest['priority']) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: TransferRequest['status']) => {
    switch (status) {
      case 'APPROVED':
      case 'RECEIVED':
      case 'RECONCILED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const canApprove = (transfer: TransferRequest) => transfer.status === 'PENDING_APPROVAL';
  const canAllocate = (transfer: TransferRequest) => transfer.status === 'APPROVED';
  const canPick = (transfer: TransferRequest) => transfer.status === 'ALLOCATED';
  const canPack = (transfer: TransferRequest) => transfer.status === 'PICKED';
  const canDispatch = (transfer: TransferRequest) => transfer.status === 'PACKED';
  const canReceive = (transfer: TransferRequest) => transfer.status === 'IN_TRANSIT';
  const canReconcile = (transfer: TransferRequest) => transfer.status === 'RECEIVED';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transfers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transfer requests found. Create your first transfer to get started.
            </div>
          ) : (
            transfers.map((transfer) => (
              <div
                key={transfer.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{transfer.transferNumber}</h3>
                    <p className="text-sm text-gray-600">{transfer.reason}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(transfer.priority)}>
                      {transfer.priority}
                    </Badge>
                    <Badge className={getStatusColor(transfer.status)}>
                      {getStatusIcon(transfer.status)}
                      <span className="ml-1">{transfer.status.replace('_', ' ')}</span>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(transfer)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(transfer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(transfer)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">From → To</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-gray-600">{transfer.fromWarehouseName}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{transfer.toWarehouseName}</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Requested By</p>
                    <p className="text-gray-600">{transfer.requestedByName}</p>
                  </div>

                  <div>
                    <p className="font-medium">Request Date</p>
                    <p className="text-gray-600">
                      {new Date(transfer.requestedDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-gray-600">
                      {new Date(transfer.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {canApprove(transfer) && onApprove && (
                    <Button
                      size="sm"
                      onClick={() => onApprove(transfer)}
                    >
                      Approve
                    </Button>
                  )}
                  {canAllocate(transfer) && onAllocate && (
                    <Button
                      size="sm"
                      onClick={() => onAllocate(transfer)}
                    >
                      Allocate
                    </Button>
                  )}
                  {canPick(transfer) && onPick && (
                    <Button
                      size="sm"
                      onClick={() => onPick(transfer)}
                    >
                      Pick Items
                    </Button>
                  )}
                  {canPack(transfer) && onPack && (
                    <Button
                      size="sm"
                      onClick={() => onPack(transfer)}
                    >
                      Pack
                    </Button>
                  )}
                  {canDispatch(transfer) && onDispatch && (
                    <Button
                      size="sm"
                      onClick={() => onDispatch(transfer)}
                    >
                      Dispatch
                    </Button>
                  )}
                  {canReceive(transfer) && onReceive && (
                    <Button
                      size="sm"
                      onClick={() => onReceive(transfer)}
                    >
                      Receive
                    </Button>
                  )}
                  {canReconcile(transfer) && onReconcile && (
                    <Button
                      size="sm"
                      onClick={() => onReconcile(transfer)}
                    >
                      Reconcile
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
