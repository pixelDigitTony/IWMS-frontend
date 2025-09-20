import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTransfers, getTransferItems, getTransferApprovals,
  createTransfer, updateTransfer, deleteTransfer,
  approveTransfer, allocateTransferItems, updateTransferItemStatus,
  dispatchTransfer, receiveTransfer, reconcileTransfer,
  TransferRequest, TransferItem, TransferApproval
} from '@/features/transfers';
import { getProducts } from '@/features/products';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import { TransfersTable } from '@/features/transfers/components/TransfersTable';
import { TransferForm } from '@/features/transfers/components/TransferForm';
import { TransferItemForm } from '@/features/transfers/components/TransferItemForm';
import { TransferApprovalForm } from '@/features/transfers/components/TransferApprovalForm';
import { TransferDetails } from '@/features/transfers/components/TransferDetails';
import { TransferStatusTracker } from '@/features/transfers/components/TransferStatusTracker';

type DialogMode =
  | 'create-transfer' | 'edit-transfer' | 'view-transfer'
  | 'add-items' | 'approve-transfer' | 'allocate-items'
  | null;

export function TransfersPage() {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const queryClient = useQueryClient();

  // Fetch transfers
  const { data: transfers = [], isLoading: transfersLoading } = useQuery({
    queryKey: ['transfers', statusFilter],
    queryFn: async () => {
      try {
        return await getTransfers(statusFilter || undefined);
      } catch (error) {
        console.error('Error fetching transfers:', error);
        throw error;
      }
    },
  });

  // Fetch products for forms
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        return await getProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
  });

  // Fetch warehouses for forms
  const warehouses = [
    { id: '1', name: 'Main Distribution Center' },
    { id: '2', name: 'West Coast Fulfillment' },
    { id: '3', name: 'Regional Storage Facility' },
  ];

  // Mutations
  const createTransferMutation = useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      setDialogMode(null);
    },
  });

  const updateTransferMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TransferRequest> }) => updateTransfer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      setDialogMode(null);
      setSelectedTransfer(null);
    },
  });

  const deleteTransferMutation = useMutation({
    mutationFn: deleteTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });

  const approveTransferMutation = useMutation({
    mutationFn: ({ transferId, approval }: { transferId: string; approval: any }) => approveTransfer(transferId, approval),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['transferApprovals'] });
      setDialogMode(null);
    },
  });

  const allocateItemsMutation = useMutation({
    mutationFn: ({ transferId, allocations }: { transferId: string; allocations: Array<{itemId: string, quantity: number}> }) =>
      allocateTransferItems(transferId, allocations),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['transferItems'] });
      setDialogMode(null);
    },
  });

  // Handlers
  const handleTransferSubmit = (data: any) => {
    if (dialogMode === 'create-transfer') {
      createTransferMutation.mutate(data);
    } else if (dialogMode === 'edit-transfer' && selectedTransfer) {
      updateTransferMutation.mutate({ id: selectedTransfer.id, updates: data });
    }
  };

  const handleItemsSubmit = (data: any) => {
    // Handle adding items to transfer
    console.log('Adding items:', data);
    setDialogMode(null);
  };

  const handleApprovalSubmit = (data: any) => {
    if (selectedTransfer) {
      approveTransferMutation.mutate({
        transferId: selectedTransfer.id,
        approval: data
      });
    }
  };

  const handleTransferEdit = (transfer: TransferRequest) => {
    setSelectedTransfer(transfer);
    setDialogMode('edit-transfer');
  };

  const handleTransferDelete = (transfer: TransferRequest) => {
    if (window.confirm(`Are you sure you want to delete transfer "${transfer.transferNumber}"?`)) {
      deleteTransferMutation.mutate(transfer.id);
    }
  };

  const handleTransferView = (transfer: TransferRequest) => {
    setSelectedTransfer(transfer);
    setDialogMode('view-transfer');
  };

  const handleTransferApprove = (transfer: TransferRequest) => {
    setSelectedTransfer(transfer);
    setDialogMode('approve-transfer');
  };

  const handleTransferAllocate = (transfer: TransferRequest) => {
    setSelectedTransfer(transfer);
    setDialogMode('allocate-items');
  };

  const handleTransferPick = (transfer: TransferRequest) => {
    // Handle pick action
    console.log('Pick transfer:', transfer.transferNumber);
  };

  const handleTransferPack = (transfer: TransferRequest) => {
    // Handle pack action
    console.log('Pack transfer:', transfer.transferNumber);
  };

  const handleTransferDispatch = (transfer: TransferRequest) => {
    dispatchTransfer(transfer.id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    });
  };

  const handleTransferReceive = (transfer: TransferRequest) => {
    receiveTransfer(transfer.id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    });
  };

  const handleTransferReconcile = (transfer: TransferRequest) => {
    reconcileTransfer(transfer.id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    });
  };

  const productsForDropdown = products.map(p => ({ id: p.id, name: p.name, sku: p.sku }));

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'ALLOCATED', label: 'Allocated' },
    { value: 'PICKED', label: 'Picked' },
    { value: 'PACKED', label: 'Packed' },
    { value: 'DISPATCHED', label: 'Dispatched' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'RECEIVED', label: 'Received' },
    { value: 'RECONCILED', label: 'Reconciled' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inter-Warehouse Transfers</h1>
          <p className="text-gray-600 mt-1">
            Manage transfer requests, approvals, and workflow tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['transfers'] });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Transfer Requests ({transfers.length})</h2>
          <Button onClick={() => setDialogMode('create-transfer')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Transfer
          </Button>
        </div>

        <TransfersTable
          transfers={transfers}
          onEdit={handleTransferEdit}
          onDelete={handleTransferDelete}
          onView={handleTransferView}
          onApprove={handleTransferApprove}
          onAllocate={handleTransferAllocate}
          onPick={handleTransferPick}
          onPack={handleTransferPack}
          onDispatch={handleTransferDispatch}
          onReceive={handleTransferReceive}
          onReconcile={handleTransferReconcile}
        />
      </div>

      {/* Transfer Dialog */}
      <Dialog open={dialogMode?.includes('transfer')} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create-transfer' && 'Create New Transfer Request'}
              {dialogMode === 'edit-transfer' && 'Edit Transfer Request'}
              {dialogMode === 'view-transfer' && 'Transfer Details'}
              {dialogMode === 'approve-transfer' && 'Approve Transfer'}
            </DialogTitle>
          </DialogHeader>

          {dialogMode === 'view-transfer' && selectedTransfer ? (
            <TransferDetails
              transfer={selectedTransfer}
              onEdit={handleTransferEdit}
              onDelete={handleTransferDelete}
              onApprove={handleTransferApprove}
              onAllocate={handleTransferAllocate}
              onPick={handleTransferPick}
              onPack={handleTransferPack}
              onDispatch={handleTransferDispatch}
              onReceive={handleTransferReceive}
              onReconcile={handleTransferReconcile}
            />
          ) : dialogMode === 'approve-transfer' && selectedTransfer ? (
            <TransferApprovalForm
              transferNumber={selectedTransfer.transferNumber}
              onSubmit={handleApprovalSubmit}
              onCancel={() => setDialogMode(null)}
              isLoading={approveTransferMutation.isPending}
            />
          ) : (
            <TransferForm
              transfer={dialogMode === 'edit-transfer' ? selectedTransfer || undefined : undefined}
              warehouses={warehouses}
              onSubmit={handleTransferSubmit}
              onCancel={() => setDialogMode(null)}
              isLoading={createTransferMutation.isPending || updateTransferMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Items Dialog */}
      <Dialog open={dialogMode === 'add-items'} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Items to Transfer</DialogTitle>
          </DialogHeader>

          <TransferItemForm
            transferId={selectedTransfer?.id}
            products={productsForDropdown}
            onSubmit={handleItemsSubmit}
            onCancel={() => setDialogMode(null)}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}