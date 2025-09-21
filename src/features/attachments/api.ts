// Mock API functions for attachments and documents
// These will be replaced with actual backend calls later

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  category: 'GRN' | 'DELIVERY_NOTE' | 'INVOICE' | 'PHOTO' | 'PACKING_LIST' | 'SHIPPING_LABEL' | 'OTHER';
  description?: string;
  relatedEntityType?: 'ORDER' | 'SHIPMENT' | 'PICKING_LIST' | 'RECEIVING' | 'INVENTORY';
  relatedEntityId?: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  url: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  tags: string[];
}

export interface UploadRequest {
  filename: string;
  fileSize: number;
  fileType: string;
  category: Attachment['category'];
  description?: string;
  relatedEntityType?: Attachment['relatedEntityType'];
  relatedEntityId?: string;
  isPublic: boolean;
  tags: string[];
}

export interface UploadResponse {
  presignedUrl: string;
  attachmentId: string;
  uploadUrl: string;
}

// Mock attachments data
const mockAttachments: Attachment[] = [
  {
    id: 'att1',
    filename: 'grn-2024-001.pdf',
    originalName: 'Goods Receipt Note - PO-2024-001.pdf',
    fileSize: 245760,
    fileType: 'application/pdf',
    category: 'GRN',
    description: 'Goods receipt note for Purchase Order PO-2024-001',
    relatedEntityType: 'RECEIVING',
    relatedEntityId: 'grn1',
    uploadedBy: 'user1',
    uploadedByName: 'John Smith',
    uploadedAt: new Date('2024-01-15T10:30:00Z').toISOString(),
    url: '/api/attachments/grn-2024-001.pdf',
    isPublic: false,
    tags: ['GRN', 'PO-2024-001', 'January 2024']
  },
  {
    id: 'att2',
    filename: 'delivery-note-fedex.jpg',
    originalName: 'FedEx Delivery Note - SO-2024-001.jpg',
    fileSize: 1024000,
    fileType: 'image/jpeg',
    category: 'DELIVERY_NOTE',
    description: 'FedEx delivery confirmation for Sales Order SO-2024-001',
    relatedEntityType: 'ORDER',
    relatedEntityId: 'oo1',
    uploadedBy: 'user2',
    uploadedByName: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-16T14:20:00Z').toISOString(),
    url: '/api/attachments/delivery-note-fedex.jpg',
    thumbnailUrl: '/api/attachments/thumbnails/delivery-note-fedex-thumb.jpg',
    isPublic: true,
    tags: ['Delivery', 'FedEx', 'SO-2024-001']
  },
  {
    id: 'att3',
    filename: 'warehouse-photo-001.jpg',
    originalName: 'Warehouse Receiving Area - Photo 001.jpg',
    fileSize: 2048000,
    fileType: 'image/jpeg',
    category: 'PHOTO',
    description: 'Photo of receiving area during inventory count',
    relatedEntityType: 'INVENTORY',
    relatedEntityId: 'inv1',
    uploadedBy: 'user3',
    uploadedByName: 'Mike Davis',
    uploadedAt: new Date('2024-01-17T09:15:00Z').toISOString(),
    url: '/api/attachments/warehouse-photo-001.jpg',
    thumbnailUrl: '/api/attachments/thumbnails/warehouse-photo-001-thumb.jpg',
    isPublic: false,
    tags: ['Photo', 'Warehouse', 'Receiving Area', 'Inventory Count']
  },
  {
    id: 'att4',
    filename: 'packing-list-so-002.pdf',
    originalName: 'Packing List - SO-2024-002.pdf',
    fileSize: 183500,
    fileType: 'application/pdf',
    category: 'PACKING_LIST',
    description: 'Packing list for Sales Order SO-2024-002',
    relatedEntityType: 'ORDER',
    relatedEntityId: 'oo2',
    uploadedBy: 'user1',
    uploadedByName: 'John Smith',
    uploadedAt: new Date('2024-01-18T11:45:00Z').toISOString(),
    url: '/api/attachments/packing-list-so-002.pdf',
    isPublic: false,
    tags: ['Packing List', 'SO-2024-002', 'January 2024']
  },
  {
    id: 'att5',
    filename: 'shipping-label-ups.jpg',
    originalName: 'UPS Shipping Label - SHP-2024-001.jpg',
    fileSize: 512000,
    fileType: 'image/jpeg',
    category: 'SHIPPING_LABEL',
    description: 'UPS shipping label for Shipment SHP-2024-001',
    relatedEntityType: 'SHIPMENT',
    relatedEntityId: 'sh1',
    uploadedBy: 'user4',
    uploadedByName: 'Lisa Wong',
    uploadedAt: new Date('2024-01-19T16:30:00Z').toISOString(),
    url: '/api/attachments/shipping-label-ups.jpg',
    thumbnailUrl: '/api/attachments/thumbnails/shipping-label-ups-thumb.jpg',
    isPublic: true,
    tags: ['Shipping Label', 'UPS', 'SHP-2024-001']
  }
];

// API functions (mock implementations)
export async function getAttachments(
  category?: string,
  relatedEntityType?: string,
  relatedEntityId?: string
): Promise<Attachment[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = mockAttachments;

    if (category) {
      filtered = filtered.filter(att => att.category === category);
    }

    if (relatedEntityType) {
      filtered = filtered.filter(att => att.relatedEntityType === relatedEntityType);
    }

    if (relatedEntityId) {
      filtered = filtered.filter(att => att.relatedEntityId === relatedEntityId);
    }

    return filtered;
  } catch (error) {
    console.error('Error in getAttachments:', error);
    throw error;
  }
}

export async function getAttachment(id: string): Promise<Attachment | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAttachments.find(att => att.id === id) || null;
  } catch (error) {
    console.error('Error in getAttachment:', error);
    throw error;
  }
}

export async function requestUpload(request: UploadRequest): Promise<UploadResponse> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));

    const attachmentId = `att${Date.now()}`;
    const uploadUrl = `/api/upload/${attachmentId}`;

    // In a real implementation, this would make a request to the backend
    // to generate a presigned URL for direct upload to R2
    const presignedUrl = `https://mock-presigned-url.example.com/upload/${attachmentId}`;

    return {
      presignedUrl,
      attachmentId,
      uploadUrl
    };
  } catch (error) {
    console.error('Error in requestUpload:', error);
    throw error;
  }
}

export async function uploadFile(
  presignedUrl: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    // Mock upload simulation
    await new Promise<void>((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (onProgress) {
          onProgress(progress);
        }
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    // In a real implementation, this would upload the file to the presigned URL
    console.log('File uploaded to:', presignedUrl);
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}

export async function createAttachment(attachment: Omit<Attachment, 'id' | 'uploadedAt'>): Promise<Attachment> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newAttachment: Attachment = {
      ...attachment,
      id: `att${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    mockAttachments.push(newAttachment);
    return newAttachment;
  } catch (error) {
    console.error('Error in createAttachment:', error);
    throw error;
  }
}

export async function updateAttachment(id: string, updates: Partial<Attachment>): Promise<Attachment | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockAttachments.findIndex(att => att.id === id);
    if (index === -1) return null;

    mockAttachments[index] = {
      ...mockAttachments[index],
      ...updates,
    };
    return mockAttachments[index];
  } catch (error) {
    console.error('Error in updateAttachment:', error);
    throw error;
  }
}

export async function deleteAttachment(id: string): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockAttachments.findIndex(att => att.id === id);
    if (index === -1) return false;

    mockAttachments.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Error in deleteAttachment:', error);
    throw error;
  }
}

export async function downloadAttachment(id: string): Promise<Blob> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock file download - in real implementation, this would fetch from the actual file URL
    const attachment = mockAttachments.find(att => att.id === id);
    if (!attachment) {
      throw new Error('Attachment not found');
    }

    // Return a mock blob for demonstration
    return new Blob(['Mock file content'], { type: attachment.fileType });
  } catch (error) {
    console.error('Error in downloadAttachment:', error);
    throw error;
  }
}

export async function getAttachmentsByCategory(category: Attachment['category']): Promise<Attachment[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAttachments.filter(att => att.category === category);
  } catch (error) {
    console.error('Error in getAttachmentsByCategory:', error);
    throw error;
  }
}

export async function getAttachmentsByEntity(
  entityType: Attachment['relatedEntityType'],
  entityId: string
): Promise<Attachment[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockAttachments.filter(att =>
      att.relatedEntityType === entityType && att.relatedEntityId === entityId
    );
  } catch (error) {
    console.error('Error in getAttachmentsByEntity:', error);
    throw error;
  }
}

export async function searchAttachments(query: string): Promise<Attachment[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return mockAttachments.filter(att =>
      att.originalName.toLowerCase().includes(lowerQuery) ||
      att.description?.toLowerCase().includes(lowerQuery) ||
      att.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      att.category.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error in searchAttachments:', error);
    throw error;
  }
}

// Utility functions
export function getFileSizeDisplay(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileTypeIcon(fileType: string): string {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊';
  if (fileType.includes('document') || fileType.includes('word')) return '📝';
  return '📁';
}

export function getCategoryDisplay(category: Attachment['category']): string {
  switch (category) {
    case 'GRN': return 'Goods Receipt Note';
    case 'DELIVERY_NOTE': return 'Delivery Note';
    case 'INVOICE': return 'Invoice';
    case 'PHOTO': return 'Photo';
    case 'PACKING_LIST': return 'Packing List';
    case 'SHIPPING_LABEL': return 'Shipping Label';
    case 'OTHER': return 'Other';
    default: return category;
  }
}

// Legacy functions for backward compatibility with existing FileUpload component
export async function presignUpload(key: string, contentType: string): Promise<string> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    // In a real implementation, this would call the backend to generate a presigned URL
    return `https://mock-presigned-url.example.com/upload/${key}`;
  } catch (error) {
    console.error('Error in presignUpload:', error);
    throw error;
  }
}

export async function uploadToPresignedUrl(url: string, file: File): Promise<void> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    // In a real implementation, this would upload the file to the presigned URL
    console.log('File uploaded to:', url);
  } catch (error) {
    console.error('Error in uploadToPresignedUrl:', error);
    throw error;
  }
}