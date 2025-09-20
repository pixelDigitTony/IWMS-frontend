import React from 'react';
import { TransferRequest, getTransferItems, getTransferApprovals } from '../api';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { TransfersTable } from './TransfersTable';
import { TransferItemsTable } from './TransferItemsTable';
import { TransferApprovalForm } from './TransferApprovalForm';

interface TransferDetailsProps {
  transfer: TransferRequest;
  onEdit: (transfer: TransferRequest) => void;
  onDelete: (transfer: TransferRequest) => void;
  onApprove?: (transfer: TransferRequest) => void;
  onAllocate?: (transfer: TransferRequest) => void;
  onPick?: (transfer: TransferRequest) => void;
  onPack?: (transfer: TransferRequest) => void;
  onDispatch?: (transfer: TransferRequest) => void;
  onReceive?: (transfer: TransferRequest) => void;
  onReconcile?: (transfer: TransferRequest) => void;
}

export function TransferDetails({
  transfer,
  onEdit,
  onDelete,
  onApprove,
  onAllocate,
  onPick,
  onPack,
  onDispatch,
  onReceive,
  onReconcile
}: TransferDetailsProps) {
  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['transferItems', transfer.id],
    queryFn: () => getTransferItems(transfer.id),
  });

  const { data: approvals = [], isLoading: approvalsLoading } = useQuery({
    queryKey: ['transferApprovals', transfer.id],
    queryFn: () => getTransferApprovals(transfer.id),
  });

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
      case 'PENDING_APPROVAL':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const canApprove = transfer.status === 'PENDING_APPROVAL';
  const canAllocate = transfer.status === 'APPROVED';
  const canPick = transfer.status === 'ALLOCATED';
  const canPack = transfer.status === 'PICKED';
  const canDispatch = transfer.status === 'PACKED';
  const canReceive = transfer.status === 'IN_TRANSIT';
  const canReconcile = transfer.status === 'RECEIVED';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{transfer.transferNumber}</CardTitle>
              <p className="text-gray-600 mt-1">{transfer.reason}</p>
            </div>
            <div className="flex space-x-2">
              <Badge className={getPriorityColor(transfer.priority)}>
                {transfer.priority}
              </Badge>
              <Badge className={getStatusColor(transfer.status)}>
                {getStatusIcon(transfer.status)}
                <span className="ml-1">{transfer.status.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Transfer Route</p>
                  <div className="space-y-1">
                    <p className="text-gray-600">From: {transfer.fromWarehouseName}</p>
                    <p className="text-gray-600">To: {transfer.toWarehouseName}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Requested By</p>
                  <p className="text-gray-600">{transfer.requestedByName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Request Date</p>
                  <p className="text-gray-600">
                    {new Date(transfer.requestedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium">Items Count</p>
                <p className="text-2xl font-bold text-blue-600">
                  {items.length}
                </p>
              </div>

              <div>
                <p className="font-medium">Total Quantity</p>
                <p className="text-gray-600">
                  {items.reduce((sum, item) => sum + item.requestedQuantity, 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-gray-600">
                  {new Date(transfer.updatedAt).toLocaleDateString()}
                </p>
              </div>

              {transfer.notes && (
                <div>
                  <p className="font-medium">Notes</p>
                  <p className="text-gray-600 text-sm">{transfer.notes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {canApprove && onApprove && (
              <Button onClick={() => onApprove(transfer)}>
                Approve Transfer
              </Button>
            )}
            {canAllocate && onAllocate && (
              <Button onClick={() => onAllocate(transfer)}>
                Allocate Items
              </Button>
            )}
            {canPick && onPick && (
              <Button onClick={() => onPick(transfer)}>
                Pick Items
              </Button>
            )}
            {canPack && onPack && (
              <Button onClick={() => onPack(transfer)}>
                Pack Transfer
              </Button>
            )}
            {canDispatch && onDispatch && (
              <Button onClick={() => onDispatch(transfer)}>
                Dispatch Transfer
              </Button>
            )}
            {canReceive && onReceive && (
              <Button onClick={() => onReceive(transfer)}>
                Receive Transfer
              </Button>
            )}
            {canReconcile && onReconcile && (
              <Button onClick={() => onReconcile(transfer)}>
                Reconcile Transfer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transfer Items */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {itemsLoading ? (
            <div className="text-center py-8">Loading items...</div>
          ) : (
            <TransferItemsTable
              items={items}
              showActions={false}
            />
          )}
        </CardContent>
      </Card>

      {/* Approvals */}
      {approvals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Approval History ({approvals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvals.map((approval) => (
                <div key={approval.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{approval.approvedByName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(approval.approvedDate).toLocaleString()}
                      </p>
                    </div>
                    <Badge className={
                      approval.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      approval.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {approval.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  {approval.comments && (
                    <p className="text-gray-700">{approval.comments}</p>
                  )}
                  {approval.conditions && approval.conditions.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-sm">Conditions:</p>
                      <ul className="text-sm text-gray-600 mt-1">
                        {approval.conditions.map((condition, index) => (
                          <li key={index}>• {condition}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
