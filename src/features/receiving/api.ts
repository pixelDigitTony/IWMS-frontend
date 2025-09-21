// Mock API functions for receiving (inbound) processes
// These will be replaced with actual backend calls later

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'DRAFT' | 'SENT' | 'CONFIRMED' | 'PARTIALLY_RECEIVED' | 'FULLY_RECEIVED' | 'CANCELLED';
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvanceShippingNotice {
  id: string;
  asnNumber: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: 'PENDING' | 'RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  carrier: string;
  trackingNumber?: string;
  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
  items: ASNItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ASNItem {
  id: string;
  asnId: string;
  productId: string;
  productName: string;
  productSku: string;
  orderedQuantity: number;
  shippedQuantity: number;
  unitOfMeasure: string;
  lotNumber?: string;
  expiryDate?: string;
  notes?: string;
}

export interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  asnId?: string;
  asnNumber?: string;
  poId?: string;
  poNumber?: string;
  supplierId: string;
  supplierName: string;
  receivedDate: string;
  receivedBy: string;
  receivedByName: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalItems: number;
  totalQuantityReceived: number;
  totalQuantityExpected: number;
  totalValueReceived: number;
  items: GRNItem[];
  discrepancies?: GRNDiscrepancy[];
  putawayCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GRNItem {
  id: string;
  grnId: string;
  asnItemId?: string;
  productId: string;
  productName: string;
  productSku: string;
  expectedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unitOfMeasure: string;
  lotNumber?: string;
  expiryDate?: string;
  locationId?: string;
  locationName?: string;
  putawayStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  qualityStatus: 'PENDING' | 'PASSED' | 'FAILED' | 'QUARANTINE';
  notes?: string;
}

export interface GRNDiscrepancy {
  id: string;
  grnId: string;
  grnItemId: string;
  type: 'QUANTITY' | 'QUALITY' | 'DAMAGE' | 'EXPIRY' | 'DOCUMENTATION' | 'OTHER';
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  description: string;
  reportedBy: string;
  reportedByName: string;
  reportedDate: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED';
  resolution?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  resolvedDate?: string;
}

export interface PutawaySuggestion {
  id: string;
  grnItemId: string;
  productId: string;
  productName: string;
  suggestedLocationId: string;
  suggestedLocationName: string;
  suggestedLocationType: 'ZONE' | 'BIN' | 'SHELF' | 'RACK';
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  capacityCheck: boolean;
  accessibility: 'EASY' | 'MEDIUM' | 'DIFFICULT';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

// Mock purchase orders data
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po1',
    poNumber: 'PO-2024-001',
    supplierId: 'sup1',
    supplierName: 'Global Electronics Ltd',
    orderDate: new Date('2024-01-10').toISOString(),
    expectedDeliveryDate: new Date('2024-01-25').toISOString(),
    status: 'CONFIRMED',
    totalItems: 5,
    totalQuantity: 1250,
    totalValue: 25000,
    currency: 'USD',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'po2',
    poNumber: 'PO-2024-002',
    supplierId: 'sup2',
    supplierName: 'PharmaCorp Inc',
    orderDate: new Date('2024-01-12').toISOString(),
    expectedDeliveryDate: new Date('2024-01-28').toISOString(),
    status: 'PARTIALLY_RECEIVED',
    totalItems: 3,
    totalQuantity: 5000,
    totalValue: 15000,
    currency: 'USD',
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'po3',
    poNumber: 'PO-2024-003',
    supplierId: 'sup3',
    supplierName: 'Industrial Parts Co',
    orderDate: new Date('2024-01-15').toISOString(),
    expectedDeliveryDate: new Date('2024-01-30').toISOString(),
    status: 'SENT',
    totalItems: 8,
    totalQuantity: 800,
    totalValue: 32000,
    currency: 'USD',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
];

// Mock ASN data
const mockASNs: AdvanceShippingNotice[] = [
  {
    id: 'asn1',
    asnNumber: 'ASN-2024-001',
    poNumber: 'PO-2024-001',
    supplierId: 'sup1',
    supplierName: 'Global Electronics Ltd',
    expectedDeliveryDate: new Date('2024-01-25').toISOString(),
    actualDeliveryDate: new Date('2024-01-24').toISOString(),
    status: 'RECEIVED',
    carrier: 'FedEx',
    trackingNumber: 'FX123456789',
    totalPackages: 3,
    totalWeight: 25.5,
    totalVolume: 1.2,
    items: [],
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-24').toISOString(),
  },
  {
    id: 'asn2',
    asnNumber: 'ASN-2024-002',
    poNumber: 'PO-2024-002',
    supplierId: 'sup2',
    supplierName: 'PharmaCorp Inc',
    expectedDeliveryDate: new Date('2024-01-28').toISOString(),
    status: 'PROCESSING',
    carrier: 'UPS',
    trackingNumber: 'UPS987654321',
    totalPackages: 2,
    totalWeight: 15.0,
    totalVolume: 0.8,
    items: [],
    createdAt: new Date('2024-01-22').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
];

// Mock GRN data
const mockGRNs: GoodsReceiptNote[] = [
  {
    id: 'grn1',
    grnNumber: 'GRN-2024-001',
    asnId: 'asn1',
    asnNumber: 'ASN-2024-001',
    poId: 'po1',
    poNumber: 'PO-2024-001',
    supplierId: 'sup1',
    supplierName: 'Global Electronics Ltd',
    receivedDate: new Date('2024-01-24').toISOString(),
    receivedBy: 'rec1',
    receivedByName: 'John Smith',
    status: 'COMPLETED',
    totalItems: 5,
    totalQuantityReceived: 1250,
    totalQuantityExpected: 1250,
    totalValueReceived: 25000,
    items: [],
    putawayCompleted: true,
    createdAt: new Date('2024-01-24').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: 'grn2',
    grnNumber: 'GRN-2024-002',
    asnId: 'asn2',
    asnNumber: 'ASN-2024-002',
    poId: 'po2',
    poNumber: 'PO-2024-002',
    supplierId: 'sup2',
    supplierName: 'PharmaCorp Inc',
    receivedDate: new Date('2024-01-25').toISOString(),
    receivedBy: 'rec2',
    receivedByName: 'Sarah Johnson',
    status: 'IN_PROGRESS',
    totalItems: 3,
    totalQuantityReceived: 3500,
    totalQuantityExpected: 5000,
    totalValueReceived: 10500,
    items: [],
    putawayCompleted: false,
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-26').toISOString(),
  },
];

// Mock putaway suggestions
const mockPutawaySuggestions: PutawaySuggestion[] = [
  {
    id: 'ps1',
    grnItemId: 'gri1',
    productId: 'prod1',
    productName: '10kΩ Resistor',
    suggestedLocationId: 'loc1',
    suggestedLocationName: 'Zone A - Receiving',
    suggestedLocationType: 'ZONE',
    reason: 'High turnover item, place near picking area',
    priority: 'HIGH',
    capacityCheck: true,
    accessibility: 'EASY',
    status: 'APPROVED',
    createdAt: new Date('2024-01-24').toISOString(),
    updatedAt: new Date('2024-01-24').toISOString(),
  },
  {
    id: 'ps2',
    grnItemId: 'gri2',
    productId: 'prod3',
    productName: 'Aspirin 100mg',
    suggestedLocationId: 'loc4',
    suggestedLocationName: 'Zone 1 - Fast Moving',
    suggestedLocationType: 'ZONE',
    reason: 'Pharmaceutical item, requires controlled temperature',
    priority: 'HIGH',
    capacityCheck: true,
    accessibility: 'MEDIUM',
    status: 'PENDING',
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
];

// API functions (mock implementations)
export async function getPurchaseOrders(status?: string): Promise<PurchaseOrder[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (status) {
      return mockPurchaseOrders.filter(po => po.status === status);
    }
    return mockPurchaseOrders;
  } catch (error) {
    console.error('Error in getPurchaseOrders:', error);
    throw error;
  }
}

export async function getAdvanceShippingNotices(status?: string): Promise<AdvanceShippingNotice[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (status) {
      return mockASNs.filter(asn => asn.status === status);
    }
    return mockASNs;
  } catch (error) {
    console.error('Error in getAdvanceShippingNotices:', error);
    throw error;
  }
}

export async function getGoodsReceiptNotes(status?: string): Promise<GoodsReceiptNote[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (status) {
      return mockGRNs.filter(grn => grn.status === status);
    }
    return mockGRNs;
  } catch (error) {
    console.error('Error in getGoodsReceiptNotes:', error);
    throw error;
  }
}

export async function getPutawaySuggestions(grnId?: string): Promise<PutawaySuggestion[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (grnId) {
      return mockPutawaySuggestions.filter(ps => ps.grnItemId.startsWith(grnId));
    }
    return mockPutawaySuggestions;
  } catch (error) {
    console.error('Error in getPutawaySuggestions:', error);
    throw error;
  }
}

export async function createGoodsReceiptNote(grn: Omit<GoodsReceiptNote, 'id' | 'grnNumber' | 'createdAt' | 'updatedAt'>): Promise<GoodsReceiptNote> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newGRN: GoodsReceiptNote = {
      ...grn,
      id: `grn${Date.now()}`,
      grnNumber: `GRN-2024-${String(mockGRNs.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockGRNs.push(newGRN);
    return newGRN;
  } catch (error) {
    console.error('Error in createGoodsReceiptNote:', error);
    throw error;
  }
}

export async function updateGoodsReceiptNote(id: string, updates: Partial<GoodsReceiptNote>): Promise<GoodsReceiptNote | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockGRNs.findIndex(grn => grn.id === id);
    if (index === -1) return null;

    mockGRNs[index] = {
      ...mockGRNs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockGRNs[index];
  } catch (error) {
    console.error('Error in updateGoodsReceiptNote:', error);
    throw error;
  }
}

export async function generatePutawaySuggestions(grnId: string): Promise<PutawaySuggestion[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Simulate AI-powered putaway suggestions based on:
    // - Product characteristics
    // - Location availability
    // - Warehouse layout optimization
    // - Picking frequency
    // - Storage requirements

    const suggestions: PutawaySuggestion[] = [
      {
        id: `ps${Date.now()}-1`,
        grnItemId: `${grnId}i1`,
        productId: 'prod1',
        productName: 'Sample Product 1',
        suggestedLocationId: 'loc1',
        suggestedLocationName: 'Zone A - Receiving',
        suggestedLocationType: 'ZONE',
        reason: 'High turnover item, place near picking area',
        priority: 'HIGH',
        capacityCheck: true,
        accessibility: 'EASY',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `ps${Date.now()}-2`,
        grnItemId: `${grnId}i2`,
        productId: 'prod2',
        productName: 'Sample Product 2',
        suggestedLocationId: 'loc4',
        suggestedLocationName: 'Zone B - High Value',
        suggestedLocationType: 'ZONE',
        reason: 'Controlled temperature requirement',
        priority: 'HIGH',
        capacityCheck: true,
        accessibility: 'MEDIUM',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    suggestions.forEach(suggestion => {
      mockPutawaySuggestions.push(suggestion);
    });

    return suggestions;
  } catch (error) {
    console.error('Error in generatePutawaySuggestions:', error);
    throw error;
  }
}

export async function approvePutawaySuggestion(suggestionId: string): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const suggestion = mockPutawaySuggestions.find(ps => ps.id === suggestionId);
    if (suggestion) {
      suggestion.status = 'APPROVED';
      suggestion.updatedAt = new Date().toISOString();
    }
  } catch (error) {
    console.error('Error in approvePutawaySuggestion:', error);
    throw error;
  }
}

export async function rejectPutawaySuggestion(suggestionId: string, reason: string): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const suggestion = mockPutawaySuggestions.find(ps => ps.id === suggestionId);
    if (suggestion) {
      suggestion.status = 'REJECTED';
      suggestion.updatedAt = new Date().toISOString();
      // Note: In a real implementation, we'd store the rejection reason
    }
  } catch (error) {
    console.error('Error in rejectPutawaySuggestion:', error);
    throw error;
  }
}

export async function completePutaway(grnId: string): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const grn = mockGRNs.find(g => g.id === grnId);
    if (grn) {
      grn.putawayCompleted = true;
      grn.updatedAt = new Date().toISOString();
    }
  } catch (error) {
    console.error('Error in completePutaway:', error);
    throw error;
  }
}

export async function reportDiscrepancy(discrepancy: Omit<GRNDiscrepancy, 'id' | 'reportedDate'>): Promise<GRNDiscrepancy> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newDiscrepancy: GRNDiscrepancy = {
      ...discrepancy,
      id: `disc${Date.now()}`,
      reportedDate: new Date().toISOString(),
    };

    // Add to the corresponding GRN's discrepancies
    const grn = mockGRNs.find(g => g.id === discrepancy.grnId);
    if (grn) {
      if (!grn.discrepancies) {
        grn.discrepancies = [];
      }
      grn.discrepancies.push(newDiscrepancy);
    }

    return newDiscrepancy;
  } catch (error) {
    console.error('Error in reportDiscrepancy:', error);
    throw error;
  }
}

export async function resolveDiscrepancy(discrepancyId: string, resolution: { status: GRNDiscrepancy['status'], resolution: string }): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    // In a real implementation, this would update the discrepancy in the database
    console.log(`Resolving discrepancy ${discrepancyId} with status: ${resolution.status}, resolution: ${resolution.resolution}`);
  } catch (error) {
    console.error('Error in resolveDiscrepancy:', error);
    throw error;
  }
}
