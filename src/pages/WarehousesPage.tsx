import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWarehouses, getLocations, createWarehouse, updateWarehouse, deleteWarehouse, createLocation, updateLocation, deleteLocation, Warehouse, Location } from '@/features/warehouses';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, RefreshCw } from 'lucide-react';
import { WarehousesTable } from '@/features/warehouses/components/WarehousesTable';
import { LocationsTable } from '@/features/warehouses/components/LocationsTable';
import { WarehouseForm } from '@/features/warehouses/components/WarehouseForm';
import { LocationForm } from '@/features/warehouses/components/LocationForm';
import { WarehouseDetails } from '@/features/warehouses/components/WarehouseDetails';
import { LocationDetails } from '@/features/warehouses/components/LocationDetails';

type DialogMode = 'create-warehouse' | 'edit-warehouse' | 'view-warehouse' | 'create-location' | 'edit-location' | 'view-location' | null;

export function WarehousesPage() {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const queryClient = useQueryClient();

  // Fetch warehouses
  const { data: warehouses = [], isLoading: warehousesLoading, refetch: refetchWarehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      try {
        return await getWarehouses();
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        throw error;
      }
    },
  });

  // Fetch locations
  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      try {
        return await getLocations();
      } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
      }
    },
  });

  // Warehouse mutations
  const createWarehouseMutation = useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      setDialogMode(null);
    },
  });

  const updateWarehouseMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Warehouse> }) => updateWarehouse(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      setDialogMode(null);
      setSelectedWarehouse(null);
    },
  });

  const deleteWarehouseMutation = useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });

  // Location mutations
  const createLocationMutation = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setDialogMode(null);
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Location> }) => updateLocation(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setDialogMode(null);
      setSelectedLocation(null);
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  const handleWarehouseSubmit = (data: any) => {
    if (dialogMode === 'create-warehouse') {
      createWarehouseMutation.mutate(data);
    } else if (dialogMode === 'edit-warehouse' && selectedWarehouse) {
      updateWarehouseMutation.mutate({ id: selectedWarehouse.id, updates: data });
    }
  };

  const handleLocationSubmit = (data: any) => {
    if (dialogMode === 'create-location') {
      createLocationMutation.mutate(data);
    } else if (dialogMode === 'edit-location' && selectedLocation) {
      updateLocationMutation.mutate({ id: selectedLocation.id, updates: data });
    }
  };

  const handleWarehouseEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setDialogMode('edit-warehouse');
  };

  const handleWarehouseDelete = (warehouse: Warehouse) => {
    if (window.confirm(`Are you sure you want to delete warehouse "${warehouse.name}"?`)) {
      deleteWarehouseMutation.mutate(warehouse.id);
    }
  };

  const handleWarehouseView = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setDialogMode('view-warehouse');
  };

  const handleLocationEdit = (location: Location) => {
    setSelectedLocation(location);
    setDialogMode('edit-location');
  };

  const handleLocationDelete = (location: Location) => {
    if (window.confirm(`Are you sure you want to delete location "${location.name}"?`)) {
      deleteLocationMutation.mutate(location.id);
    }
  };

  const handleLocationView = (location: Location) => {
    setSelectedLocation(location);
    setDialogMode('view-location');
  };

  const warehousesForDropdown = warehouses.map(w => ({ id: w.id, name: w.name }));
  const parentLocations = locations.filter(l => l.type === 'ZONE' || l.type === 'RACK');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Warehouses & Locations</h1>
          <p className="text-gray-600 mt-1">
            Manage your warehouses and their locations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => refetchWarehouses()}
            disabled={warehousesLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${warehousesLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="warehouses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="warehouses">
            Warehouses ({warehouses.length})
          </TabsTrigger>
          <TabsTrigger value="locations">
            All Locations ({locations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="warehouses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Warehouses</h2>
            <Button onClick={() => setDialogMode('create-warehouse')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Warehouse
            </Button>
          </div>

          <WarehousesTable
            warehouses={warehouses}
            onEdit={handleWarehouseEdit}
            onDelete={handleWarehouseDelete}
            onView={handleWarehouseView}
          />
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Locations</h2>
            <Button onClick={() => setDialogMode('create-location')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>

          <LocationsTable
            locations={locations}
            onEdit={handleLocationEdit}
            onDelete={handleLocationDelete}
            onView={handleLocationView}
          />
        </TabsContent>
      </Tabs>

      {/* Warehouse Dialog */}
      <Dialog open={dialogMode?.includes('warehouse')} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create-warehouse' && 'Create New Warehouse'}
              {dialogMode === 'edit-warehouse' && 'Edit Warehouse'}
              {dialogMode === 'view-warehouse' && 'Warehouse Details'}
            </DialogTitle>
          </DialogHeader>

          {dialogMode === 'view-warehouse' && selectedWarehouse ? (
            <WarehouseDetails
              warehouse={selectedWarehouse}
              onEdit={handleWarehouseEdit}
              onDelete={handleWarehouseDelete}
            />
          ) : (
            <WarehouseForm
              warehouse={dialogMode === 'edit-warehouse' ? selectedWarehouse || undefined : undefined}
              onSubmit={handleWarehouseSubmit}
              onCancel={() => setDialogMode(null)}
              isLoading={createWarehouseMutation.isPending || updateWarehouseMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={dialogMode?.includes('location')} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create-location' && 'Create New Location'}
              {dialogMode === 'edit-location' && 'Edit Location'}
              {dialogMode === 'view-location' && 'Location Details'}
            </DialogTitle>
          </DialogHeader>

          {dialogMode === 'view-location' && selectedLocation ? (
            <LocationDetails
              location={selectedLocation}
              onEdit={handleLocationEdit}
              onDelete={handleLocationDelete}
            />
          ) : (
            <LocationForm
              location={dialogMode === 'edit-location' ? selectedLocation || undefined : undefined}
              warehouses={warehousesForDropdown}
              parentLocations={parentLocations}
              onSubmit={handleLocationSubmit}
              onCancel={() => setDialogMode(null)}
              isLoading={createLocationMutation.isPending || updateLocationMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


