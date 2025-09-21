import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOutboundOrders, getShipments, getPickingLists,
  createOutboundOrder, updateOutboundOrder, cancelOutboundOrder,
  createShipment, updateShipment, shipShipment, deliverShipment,
  createPickingList, updatePickingList, completePickingList,
  OutboundOrder, Shipment, PickingList
} from '@/features/shipping';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, RefreshCw, Filter, Package } from 'lucide-react';
import { OutboundOrdersTable } from '@/features/shipping/components/OutboundOrdersTable';
import { ShipmentsTable } from '@/features/shipping/components/ShipmentsTable';
import { PickingListsTable } from '@/features/shipping/components/PickingListsTable';
import { OutboundOrderForm } from '@/features/shipping/components/OutboundOrderForm';

type DialogMode =
  | 'create-order' | 'edit-order' | 'view-order'
  | null;

export function ShippingPage() {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedOrder, setSelectedOrder] = useState<OutboundOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const queryClient = useQueryClient();

  // Fetch data
  const { data: outboundOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['outboundOrders', statusFilter],
    queryFn: async () => {
      try {
        return await getOutboundOrders(statusFilter || undefined);
      } catch (error) {
        console.error('Error fetching outbound orders:', error);
        throw error;
      }
    },
  });

  const { data: shipments = [], isLoading: shipmentsLoading } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      try {
        return await getShipments();
      } catch (error) {
        console.error('Error fetching shipments:', error);
        throw error;
      }
    },
  });

  const { data: pickingLists = [], isLoading: pickingListsLoading } = useQuery({
    queryKey: ['pickingLists'],
    queryFn: async () => {
      try {
        return await getPickingLists();
      } catch (error) {
        console.error('Error fetching picking lists:', error);
        throw error;
      }
    },
  });

  // Mock data for dropdowns
  const customers = [
    { id: 'cust1', name: 'TechCorp Industries' },
    { id: 'cust2', name: 'Global Pharma Ltd' },
    { id: 'cust3', name: 'Manufacturing Plus Inc' },
  ];

  // Mutations
  const createOrderMutation = useMutation({
    mutationFn: createOutboundOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outboundOrders'] });
      setDialogMode(null);
    },
  });

  const shipShipmentMutation = useMutation({
    mutationFn: ({ shipmentId, trackingNumber }: { shipmentId: string; trackingNumber: string }) =>
      shipShipment(shipmentId, trackingNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
  });

  const deliverShipmentMutation = useMutation({
    mutationFn: deliverShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
  });

  const completePickingListMutation = useMutation({
    mutationFn: completePickingList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickingLists'] });
    },
  });

  // Handlers
  const handleOrderFormSubmit = (data: any) => {
    createOrderMutation.mutate(data);
  };

  const handleOrderEdit = (order: OutboundOrder) => {
    setSelectedOrder(order);
    setDialogMode('edit-order');
  };

  const handleOrderDelete = (order: OutboundOrder) => {
    if (window.confirm(`Are you sure you want to delete order "${order.orderNumber}"?`)) {
      cancelOutboundOrder(order.id).then(() => {
        queryClient.invalidateQueries({ queryKey: ['outboundOrders'] });
      });
    }
  };

  const handleOrderView = (order: OutboundOrder) => {
    setSelectedOrder(order);
    setDialogMode('view-order');
  };

  const handleCreateShipment = (order: OutboundOrder) => {
    // Create shipment from order
    createShipment({
      outboundOrderId: order.id,
      outboundOrderNumber: order.orderNumber,
      status: 'PLANNED',
      plannedShipDate: order.requestedShipDate,
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: order.carrier,
      totalPackages: 1,
      totalWeight: order.totalWeight,
      totalVolume: order.totalVolume,
      shippingCost: order.estimatedShippingCost,
      items: [],
      packages: [],
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    });
  };

  const handleCreatePickingList = (order: OutboundOrder) => {
    // Create picking list from order
    createPickingList({
      outboundOrderId: order.id,
      outboundOrderNumber: order.orderNumber,
      warehouseId: '1', // Mock warehouse ID
      warehouseName: 'Main Distribution Center',
      status: 'ACTIVE',
      totalItems: order.totalItems,
      items: [], // Would be populated with actual order items
      assignedTo: 'picker1',
      assignedToName: 'Warehouse Picker',
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ['pickingLists'] });
    });
  };

  const handleShipmentShip = (shipment: Shipment) => {
    const trackingNumber = window.prompt('Enter tracking number:');
    if (trackingNumber) {
      shipShipmentMutation.mutate({
        shipmentId: shipment.id,
        trackingNumber
      });
    }
  };

  const handleShipmentDeliver = (shipment: Shipment) => {
    deliverShipmentMutation.mutate(shipment.id);
  };

  const handlePickingListComplete = (list: PickingList) => {
    completePickingListMutation.mutate(list.id);
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PENDING_PICK', label: 'Pending Pick' },
    { value: 'PICKED', label: 'Picked' },
    { value: 'PACKED', label: 'Packed' },
    { value: 'READY_TO_SHIP', label: 'Ready to Ship' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'DELIVERED', label: 'Delivered' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Shipping (Outbound)</h1>
          <p className="text-gray-600 mt-1">
            Manage outbound orders, shipments, and picking processes
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
              queryClient.invalidateQueries({ queryKey: ['outboundOrders'] });
              queryClient.invalidateQueries({ queryKey: ['shipments'] });
              queryClient.invalidateQueries({ queryKey: ['pickingLists'] });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">
            Outbound Orders ({outboundOrders.length})
          </TabsTrigger>
          <TabsTrigger value="shipments">
            Shipments ({shipments.length})
          </TabsTrigger>
          <TabsTrigger value="picking">
            Picking Lists ({pickingLists.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Outbound Orders</h2>
            <Button onClick={() => setDialogMode('create-order')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>

          <OutboundOrdersTable
            orders={outboundOrders}
            onEdit={handleOrderEdit}
            onDelete={handleOrderDelete}
            onView={handleOrderView}
            onCreateShipment={handleCreateShipment}
            onCreatePickingList={handleCreatePickingList}
          />
        </TabsContent>

        <TabsContent value="shipments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Shipments</h2>
          </div>

          <ShipmentsTable
            shipments={shipments}
            onEdit={(shipment) => console.log('Edit shipment:', shipment)}
            onDelete={(shipment) => console.log('Delete shipment:', shipment)}
            onView={(shipment) => console.log('View shipment:', shipment)}
            onShip={handleShipmentShip}
            onDeliver={handleShipmentDeliver}
          />
        </TabsContent>

        <TabsContent value="picking" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Picking Lists</h2>
          </div>

          <PickingListsTable
            pickingLists={pickingLists}
            onEdit={(list) => console.log('Edit picking list:', list)}
            onDelete={(list) => console.log('Delete picking list:', list)}
            onView={(list) => console.log('View picking list:', list)}
            onComplete={handlePickingListComplete}
          />
        </TabsContent>
      </Tabs>

      {/* Outbound Order Dialog */}
      <Dialog open={dialogMode === 'create-order'} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Outbound Order</DialogTitle>
          </DialogHeader>

          <OutboundOrderForm
            customers={customers}
            onSubmit={handleOrderFormSubmit}
            onCancel={() => setDialogMode(null)}
            isLoading={createOrderMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}