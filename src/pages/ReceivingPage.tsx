import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPurchaseOrders, getAdvanceShippingNotices, getGoodsReceiptNotes, getPutawaySuggestions,
  createGoodsReceiptNote, updateGoodsReceiptNote,
  generatePutawaySuggestions, approvePutawaySuggestion, rejectPutawaySuggestion,
  completePutaway, reportDiscrepancy, resolveDiscrepancy,
  PurchaseOrder, AdvanceShippingNotice, GoodsReceiptNote, PutawaySuggestion, GRNDiscrepancy
} from '@/features/receiving';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, RefreshCw, Filter, Package } from 'lucide-react';
import { PurchaseOrdersTable } from '@/features/receiving/components/PurchaseOrdersTable';
import { ASNsTable } from '@/features/receiving/components/ASNsTable';
import { GRNsTable } from '@/features/receiving/components/GRNsTable';
import { PutawaySuggestionsTable } from '@/features/receiving/components/PutawaySuggestionsTable';
import { PurchaseOrderForm } from '@/features/receiving/components/PurchaseOrderForm';
import { GRNForm } from '@/features/receiving/components/GRNForm';
import { PutawaySuggestionForm } from '@/features/receiving/components/PutawaySuggestionForm';

type DialogMode =
  | 'create-po' | 'edit-po' | 'view-po'
  | 'create-grn' | 'edit-grn' | 'view-grn'
  | 'create-suggestion' | 'edit-suggestion' | 'view-suggestion'
  | null;

export function ReceivingPage() {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [selectedGRN, setSelectedGRN] = useState<GoodsReceiptNote | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<PutawaySuggestion | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const queryClient = useQueryClient();

  // Fetch data
  const { data: purchaseOrders = [], isLoading: posLoading } = useQuery({
    queryKey: ['purchaseOrders', statusFilter],
    queryFn: async () => {
      try {
        return await getPurchaseOrders(statusFilter || undefined);
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
        throw error;
      }
    },
  });

  const { data: asns = [], isLoading: asnsLoading } = useQuery({
    queryKey: ['advanceShippingNotices'],
    queryFn: async () => {
      try {
        return await getAdvanceShippingNotices();
      } catch (error) {
        console.error('Error fetching ASNs:', error);
        throw error;
      }
    },
  });

  const { data: grns = [], isLoading: grnsLoading } = useQuery({
    queryKey: ['goodsReceiptNotes'],
    queryFn: async () => {
      try {
        return await getGoodsReceiptNotes();
      } catch (error) {
        console.error('Error fetching GRNs:', error);
        throw error;
      }
    },
  });

  const { data: suggestions = [], isLoading: suggestionsLoading } = useQuery({
    queryKey: ['putawaySuggestions'],
    queryFn: async () => {
      try {
        return await getPutawaySuggestions();
      } catch (error) {
        console.error('Error fetching putaway suggestions:', error);
        throw error;
      }
    },
  });

  // Mock data for dropdowns (in a real app, these would come from APIs)
  const suppliers = [
    { id: 'sup1', name: 'Global Electronics Ltd' },
    { id: 'sup2', name: 'PharmaCorp Inc' },
    { id: 'sup3', name: 'Industrial Parts Co' },
  ];

  const locations = [
    { id: 'loc1', name: 'Zone A - Receiving', type: 'ZONE' as const },
    { id: 'loc2', name: 'Zone B - High Value', type: 'ZONE' as const },
    { id: 'loc3', name: 'Bin A1-001', type: 'BIN' as const },
    { id: 'loc4', name: 'Zone 1 - Fast Moving', type: 'ZONE' as const },
  ];

  // Mutations
  const createPOMutation = useMutation({
    mutationFn: (po: any) => {
      // Mock implementation - in real app, this would call createPurchaseOrder
      return Promise.resolve({ ...po, id: `po${Date.now()}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      setDialogMode(null);
    },
  });

  const createGRNMutation = useMutation({
    mutationFn: createGoodsReceiptNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goodsReceiptNotes'] });
      setDialogMode(null);
    },
  });

  const generateSuggestionsMutation = useMutation({
    mutationFn: generatePutawaySuggestions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['putawaySuggestions'] });
    },
  });

  const approveSuggestionMutation = useMutation({
    mutationFn: approvePutawaySuggestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['putawaySuggestions'] });
    },
  });

  const rejectSuggestionMutation = useMutation({
    mutationFn: ({ suggestionId, reason }: { suggestionId: string; reason: string }) =>
      rejectPutawaySuggestion(suggestionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['putawaySuggestions'] });
    },
  });

  const completePutawayMutation = useMutation({
    mutationFn: completePutaway,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goodsReceiptNotes'] });
    },
  });

  // Handlers
  const handlePOFormSubmit = (data: any) => {
    createPOMutation.mutate(data);
  };

  const handleGRNFormSubmit = (data: any) => {
    createGRNMutation.mutate(data);
  };

  const handleSuggestionFormSubmit = (data: any) => {
    // Handle suggestion creation
    console.log('Creating suggestion:', data);
    setDialogMode(null);
  };

  const handlePOEdit = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setDialogMode('edit-po');
  };

  const handlePODelete = (po: PurchaseOrder) => {
    if (window.confirm(`Are you sure you want to delete PO "${po.poNumber}"?`)) {
      console.log('Deleting PO:', po.id);
    }
  };

  const handlePOView = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setDialogMode('view-po');
  };

  const handleGRNEdit = (grn: GoodsReceiptNote) => {
    setSelectedGRN(grn);
    setDialogMode('edit-grn');
  };

  const handleGRNDelete = (grn: GoodsReceiptNote) => {
    if (window.confirm(`Are you sure you want to delete GRN "${grn.grnNumber}"?`)) {
      console.log('Deleting GRN:', grn.id);
    }
  };

  const handleGRNView = (grn: GoodsReceiptNote) => {
    setSelectedGRN(grn);
    setDialogMode('view-grn');
  };

  const handleSuggestionEdit = (suggestion: PutawaySuggestion) => {
    setSelectedSuggestion(suggestion);
    setDialogMode('edit-suggestion');
  };

  const handleSuggestionDelete = (suggestion: PutawaySuggestion) => {
    if (window.confirm(`Are you sure you want to delete suggestion for "${suggestion.productName}"?`)) {
      console.log('Deleting suggestion:', suggestion.id);
    }
  };

  const handleSuggestionView = (suggestion: PutawaySuggestion) => {
    setSelectedSuggestion(suggestion);
    setDialogMode('view-suggestion');
  };

  const handleSuggestionApprove = (suggestion: PutawaySuggestion) => {
    approveSuggestionMutation.mutate(suggestion.id);
  };

  const handleSuggestionReject = (suggestion: PutawaySuggestion) => {
    const reason = window.prompt('Enter reason for rejection:');
    if (reason) {
      rejectSuggestionMutation.mutate({ suggestionId: suggestion.id, reason });
    }
  };

  const handleGenerateSuggestions = (grnId: string) => {
    generateSuggestionsMutation.mutate(grnId);
  };

  const handleCompletePutaway = (grnId: string) => {
    completePutawayMutation.mutate(grnId);
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SENT', label: 'Sent' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PARTIALLY_RECEIVED', label: 'Partially Received' },
    { value: 'FULLY_RECEIVED', label: 'Fully Received' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Receiving (Inbound)</h1>
          <p className="text-gray-600 mt-1">
            Manage purchase orders, ASNs, goods receipt, and putaway processes
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
              queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
              queryClient.invalidateQueries({ queryKey: ['advanceShippingNotices'] });
              queryClient.invalidateQueries({ queryKey: ['goodsReceiptNotes'] });
              queryClient.invalidateQueries({ queryKey: ['putawaySuggestions'] });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="purchase-orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="purchase-orders">
            Purchase Orders ({purchaseOrders.length})
          </TabsTrigger>
          <TabsTrigger value="asns">
            ASNs ({asns.length})
          </TabsTrigger>
          <TabsTrigger value="grns">
            GRNs ({grns.length})
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            Putaway Suggestions ({suggestions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchase-orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Purchase Orders</h2>
            <Button onClick={() => setDialogMode('create-po')}>
              <Plus className="h-4 w-4 mr-2" />
              Create PO
            </Button>
          </div>

          <PurchaseOrdersTable
            purchaseOrders={purchaseOrders}
            onEdit={handlePOEdit}
            onDelete={handlePODelete}
            onView={handlePOView}
          />
        </TabsContent>

        <TabsContent value="asns" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Advance Shipping Notices</h2>
          </div>

          <ASNsTable
            asns={asns}
            onView={(asn) => console.log('View ASN:', asn)}
          />
        </TabsContent>

        <TabsContent value="grns" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Goods Receipt Notes</h2>
            <Button onClick={() => setDialogMode('create-grn')}>
              <Plus className="h-4 w-4 mr-2" />
              Create GRN
            </Button>
          </div>

          <GRNsTable
            grns={grns}
            onEdit={handleGRNEdit}
            onDelete={handleGRNDelete}
            onView={handleGRNView}
          />
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Putaway Suggestions</h2>
            <Button onClick={() => setDialogMode('create-suggestion')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Suggestion
            </Button>
          </div>

          <PutawaySuggestionsTable
            suggestions={suggestions}
            onEdit={handleSuggestionEdit}
            onDelete={handleSuggestionDelete}
            onView={handleSuggestionView}
            onApprove={handleSuggestionApprove}
            onReject={handleSuggestionReject}
          />
        </TabsContent>
      </Tabs>

      {/* Purchase Order Dialog */}
      <Dialog open={dialogMode === 'create-po'} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Purchase Order</DialogTitle>
          </DialogHeader>

          <PurchaseOrderForm
            suppliers={suppliers}
            onSubmit={handlePOFormSubmit}
            onCancel={() => setDialogMode(null)}
            isLoading={createPOMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* GRN Dialog */}
      <Dialog open={dialogMode === 'create-grn'} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Goods Receipt Note</DialogTitle>
          </DialogHeader>

          <GRNForm
            suppliers={suppliers}
            asns={asns}
            pos={purchaseOrders}
            onSubmit={handleGRNFormSubmit}
            onCancel={() => setDialogMode(null)}
            isLoading={createGRNMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Putaway Suggestion Dialog */}
      <Dialog open={dialogMode === 'create-suggestion'} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Putaway Suggestion</DialogTitle>
          </DialogHeader>

          <PutawaySuggestionForm
            locations={locations}
            onSubmit={handleSuggestionFormSubmit}
            onCancel={() => setDialogMode(null)}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}