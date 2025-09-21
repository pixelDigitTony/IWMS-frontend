// Mock API functions for reports and dashboards
// These will be replaced with actual backend calls later

export interface StockOnHandReport {
  warehouseId: string;
  warehouseName: string;
  locationId: string;
  locationName: string;
  productId: string;
  productName: string;
  productSku: string;
  category: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  unitOfMeasure: string;
  lastCounted?: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK';
  value: number;
}

export interface StockMovementReport {
  id: string;
  transactionId: string;
  transactionType: 'INBOUND' | 'OUTBOUND' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'ADJUSTMENT' | 'COUNT';
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  unitOfMeasure: string;
  fromLocation?: string;
  toLocation?: string;
  reason?: string;
  reference?: string;
  timestamp: string;
  userId: string;
  userName: string;
  value: number;
}

export interface AgingReport {
  productId: string;
  productName: string;
  productSku: string;
  lotNumber?: string;
  expiryDate?: string;
  daysToExpiry?: number;
  quantity: number;
  unitOfMeasure: string;
  locationId: string;
  locationName: string;
  warehouseId: string;
  warehouseName: string;
  status: 'FRESH' | 'EXPIRING_SOON' | 'EXPIRED' | 'NEAR_EXPIRY';
  value: number;
}

export interface InventorySummary {
  totalProducts: number;
  totalSKUs: number;
  totalValue: number;
  totalQuantity: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  expiredItems: number;
  activeLocations: number;
  totalWarehouses: number;
  recentTransactions: number;
  lastUpdated: string;
}

export interface ReportFilter {
  warehouseIds?: string[];
  locationIds?: string[];
  categoryIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  minQuantity?: number;
  maxQuantity?: number;
  status?: string[];
  includeExpired?: boolean;
}

// Mock stock on hand data
const mockStockOnHand: StockOnHandReport[] = [
  {
    warehouseId: '1',
    warehouseName: 'Main Distribution Center',
    locationId: 'loc1',
    locationName: 'Zone A - Receiving',
    productId: 'prod1',
    productName: '10kΩ Resistor',
    productSku: 'ELEC-RES-001',
    category: 'Electronics',
    quantity: 500,
    reservedQuantity: 50,
    availableQuantity: 450,
    unitOfMeasure: 'pieces',
    lastCounted: new Date('2024-01-15').toISOString(),
    status: 'IN_STOCK',
    value: 250.00
  },
  {
    warehouseId: '1',
    warehouseName: 'Main Distribution Center',
    locationId: 'loc2',
    locationName: 'Zone B - High Value',
    productId: 'prod2',
    productName: '100μF Capacitor',
    productSku: 'ELEC-CAP-002',
    category: 'Electronics',
    quantity: 25,
    reservedQuantity: 0,
    availableQuantity: 25,
    unitOfMeasure: 'pieces',
    status: 'LOW_STOCK',
    value: 125.00
  },
  {
    warehouseId: '2',
    warehouseName: 'Secondary Warehouse',
    locationId: 'loc3',
    locationName: 'Zone C - Standard',
    productId: 'prod3',
    productName: 'LED Strip 5m',
    productSku: 'LIGHT-LED-001',
    category: 'Lighting',
    quantity: 0,
    reservedQuantity: 0,
    availableQuantity: 0,
    unitOfMeasure: 'rolls',
    status: 'OUT_OF_STOCK',
    value: 0
  },
  {
    warehouseId: '1',
    warehouseName: 'Main Distribution Center',
    locationId: 'loc4',
    locationName: 'Zone D - Bulk',
    productId: 'prod4',
    productName: 'RJ45 Cable 1m',
    productSku: 'NET-CAB-001',
    category: 'Networking',
    quantity: 1500,
    reservedQuantity: 200,
    availableQuantity: 1300,
    unitOfMeasure: 'pieces',
    status: 'OVERSTOCK',
    value: 750.00
  }
];

// Mock stock movement data
const mockStockMovements: StockMovementReport[] = [
  {
    id: 'mov1',
    transactionId: 'trx1',
    transactionType: 'INBOUND',
    productId: 'prod1',
    productName: '10kΩ Resistor',
    productSku: 'ELEC-RES-001',
    quantity: 100,
    previousQuantity: 400,
    newQuantity: 500,
    unitOfMeasure: 'pieces',
    toLocation: 'Zone A - Receiving',
    reason: 'Purchase Order Receipt',
    reference: 'PO-2024-001',
    timestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
    userId: 'user1',
    userName: 'John Smith',
    value: 50.00
  },
  {
    id: 'mov2',
    transactionId: 'trx2',
    transactionType: 'OUTBOUND',
    productId: 'prod1',
    productName: '10kΩ Resistor',
    productSku: 'ELEC-RES-001',
    quantity: -50,
    previousQuantity: 500,
    newQuantity: 450,
    unitOfMeasure: 'pieces',
    fromLocation: 'Zone A - Receiving',
    reason: 'Sales Order Fulfillment',
    reference: 'SO-2024-001',
    timestamp: new Date('2024-01-16T14:20:00Z').toISOString(),
    userId: 'user2',
    userName: 'Sarah Johnson',
    value: -25.00
  },
  {
    id: 'mov3',
    transactionId: 'trx3',
    transactionType: 'ADJUSTMENT',
    productId: 'prod2',
    productName: '100μF Capacitor',
    productSku: 'ELEC-CAP-002',
    quantity: -5,
    previousQuantity: 30,
    newQuantity: 25,
    unitOfMeasure: 'pieces',
    reason: 'Damaged during handling',
    reference: 'ADJ-2024-001',
    timestamp: new Date('2024-01-17T09:15:00Z').toISOString(),
    userId: 'user3',
    userName: 'Mike Davis',
    value: -25.00
  }
];

// Mock aging report data
const mockAgingReport: AgingReport[] = [
  {
    productId: 'prod2',
    productName: '100μF Capacitor',
    productSku: 'ELEC-CAP-002',
    lotNumber: 'LOT-2024-001',
    expiryDate: new Date('2024-06-15').toISOString(),
    daysToExpiry: 147,
    quantity: 25,
    unitOfMeasure: 'pieces',
    locationId: 'loc2',
    locationName: 'Zone B - High Value',
    warehouseId: '1',
    warehouseName: 'Main Distribution Center',
    status: 'EXPIRING_SOON',
    value: 125.00
  },
  {
    productId: 'prod5',
    productName: 'Medical Gloves',
    productSku: 'MED-GLO-001',
    lotNumber: 'LOT-2023-012',
    expiryDate: new Date('2024-02-01').toISOString(),
    daysToExpiry: 12,
    quantity: 100,
    unitOfMeasure: 'boxes',
    locationId: 'loc5',
    locationName: 'Zone E - Medical',
    warehouseId: '2',
    warehouseName: 'Secondary Warehouse',
    status: 'NEAR_EXPIRY',
    value: 500.00
  }
];

// Mock inventory summary
const mockInventorySummary: InventorySummary = {
  totalProducts: 150,
  totalSKUs: 200,
  totalValue: 125000.00,
  totalQuantity: 25000,
  lowStockItems: 15,
  outOfStockItems: 8,
  expiringItems: 12,
  expiredItems: 3,
  activeLocations: 45,
  totalWarehouses: 3,
  recentTransactions: 125,
  lastUpdated: new Date().toISOString()
};

// API functions (mock implementations)
export async function getStockOnHand(filters?: ReportFilter): Promise<StockOnHandReport[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = mockStockOnHand;

    if (filters) {
      if (filters.warehouseIds?.length) {
        filtered = filtered.filter(item => filters.warehouseIds?.includes(item.warehouseId));
      }
      if (filters.locationIds?.length) {
        filtered = filtered.filter(item => filters.locationIds?.includes(item.locationId));
      }
      if (filters.minQuantity !== undefined) {
        filtered = filtered.filter(item => item.quantity >= filters.minQuantity!);
      }
      if (filters.maxQuantity !== undefined) {
        filtered = filtered.filter(item => item.quantity <= filters.maxQuantity!);
      }
      if (filters.status?.length) {
        filtered = filtered.filter(item => filters.status?.includes(item.status));
      }
    }

    return filtered;
  } catch (error) {
    console.error('Error in getStockOnHand:', error);
    throw error;
  }
}

export async function getStockMovements(filters?: ReportFilter): Promise<StockMovementReport[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = mockStockMovements;

    if (filters) {
      if (filters.dateFrom) {
        filtered = filtered.filter(movement => new Date(movement.timestamp) >= new Date(filters.dateFrom!));
      }
      if (filters.dateTo) {
        filtered = filtered.filter(movement => new Date(movement.timestamp) <= new Date(filters.dateTo!));
      }
      if (filters.warehouseIds?.length) {
        // Filter by warehouse - would need warehouse mapping in real implementation
      }
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error in getStockMovements:', error);
    throw error;
  }
}

export async function getAgingReport(filters?: ReportFilter): Promise<AgingReport[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = mockAgingReport;

    if (filters) {
      if (filters.includeExpired === false) {
        filtered = filtered.filter(item => item.status !== 'EXPIRED');
      }
      if (filters.warehouseIds?.length) {
        filtered = filtered.filter(item => filters.warehouseIds?.includes(item.warehouseId));
      }
    }

    return filtered;
  } catch (error) {
    console.error('Error in getAgingReport:', error);
    throw error;
  }
}

export async function getInventorySummary(): Promise<InventorySummary> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockInventorySummary;
  } catch (error) {
    console.error('Error in getInventorySummary:', error);
    throw error;
  }
}

export async function exportStockOnHandReport(format: 'CSV' | 'EXCEL' | 'PDF'): Promise<Blob> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock export - in real implementation, this would generate the actual file
    const csvData = mockStockOnHand.map(item =>
      `${item.productSku},${item.productName},${item.warehouseName},${item.locationName},${item.quantity},${item.value}`
    ).join('\n');

    const headers = 'SKU,Product,Warehouse,Location,Quantity,Value\n';
    const csvContent = headers + csvData;

    return new Blob([csvContent], { type: 'text/csv' });
  } catch (error) {
    console.error('Error in exportStockOnHandReport:', error);
    throw error;
  }
}

export async function exportStockMovementsReport(format: 'CSV' | 'EXCEL' | 'PDF'): Promise<Blob> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock export - in real implementation, this would generate the actual file
    const csvData = mockStockMovements.map(movement =>
      `${movement.productSku},${movement.productName},${movement.transactionType},${movement.quantity},${movement.timestamp}`
    ).join('\n');

    const headers = 'SKU,Product,Transaction Type,Quantity,Timestamp\n';
    const csvContent = headers + csvData;

    return new Blob([csvContent], { type: 'text/csv' });
  } catch (error) {
    console.error('Error in exportStockMovementsReport:', error);
    throw error;
  }
}

export async function getLowStockItems(): Promise<StockOnHandReport[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStockOnHand.filter(item =>
      item.status === 'LOW_STOCK' || item.status === 'OUT_OF_STOCK'
    );
  } catch (error) {
    console.error('Error in getLowStockItems:', error);
    throw error;
  }
}

export async function getExpiringItems(daysThreshold: number = 30): Promise<AgingReport[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAgingReport.filter(item =>
      item.daysToExpiry !== undefined && item.daysToExpiry <= daysThreshold
    );
  } catch (error) {
    console.error('Error in getExpiringItems:', error);
    throw error;
  }
}

export async function getTopMovingProducts(limit: number = 10): Promise<StockMovementReport[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));

    // Group movements by product and calculate total movement
    const productMovements = mockStockMovements.reduce((acc, movement) => {
      const key = movement.productId;
      if (!acc[key]) {
        acc[key] = {
          productId: movement.productId,
          productName: movement.productName,
          productSku: movement.productSku,
          totalQuantity: 0,
          movements: []
        };
      }
      acc[key].totalQuantity += Math.abs(movement.quantity);
      acc[key].movements.push(movement);
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by total quantity moved
    return Object.values(productMovements)
      .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit)
      .map((item: any) => item.movements[0]); // Return representative movement
  } catch (error) {
    console.error('Error in getTopMovingProducts:', error);
    throw error;
  }
}

export async function getInventoryValueByWarehouse(): Promise<Array<{ warehouseName: string; value: number }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));

    const warehouseValues = mockStockOnHand.reduce((acc, item) => {
      if (!acc[item.warehouseName]) {
        acc[item.warehouseName] = 0;
      }
      acc[item.warehouseName] += item.value;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(warehouseValues).map(([warehouseName, value]) => ({
      warehouseName,
      value
    }));
  } catch (error) {
    console.error('Error in getInventoryValueByWarehouse:', error);
    throw error;
  }
}

export async function getInventoryValueByCategory(): Promise<Array<{ category: string; value: number }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));

    const categoryValues = mockStockOnHand.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.value;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryValues).map(([category, value]) => ({
      category,
      value
    }));
  } catch (error) {
    console.error('Error in getInventoryValueByCategory:', error);
    throw error;
  }
}
