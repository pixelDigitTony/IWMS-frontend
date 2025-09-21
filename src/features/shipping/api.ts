// Mock API functions for shipping (outbound) processes
// These will be replaced with actual backend calls later

export interface OutboundOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  requestedShipDate: string;
  actualShipDate?: string;
  status: 'DRAFT' | 'PENDING_PICK' | 'PICKING' | 'PICKED' | 'PACKING' | 'PACKED' | 'READY_TO_SHIP' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  totalItems: number;
  totalQuantity: number;
  totalWeight: number;
  totalVolume: number;
  shippingAddress: {
    company: string;
    contact: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    company: string;
    contact: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingMethod: string;
  carrier: string;
  trackingNumber?: string;
  estimatedShippingCost: number;
  actualShippingCost?: number;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  outboundOrderId: string;
  outboundOrderNumber: string;
  status: 'DRAFT' | 'PLANNED' | 'PICKED' | 'PACKED' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  plannedShipDate: string;
  actualShipDate?: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  carrier: string;
  trackingNumber?: string;
  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
  shippingCost: number;
  items: ShipmentItem[];
  packages: Package[];
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentItem {
  id: string;
  shipmentId: string;
  productId: string;
  productName: string;
  productSku: string;
  orderedQuantity: number;
  pickedQuantity: number;
  packedQuantity: number;
  shippedQuantity: number;
  unitOfMeasure: string;
  lotNumber?: string;
  expiryDate?: string;
  locationId?: string;
  locationName?: string;
}

export interface Package {
  id: string;
  shipmentId: string;
  packageNumber: string;
  trackingNumber?: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  items: PackageItem[];
  status: 'PENDING' | 'PACKED' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
  updatedAt: string;
}

export interface PackageItem {
  id: string;
  packageId: string;
  shipmentItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitOfMeasure: string;
  lotNumber?: string;
  expiryDate?: string;
}

export interface PickingList {
  id: string;
  pickingListNumber: string;
  outboundOrderId: string;
  outboundOrderNumber: string;
  warehouseId: string;
  warehouseName: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  totalItems: number;
  items: PickingListItem[];
  assignedTo?: string;
  assignedToName?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PickingListItem {
  id: string;
  pickingListId: string;
  productId: string;
  productName: string;
  productSku: string;
  requestedQuantity: number;
  pickedQuantity: number;
  locationId: string;
  locationName: string;
  zone: string;
  bin: string;
  lotNumber?: string;
  expiryDate?: string;
  status: 'PENDING' | 'PICKING' | 'PICKED' | 'SHORTAGE' | 'EXCESS';
}

// Mock outbound orders data
const mockOutboundOrders: OutboundOrder[] = [
  {
    id: 'oo1',
    orderNumber: 'SO-2024-001',
    customerId: 'cust1',
    customerName: 'TechCorp Industries',
    orderDate: new Date('2024-01-10').toISOString(),
    requestedShipDate: new Date('2024-01-15').toISOString(),
    status: 'PENDING_PICK',
    priority: 'HIGH',
    totalItems: 5,
    totalQuantity: 125,
    totalWeight: 25.5,
    totalVolume: 1.2,
    shippingAddress: {
      company: 'TechCorp Industries',
      contact: 'John Smith',
      address: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    shippingMethod: 'Ground',
    carrier: 'FedEx',
    estimatedShippingCost: 45.00,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: 'oo2',
    orderNumber: 'SO-2024-002',
    customerId: 'cust2',
    customerName: 'Global Pharma Ltd',
    orderDate: new Date('2024-01-12').toISOString(),
    requestedShipDate: new Date('2024-01-18').toISOString(),
    status: 'PICKED',
    priority: 'MEDIUM',
    totalItems: 3,
    totalQuantity: 50,
    totalWeight: 15.0,
    totalVolume: 0.8,
    shippingAddress: {
      company: 'Global Pharma Ltd',
      contact: 'Sarah Johnson',
      address: '456 Medical Center Blvd',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'USA'
    },
    shippingMethod: 'Express',
    carrier: 'UPS',
    estimatedShippingCost: 75.00,
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-14').toISOString(),
  },
  {
    id: 'oo3',
    orderNumber: 'SO-2024-003',
    customerId: 'cust3',
    customerName: 'Manufacturing Plus Inc',
    orderDate: new Date('2024-01-14').toISOString(),
    requestedShipDate: new Date('2024-01-20').toISOString(),
    actualShipDate: new Date('2024-01-19').toISOString(),
    status: 'SHIPPED',
    priority: 'LOW',
    totalItems: 8,
    totalQuantity: 200,
    totalWeight: 45.0,
    totalVolume: 2.5,
    shippingAddress: {
      company: 'Manufacturing Plus Inc',
      contact: 'Mike Davis',
      address: '789 Industrial Park Rd',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      country: 'USA'
    },
    shippingMethod: 'Freight',
    carrier: 'DHL',
    trackingNumber: 'DH123456789',
    estimatedShippingCost: 150.00,
    actualShippingCost: 145.00,
    createdAt: new Date('2024-01-14').toISOString(),
    updatedAt: new Date('2024-01-19').toISOString(),
  },
];

// Mock shipments data
const mockShipments: Shipment[] = [
  {
    id: 'sh1',
    shipmentNumber: 'SHP-2024-001',
    outboundOrderId: 'oo1',
    outboundOrderNumber: 'SO-2024-001',
    status: 'PLANNED',
    plannedShipDate: new Date('2024-01-15').toISOString(),
    estimatedDeliveryDate: new Date('2024-01-17').toISOString(),
    carrier: 'FedEx',
    totalPackages: 2,
    totalWeight: 25.5,
    totalVolume: 1.2,
    shippingCost: 45.00,
    items: [],
    packages: [],
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: 'sh2',
    shipmentNumber: 'SHP-2024-002',
    outboundOrderId: 'oo2',
    outboundOrderNumber: 'SO-2024-002',
    status: 'SHIPPED',
    plannedShipDate: new Date('2024-01-18').toISOString(),
    actualShipDate: new Date('2024-01-18').toISOString(),
    estimatedDeliveryDate: new Date('2024-01-20').toISOString(),
    actualDeliveryDate: new Date('2024-01-20').toISOString(),
    carrier: 'UPS',
    trackingNumber: 'UPS987654321',
    totalPackages: 1,
    totalWeight: 15.0,
    totalVolume: 0.8,
    shippingCost: 75.00,
    items: [],
    packages: [],
    createdAt: new Date('2024-01-14').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
];

// Mock picking lists data
const mockPickingLists: PickingList[] = [
  {
    id: 'pl1',
    pickingListNumber: 'PICK-2024-001',
    outboundOrderId: 'oo1',
    outboundOrderNumber: 'SO-2024-001',
    warehouseId: '1',
    warehouseName: 'Main Distribution Center',
    status: 'ACTIVE',
    totalItems: 5,
    items: [
      {
        id: 'pli1',
        pickingListId: 'pl1',
        productId: 'prod1',
        productName: '10kΩ Resistor',
        productSku: 'ELEC-RES-001',
        requestedQuantity: 100,
        pickedQuantity: 0,
        locationId: 'loc1',
        locationName: 'Zone A - Receiving',
        zone: 'A',
        bin: '001',
        status: 'PENDING'
      },
      {
        id: 'pli2',
        pickingListId: 'pl1',
        productId: 'prod2',
        productName: '100μF Capacitor',
        productSku: 'ELEC-CAP-002',
        requestedQuantity: 25,
        pickedQuantity: 0,
        locationId: 'loc2',
        locationName: 'Zone B - High Value',
        zone: 'B',
        bin: '002',
        status: 'PENDING'
      }
    ],
    assignedTo: 'picker1',
    assignedToName: 'Tom Anderson',
    startedAt: new Date('2024-01-13').toISOString(),
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-13').toISOString(),
  },
];

// API functions (mock implementations)
export async function getOutboundOrders(status?: string): Promise<OutboundOrder[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (status) {
      return mockOutboundOrders.filter(order => order.status === status);
    }
    return mockOutboundOrders;
  } catch (error) {
    console.error('Error in getOutboundOrders:', error);
    throw error;
  }
}

export async function getShipments(status?: string): Promise<Shipment[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (status) {
      return mockShipments.filter(shipment => shipment.status === status);
    }
    return mockShipments;
  } catch (error) {
    console.error('Error in getShipments:', error);
    throw error;
  }
}

export async function getPickingLists(status?: string): Promise<PickingList[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (status) {
      return mockPickingLists.filter(list => list.status === status);
    }
    return mockPickingLists;
  } catch (error) {
    console.error('Error in getPickingLists:', error);
    throw error;
  }
}

export async function createOutboundOrder(order: Omit<OutboundOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<OutboundOrder> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newOrder: OutboundOrder = {
      ...order,
      id: `oo${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockOutboundOrders.push(newOrder);
    return newOrder;
  } catch (error) {
    console.error('Error in createOutboundOrder:', error);
    throw error;
  }
}

export async function createShipment(shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shipment> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newShipment: Shipment = {
      ...shipment,
      id: `sh${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockShipments.push(newShipment);
    return newShipment;
  } catch (error) {
    console.error('Error in createShipment:', error);
    throw error;
  }
}

export async function createPickingList(pickingList: Omit<PickingList, 'id' | 'createdAt' | 'updatedAt'>): Promise<PickingList> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newList: PickingList = {
      ...pickingList,
      id: `pl${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPickingLists.push(newList);
    return newList;
  } catch (error) {
    console.error('Error in createPickingList:', error);
    throw error;
  }
}

export async function updateOutboundOrder(id: string, updates: Partial<OutboundOrder>): Promise<OutboundOrder | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockOutboundOrders.findIndex(order => order.id === id);
    if (index === -1) return null;

    mockOutboundOrders[index] = {
      ...mockOutboundOrders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockOutboundOrders[index];
  } catch (error) {
    console.error('Error in updateOutboundOrder:', error);
    throw error;
  }
}

export async function updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockShipments.findIndex(shipment => shipment.id === id);
    if (index === -1) return null;

    mockShipments[index] = {
      ...mockShipments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockShipments[index];
  } catch (error) {
    console.error('Error in updateShipment:', error);
    throw error;
  }
}

export async function updatePickingList(id: string, updates: Partial<PickingList>): Promise<PickingList | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockPickingLists.findIndex(list => list.id === id);
    if (index === -1) return null;

    mockPickingLists[index] = {
      ...mockPickingLists[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockPickingLists[index];
  } catch (error) {
    console.error('Error in updatePickingList:', error);
    throw error;
  }
}

export async function updatePickingListItem(
  pickingListId: string,
  itemId: string,
  updates: Partial<PickingListItem>
): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const list = mockPickingLists.find(l => l.id === pickingListId);
    if (list) {
      const item = list.items.find(i => i.id === itemId);
      if (item) {
        Object.assign(item, updates);
        list.updatedAt = new Date().toISOString();
      }
    }
  } catch (error) {
    console.error('Error in updatePickingListItem:', error);
    throw error;
  }
}

export async function completePickingList(pickingListId: string): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const list = mockPickingLists.find(l => l.id === pickingListId);
    if (list) {
      list.status = 'COMPLETED';
      list.completedAt = new Date().toISOString();
      list.updatedAt = new Date().toISOString();
    }
  } catch (error) {
    console.error('Error in completePickingList:', error);
    throw error;
  }
}

export async function shipShipment(shipmentId: string, trackingNumber: string): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const shipment = mockShipments.find(s => s.id === shipmentId);
    if (shipment) {
      shipment.status = 'SHIPPED';
      shipment.actualShipDate = new Date().toISOString();
      shipment.trackingNumber = trackingNumber;
      shipment.updatedAt = new Date().toISOString();
    }
  } catch (error) {
    console.error('Error in shipShipment:', error);
    throw error;
  }
}

export async function deliverShipment(shipmentId: string): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const shipment = mockShipments.find(s => s.id === shipmentId);
    if (shipment) {
      shipment.status = 'DELIVERED';
      shipment.actualDeliveryDate = new Date().toISOString();
      shipment.updatedAt = new Date().toISOString();
    }
  } catch (error) {
    console.error('Error in deliverShipment:', error);
    throw error;
  }
}

export async function cancelOutboundOrder(id: string): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockOutboundOrders.findIndex(order => order.id === id);
    if (index === -1) return false;

    mockOutboundOrders[index].status = 'CANCELLED';
    mockOutboundOrders[index].updatedAt = new Date().toISOString();
    return true;
  } catch (error) {
    console.error('Error in cancelOutboundOrder:', error);
    throw error;
  }
}

export async function getShipmentByOrderId(orderId: string): Promise<Shipment | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockShipments.find(s => s.outboundOrderId === orderId) || null;
  } catch (error) {
    console.error('Error in getShipmentByOrderId:', error);
    throw error;
  }
}

export async function getPickingListByOrderId(orderId: string): Promise<PickingList | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPickingLists.find(pl => pl.outboundOrderId === orderId) || null;
  } catch (error) {
    console.error('Error in getPickingListByOrderId:', error);
    throw error;
  }
}
