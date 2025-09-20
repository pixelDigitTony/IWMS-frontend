// Mock API functions for inter-warehouse transfers
// These will be replaced with actual backend calls later

export interface TransferRequest {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  requestedBy: string;
  requestedByName: string;
  requestedDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reason: string;
  notes?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ALLOCATED' | 'PICKED' | 'PACKED' | 'DISPATCHED' | 'IN_TRANSIT' | 'RECEIVED' | 'RECONCILED';
  createdAt: string;
  updatedAt: string;
}

export interface TransferItem {
  id: string;
  transferRequestId: string;
  productId: string;
  productName: string;
  productSku: string;
  requestedQuantity: number;
  allocatedQuantity: number;
  pickedQuantity: number;
  packedQuantity: number;
  shippedQuantity: number;
  receivedQuantity: number;
  unitOfMeasure: string;
  lotNumber?: string;
  expiryDate?: string;
  notes?: string;
}

export interface TransferApproval {
  id: string;
  transferRequestId: string;
  approvedBy: string;
  approvedByName: string;
  approvedDate: string;
  status: 'APPROVED' | 'REJECTED' | 'CONDITIONALLY_APPROVED';
  comments?: string;
  conditions?: string[];
}

export interface TransferDiscrepancy {
  id: string;
  transferRequestId: string;
  transferItemId: string;
  type: 'QUANTITY' | 'QUALITY' | 'DAMAGE' | 'EXPIRY' | 'OTHER';
  reportedBy: string;
  reportedByName: string;
  reportedDate: string;
  description: string;
  quantityAffected?: number;
  resolution?: 'ACCEPT' | 'REJECT' | 'PARTIAL_ACCEPT' | 'RETURN' | 'ADJUST';
  resolvedBy?: string;
  resolvedByName?: string;
  resolvedDate?: string;
  resolvedNotes?: string;
}

// Mock transfers data
const mockTransfers: TransferRequest[] = [
  {
    id: 'tr1',
    transferNumber: 'TR-2024-001',
    fromWarehouseId: '1',
    fromWarehouseName: 'Main Distribution Center',
    toWarehouseId: '2',
    toWarehouseName: 'West Coast Fulfillment',
    requestedBy: 'req1',
    requestedByName: 'John Smith',
    requestedDate: new Date('2024-01-15').toISOString(),
    priority: 'HIGH',
    reason: 'Stock rebalancing - low inventory at destination',
    status: 'PENDING_APPROVAL',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'tr2',
    transferNumber: 'TR-2024-002',
    fromWarehouseId: '2',
    fromWarehouseName: 'West Coast Fulfillment',
    toWarehouseId: '3',
    toWarehouseName: 'Regional Storage Facility',
    requestedBy: 'req2',
    requestedByName: 'Sarah Johnson',
    requestedDate: new Date('2024-01-16').toISOString(),
    priority: 'MEDIUM',
    reason: 'Seasonal demand preparation',
    status: 'APPROVED',
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-17').toISOString(),
  },
  {
    id: 'tr3',
    transferNumber: 'TR-2024-003',
    fromWarehouseId: '1',
    fromWarehouseName: 'Main Distribution Center',
    toWarehouseId: '2',
    toWarehouseName: 'West Coast Fulfillment',
    requestedBy: 'req3',
    requestedByName: 'Mike Davis',
    requestedDate: new Date('2024-01-18').toISOString(),
    priority: 'URGENT',
    reason: 'Emergency restock - critical shortage',
    status: 'ALLOCATED',
    createdAt: new Date('2024-01-18').toISOString(),
    updatedAt: new Date('2024-01-19').toISOString(),
  },
  {
    id: 'tr4',
    transferNumber: 'TR-2024-004',
    fromWarehouseId: '3',
    fromWarehouseName: 'Regional Storage Facility',
    toWarehouseId: '1',
    toWarehouseName: 'Main Distribution Center',
    requestedBy: 'req4',
    requestedByName: 'Lisa Wilson',
    requestedDate: new Date('2024-01-20').toISOString(),
    priority: 'LOW',
    reason: 'Space optimization',
    status: 'PICKED',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-21').toISOString(),
  },
  {
    id: 'tr5',
    transferNumber: 'TR-2024-005',
    fromWarehouseId: '2',
    fromWarehouseName: 'West Coast Fulfillment',
    toWarehouseId: '1',
    toWarehouseName: 'Main Distribution Center',
    requestedBy: 'req5',
    requestedByName: 'Tom Anderson',
    requestedDate: new Date('2024-01-22').toISOString(),
    priority: 'HIGH',
    reason: 'Quality control transfer',
    status: 'PACKED',
    createdAt: new Date('2024-01-22').toISOString(),
    updatedAt: new Date('2024-01-23').toISOString(),
  },
  {
    id: 'tr6',
    transferNumber: 'TR-2024-006',
    fromWarehouseId: '1',
    fromWarehouseName: 'Main Distribution Center',
    toWarehouseId: '3',
    toWarehouseName: 'Regional Storage Facility',
    requestedBy: 'req6',
    requestedByName: 'Anna Martinez',
    requestedDate: new Date('2024-01-24').toISOString(),
    priority: 'MEDIUM',
    reason: 'Overflow storage',
    status: 'DISPATCHED',
    createdAt: new Date('2024-01-24').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: 'tr7',
    transferNumber: 'TR-2024-007',
    fromWarehouseId: '3',
    fromWarehouseName: 'Regional Storage Facility',
    toWarehouseId: '2',
    toWarehouseName: 'West Coast Fulfillment',
    requestedBy: 'req7',
    requestedByName: 'David Brown',
    requestedDate: new Date('2024-01-26').toISOString(),
    priority: 'LOW',
    reason: 'Return excess stock',
    status: 'IN_TRANSIT',
    createdAt: new Date('2024-01-26').toISOString(),
    updatedAt: new Date('2024-01-27').toISOString(),
  },
  {
    id: 'tr8',
    transferNumber: 'TR-2024-008',
    fromWarehouseId: '2',
    fromWarehouseName: 'West Coast Fulfillment',
    toWarehouseId: '1',
    toWarehouseName: 'Main Distribution Center',
    requestedBy: 'req8',
    requestedByName: 'Emma Taylor',
    requestedDate: new Date('2024-01-28').toISOString(),
    priority: 'HIGH',
    reason: 'Emergency supply',
    status: 'RECEIVED',
    createdAt: new Date('2024-01-28').toISOString(),
    updatedAt: new Date('2024-01-29').toISOString(),
  },
];

// Mock transfer items data
const mockTransferItems: TransferItem[] = [
  {
    id: 'ti1',
    transferRequestId: 'tr1',
    productId: 'prod1',
    productName: '10kΩ Resistor',
    productSku: 'ELEC-RES-001',
    requestedQuantity: 1000,
    allocatedQuantity: 0,
    pickedQuantity: 0,
    packedQuantity: 0,
    shippedQuantity: 0,
    receivedQuantity: 0,
    unitOfMeasure: 'EA',
  },
  {
    id: 'ti2',
    transferRequestId: 'tr1',
    productId: 'prod2',
    productName: '100μF Capacitor',
    productSku: 'ELEC-CAP-002',
    requestedQuantity: 500,
    allocatedQuantity: 0,
    pickedQuantity: 0,
    packedQuantity: 0,
    shippedQuantity: 0,
    receivedQuantity: 0,
    unitOfMeasure: 'EA',
  },
  {
    id: 'ti3',
    transferRequestId: 'tr2',
    productId: 'prod3',
    productName: 'Aspirin 100mg',
    productSku: 'PHARMA-TAB-001',
    requestedQuantity: 5000,
    allocatedQuantity: 5000,
    pickedQuantity: 5000,
    packedQuantity: 5000,
    shippedQuantity: 5000,
    receivedQuantity: 5000,
    unitOfMeasure: 'EA',
    lotNumber: 'A2024-001',
    expiryDate: new Date('2025-12-31').toISOString(),
  },
  {
    id: 'ti4',
    transferRequestId: 'tr3',
    productId: 'prod1',
    productName: '10kΩ Resistor',
    productSku: 'ELEC-RES-001',
    requestedQuantity: 2000,
    allocatedQuantity: 2000,
    pickedQuantity: 1800,
    packedQuantity: 1800,
    shippedQuantity: 1800,
    receivedQuantity: 1800,
    unitOfMeasure: 'EA',
  },
];

// Mock approvals data
const mockApprovals: TransferApproval[] = [
  {
    id: 'app1',
    transferRequestId: 'tr2',
    approvedBy: 'app1',
    approvedByName: 'Super Admin',
    approvedDate: new Date('2024-01-17').toISOString(),
    status: 'APPROVED',
    comments: 'Approved for seasonal demand preparation',
  },
  {
    id: 'app2',
    transferRequestId: 'tr3',
    approvedBy: 'app1',
    approvedByName: 'Super Admin',
    approvedDate: new Date('2024-01-19').toISOString(),
    status: 'APPROVED',
    comments: 'Urgent approval granted for critical shortage',
  },
];

// API functions (mock implementations)
export async function getTransfers(status?: string): Promise<TransferRequest[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (status) {
      return mockTransfers.filter(t => t.status === status);
    }
    return mockTransfers;
  } catch (error) {
    console.error('Error in getTransfers:', error);
    throw error;
  }
}

export async function getTransfer(id: string): Promise<TransferRequest | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTransfers.find(t => t.id === id) || null;
  } catch (error) {
    console.error('Error in getTransfer:', error);
    throw error;
  }
}

export async function getTransferItems(transferId: string): Promise<TransferItem[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTransferItems.filter(ti => ti.transferRequestId === transferId);
  } catch (error) {
    console.error('Error in getTransferItems:', error);
    throw error;
  }
}

export async function createTransfer(transfer: Omit<TransferRequest, 'id' | 'transferNumber' | 'createdAt' | 'updatedAt'>): Promise<TransferRequest> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTransfer: TransferRequest = {
      ...transfer,
      id: `tr${Date.now()}`,
      transferNumber: `TR-2024-${String(mockTransfers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTransfers.push(newTransfer);
    return newTransfer;
  } catch (error) {
    console.error('Error in createTransfer:', error);
    throw error;
  }
}

export async function updateTransfer(id: string, updates: Partial<TransferRequest>): Promise<TransferRequest | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockTransfers.findIndex(t => t.id === id);
    if (index === -1) return null;

    mockTransfers[index] = {
      ...mockTransfers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockTransfers[index];
  } catch (error) {
    console.error('Error in updateTransfer:', error);
    throw error;
  }
}

export async function deleteTransfer(id: string): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockTransfers.findIndex(t => t.id === id);
    if (index === -1) return false;

    mockTransfers.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Error in deleteTransfer:', error);
    throw error;
  }
}

export async function approveTransfer(
  transferId: string,
  approval: Omit<TransferApproval, 'id' | 'transferRequestId' | 'approvedDate'>
): Promise<TransferApproval> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newApproval: TransferApproval = {
      ...approval,
      id: `app${Date.now()}`,
      transferRequestId: transferId,
      approvedDate: new Date().toISOString(),
    };
    mockApprovals.push(newApproval);

    // Update transfer status
    const transfer = await updateTransfer(transferId, {
      status: approval.status === 'APPROVED' ? 'APPROVED' : 'REJECTED'
    });

    return newApproval;
  } catch (error) {
    console.error('Error in approveTransfer:', error);
    throw error;
  }
}

export async function allocateTransferItems(transferId: string, allocations: Array<{itemId: string, quantity: number}>): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    allocations.forEach(({ itemId, quantity }) => {
      const item = mockTransferItems.find(ti => ti.id === itemId);
      if (item) {
        item.allocatedQuantity = Math.min(quantity, item.requestedQuantity);
      }
    });

    await updateTransfer(transferId, { status: 'ALLOCATED' });
  } catch (error) {
    console.error('Error in allocateTransferItems:', error);
    throw error;
  }
}

export async function updateTransferItemStatus(
  transferId: string,
  itemId: string,
  status: 'PICKED' | 'PACKED' | 'SHIPPED' | 'RECEIVED',
  quantity: number
): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const item = mockTransferItems.find(ti => ti.id === itemId);
    if (item) {
      switch (status) {
        case 'PICKED':
          item.pickedQuantity = quantity;
          break;
        case 'PACKED':
          item.packedQuantity = quantity;
          break;
        case 'SHIPPED':
          item.shippedQuantity = quantity;
          break;
        case 'RECEIVED':
          item.receivedQuantity = quantity;
          break;
      }
    }

    // Update transfer status based on all items
    const items = mockTransferItems.filter(ti => ti.transferRequestId === transferId);
    const allPicked = items.every(ti => ti.pickedQuantity >= ti.requestedQuantity);
    const allPacked = items.every(ti => ti.packedQuantity >= ti.requestedQuantity);
    const allShipped = items.every(ti => ti.shippedQuantity >= ti.requestedQuantity);

    let newStatus: TransferRequest['status'] = 'ALLOCATED';
    if (allShipped) newStatus = 'DISPATCHED';
    else if (allPacked) newStatus = 'PACKED';
    else if (allPicked) newStatus = 'PICKED';

    await updateTransfer(transferId, { status: newStatus });
  } catch (error) {
    console.error('Error in updateTransferItemStatus:', error);
    throw error;
  }
}

export async function dispatchTransfer(transferId: string): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    await updateTransfer(transferId, { status: 'DISPATCHED' });
  } catch (error) {
    console.error('Error in dispatchTransfer:', error);
    throw error;
  }
}

export async function receiveTransfer(transferId: string, discrepancies?: TransferDiscrepancy[]): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    await updateTransfer(transferId, { status: 'RECEIVED' });
  } catch (error) {
    console.error('Error in receiveTransfer:', error);
    throw error;
  }
}

export async function reconcileTransfer(transferId: string): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    await updateTransfer(transferId, { status: 'RECONCILED' });
  } catch (error) {
    console.error('Error in reconcileTransfer:', error);
    throw error;
  }
}

export async function getTransferApprovals(transferId?: string): Promise<TransferApproval[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (transferId) {
      return mockApprovals.filter(a => a.transferRequestId === transferId);
    }
    return mockApprovals;
  } catch (error) {
    console.error('Error in getTransferApprovals:', error);
    throw error;
  }
}
