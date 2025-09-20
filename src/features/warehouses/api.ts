// Mock API functions for warehouses and locations
// These will be replaced with actual backend calls later

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isActive: boolean;
  totalCapacity: number;
  usedCapacity: number;
  managerId?: string;
  managerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  warehouseId: string;
  warehouseName: string;
  name: string;
  code: string;
  type: 'ZONE' | 'BIN' | 'SHELF' | 'RACK';
  capacity: number;
  usedCapacity: number;
  isActive: boolean;
  parentLocationId?: string;
  parentLocationName?: string;
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Mock warehouses data
const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Main Distribution Center',
    code: 'MDC001',
    description: 'Primary distribution warehouse for the eastern region',
    address: '123 Commerce Blvd',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30309',
    country: 'USA',
    isActive: true,
    totalCapacity: 50000,
    usedCapacity: 32500,
    managerId: 'mgr1',
    managerName: 'John Smith',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-09-15').toISOString(),
  },
  {
    id: '2',
    name: 'West Coast Fulfillment',
    code: 'WCF002',
    description: 'West coast operations and fulfillment center',
    address: '456 Pacific Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    country: 'USA',
    isActive: true,
    totalCapacity: 75000,
    usedCapacity: 45000,
    managerId: 'mgr2',
    managerName: 'Sarah Johnson',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-09-10').toISOString(),
  },
  {
    id: '3',
    name: 'Regional Storage Facility',
    code: 'RSF003',
    description: 'Regional storage for overflow and seasonal items',
    address: '789 Industrial Dr',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    isActive: false,
    totalCapacity: 30000,
    usedCapacity: 12000,
    managerId: 'mgr3',
    managerName: 'Mike Davis',
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date('2024-08-20').toISOString(),
  },
];

// Mock locations data
const mockLocations: Location[] = [
  {
    id: 'loc1',
    warehouseId: '1',
    warehouseName: 'Main Distribution Center',
    name: 'Zone A - Receiving',
    code: 'ZA-RCV',
    type: 'ZONE',
    capacity: 10000,
    usedCapacity: 6500,
    isActive: true,
    attributes: { temperature: 'ambient', security: 'standard' },
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-09-15').toISOString(),
  },
  {
    id: 'loc2',
    warehouseId: '1',
    warehouseName: 'Main Distribution Center',
    name: 'Zone B - High Value',
    code: 'ZB-HVL',
    type: 'ZONE',
    capacity: 5000,
    usedCapacity: 3200,
    isActive: true,
    attributes: { temperature: 'controlled', security: 'high' },
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-09-15').toISOString(),
  },
  {
    id: 'loc3',
    warehouseId: '1',
    warehouseName: 'Main Distribution Center',
    name: 'Bin A1-001',
    code: 'A1-001',
    type: 'BIN',
    capacity: 500,
    usedCapacity: 350,
    isActive: true,
    parentLocationId: 'loc1',
    parentLocationName: 'Zone A - Receiving',
    attributes: { temperature: 'ambient', dimensions: '2x2x3m' },
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-09-15').toISOString(),
  },
  {
    id: 'loc4',
    warehouseId: '2',
    warehouseName: 'West Coast Fulfillment',
    name: 'Zone 1 - Fast Moving',
    code: 'Z1-FAST',
    type: 'ZONE',
    capacity: 15000,
    usedCapacity: 12000,
    isActive: true,
    attributes: { temperature: 'ambient', security: 'standard' },
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-09-10'),
  },
  {
    id: 'loc5',
    warehouseId: '2',
    warehouseName: 'West Coast Fulfillment',
    name: 'Rack 1A',
    code: 'R1A',
    type: 'RACK',
    capacity: 2000,
    usedCapacity: 1800,
    isActive: true,
    parentLocationId: 'loc4',
    parentLocationName: 'Zone 1 - Fast Moving',
    attributes: { temperature: 'ambient', levels: 5, bays: 20 },
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-09-10'),
  },
];

// API functions (mock implementations)
export async function getWarehouses(): Promise<Warehouse[]> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockWarehouses;
  } catch (error) {
    console.error('Error in getWarehouses:', error);
    throw error;
  }
}

export async function getWarehouse(id: string): Promise<Warehouse | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockWarehouses.find(w => w.id === id) || null;
}

export async function createWarehouse(warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warehouse> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newWarehouse: Warehouse = {
    ...warehouse,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockWarehouses.push(newWarehouse);
  return newWarehouse;
}

export async function updateWarehouse(id: string, updates: Partial<Warehouse>): Promise<Warehouse | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const index = mockWarehouses.findIndex(w => w.id === id);
  if (index === -1) return null;

  mockWarehouses[index] = {
    ...mockWarehouses[index],
    ...updates,
    updatedAt: new Date(),
  };
  return mockWarehouses[index];
}

export async function deleteWarehouse(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockWarehouses.findIndex(w => w.id === id);
  if (index === -1) return false;

  mockWarehouses.splice(index, 1);
  return true;
}

export async function getLocations(warehouseId?: string): Promise<Location[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (warehouseId) {
      return mockLocations.filter(l => l.warehouseId === warehouseId);
    }
    return mockLocations;
  } catch (error) {
    console.error('Error in getLocations:', error);
    throw error;
  }
}

export async function getLocation(id: string): Promise<Location | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockLocations.find(l => l.id === id) || null;
}

export async function createLocation(location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newLocation: Location = {
    ...location,
    id: `loc${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockLocations.push(newLocation);
  return newLocation;
}

export async function updateLocation(id: string, updates: Partial<Location>): Promise<Location | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const index = mockLocations.findIndex(l => l.id === id);
  if (index === -1) return null;

  mockLocations[index] = {
    ...mockLocations[index],
    ...updates,
    updatedAt: new Date(),
  };
  return mockLocations[index];
}

export async function deleteLocation(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockLocations.findIndex(l => l.id === id);
  if (index === -1) return false;

  mockLocations.splice(index, 1);
  return true;
}
