// Mock API functions for products, lots, categories, and UoM
// These will be replaced with actual backend calls later

export interface Category {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UnitOfMeasure {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: 'COUNT' | 'WEIGHT' | 'VOLUME' | 'LENGTH' | 'AREA';
  baseUnit: string;
  conversionFactor: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  unitOfMeasureId: string;
  unitOfMeasureName: string;
  unitOfMeasureCode: string;
  barcode?: string;
  minimumStockLevel: number;
  maximumStockLevel: number;
  isActive: boolean;
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Lot {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  lotNumber: string;
  expiryDate?: string;
  manufactureDate?: string;
  supplierBatchNumber?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  locationId?: string;
  locationName?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'QUARANTINE' | 'CONSUMED';
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Mock categories data
const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Electronics',
    code: 'ELEC',
    description: 'Electronic components and devices',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'cat2',
    name: 'Components',
    code: 'COMP',
    description: 'Sub-components and parts',
    parentCategoryId: 'cat1',
    parentCategoryName: 'Electronics',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'cat3',
    name: 'Pharmaceuticals',
    code: 'PHARMA',
    description: 'Medical and pharmaceutical products',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'cat4',
    name: 'Tablets',
    code: 'TAB',
    description: 'Tablet medications',
    parentCategoryId: 'cat3',
    parentCategoryName: 'Pharmaceuticals',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
];

// Mock units of measure data
const mockUnitsOfMeasure: UnitOfMeasure[] = [
  {
    id: 'uom1',
    name: 'Each',
    code: 'EA',
    description: 'Individual units',
    type: 'COUNT',
    baseUnit: 'EA',
    conversionFactor: 1,
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'uom2',
    name: 'Kilogram',
    code: 'KG',
    description: 'Weight in kilograms',
    type: 'WEIGHT',
    baseUnit: 'KG',
    conversionFactor: 1,
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'uom3',
    name: 'Gram',
    code: 'G',
    description: 'Weight in grams',
    type: 'WEIGHT',
    baseUnit: 'KG',
    conversionFactor: 1000,
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'uom4',
    name: 'Liter',
    code: 'L',
    description: 'Volume in liters',
    type: 'VOLUME',
    baseUnit: 'L',
    conversionFactor: 1,
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'uom5',
    name: 'Milliliter',
    code: 'ML',
    description: 'Volume in milliliters',
    type: 'VOLUME',
    baseUnit: 'L',
    conversionFactor: 1000,
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
];

// Mock products data
const mockProducts: Product[] = [
  {
    id: 'prod1',
    sku: 'ELEC-RES-001',
    name: '10kΩ Resistor',
    description: '10 kilo-ohm carbon film resistor, 1/4W',
    categoryId: 'cat2',
    categoryName: 'Components',
    unitOfMeasureId: 'uom1',
    unitOfMeasureName: 'Each',
    unitOfMeasureCode: 'EA',
    barcode: '1234567890123',
    minimumStockLevel: 1000,
    maximumStockLevel: 10000,
    isActive: true,
    attributes: { tolerance: '5%', powerRating: '0.25W', package: 'Axial' },
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'prod2',
    sku: 'ELEC-CAP-002',
    name: '100μF Capacitor',
    description: '100 microfarad electrolytic capacitor, 25V',
    categoryId: 'cat2',
    categoryName: 'Components',
    unitOfMeasureId: 'uom1',
    unitOfMeasureName: 'Each',
    unitOfMeasureCode: 'EA',
    barcode: '1234567890124',
    minimumStockLevel: 500,
    maximumStockLevel: 5000,
    isActive: true,
    attributes: { voltage: '25V', type: 'Electrolytic', package: 'Radial' },
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: 'prod3',
    sku: 'PHARMA-TAB-001',
    name: 'Aspirin 100mg',
    description: 'Acetylsalicylic acid tablets, 100mg each',
    categoryId: 'cat4',
    categoryName: 'Tablets',
    unitOfMeasureId: 'uom1',
    unitOfMeasureName: 'Each',
    unitOfMeasureCode: 'EA',
    minimumStockLevel: 10000,
    maximumStockLevel: 100000,
    isActive: true,
    attributes: { strength: '100mg', form: 'Tablet', packaging: 'Blister pack' },
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'prod4',
    sku: 'PHARMA-LIQ-002',
    name: 'Cough Syrup 100ml',
    description: 'Antitussive syrup, 100ml bottle',
    categoryId: 'cat3',
    categoryName: 'Pharmaceuticals',
    unitOfMeasureId: 'uom5',
    unitOfMeasureName: 'Milliliter',
    unitOfMeasureCode: 'ML',
    barcode: '1234567890125',
    minimumStockLevel: 500,
    maximumStockLevel: 2000,
    isActive: true,
    attributes: { volume: '100ml', concentration: '5mg/ml', packaging: 'Bottle' },
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
];

// Mock lots data
const mockLots: Lot[] = [
  {
    id: 'lot1',
    productId: 'prod1',
    productName: '10kΩ Resistor',
    productSku: 'ELEC-RES-001',
    lotNumber: 'R2024-001',
    expiryDate: new Date('2026-12-31').toISOString(),
    manufactureDate: new Date('2024-01-15').toISOString(),
    supplierBatchNumber: 'SUP001-240115',
    quantity: 5000,
    reservedQuantity: 200,
    availableQuantity: 4800,
    locationId: 'loc1',
    locationName: 'Zone A - Receiving',
    status: 'ACTIVE',
    attributes: { quality: 'A', inspectionDate: '2024-01-16' },
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'lot2',
    productId: 'prod2',
    productName: '100μF Capacitor',
    productSku: 'ELEC-CAP-002',
    lotNumber: 'C2024-001',
    expiryDate: new Date('2027-06-30').toISOString(),
    manufactureDate: new Date('2024-01-16').toISOString(),
    supplierBatchNumber: 'SUP002-240116',
    quantity: 2500,
    reservedQuantity: 500,
    availableQuantity: 2000,
    locationId: 'loc2',
    locationName: 'Zone B - High Value',
    status: 'ACTIVE',
    attributes: { quality: 'A', inspectionDate: '2024-01-17' },
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: 'lot3',
    productId: 'prod3',
    productName: 'Aspirin 100mg',
    productSku: 'PHARMA-TAB-001',
    lotNumber: 'A2024-001',
    expiryDate: new Date('2025-12-31').toISOString(),
    manufactureDate: new Date('2024-01-20').toISOString(),
    supplierBatchNumber: 'SUP003-240120',
    quantity: 50000,
    reservedQuantity: 5000,
    availableQuantity: 45000,
    status: 'ACTIVE',
    attributes: { batch: 'Batch A', quality: 'Pharma Grade' },
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'lot4',
    productId: 'prod3',
    productName: 'Aspirin 100mg',
    productSku: 'PHARMA-TAB-001',
    lotNumber: 'A2024-002',
    expiryDate: new Date('2024-11-30').toISOString(),
    manufactureDate: new Date('2024-02-01').toISOString(),
    supplierBatchNumber: 'SUP003-240201',
    quantity: 30000,
    reservedQuantity: 10000,
    availableQuantity: 20000,
    status: 'ACTIVE',
    attributes: { batch: 'Batch B', quality: 'Pharma Grade' },
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'lot5',
    productId: 'prod4',
    productName: 'Cough Syrup 100ml',
    productSku: 'PHARMA-LIQ-002',
    lotNumber: 'CS2024-001',
    expiryDate: new Date('2025-06-30').toISOString(),
    manufactureDate: new Date('2024-01-25').toISOString(),
    supplierBatchNumber: 'SUP004-240125',
    quantity: 1000,
    reservedQuantity: 100,
    availableQuantity: 900,
    status: 'ACTIVE',
    attributes: { viscosity: 'Standard', color: 'Clear' },
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
];

// API functions (mock implementations)
export async function getCategories(): Promise<Category[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories;
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
}

export async function getCategory(id: string): Promise<Category | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories.find(c => c.id === id) || null;
  } catch (error) {
    console.error('Error in getCategory:', error);
    throw error;
  }
}

export async function createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCategory: Category = {
      ...category,
      id: `cat${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCategories.push(newCategory);
    return newCategory;
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw error;
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) return null;

    mockCategories[index] = {
      ...mockCategories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockCategories[index];
  } catch (error) {
    console.error('Error in updateCategory:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) return false;

    mockCategories.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    throw error;
  }
}

export async function getUnitsOfMeasure(): Promise<UnitOfMeasure[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUnitsOfMeasure;
  } catch (error) {
    console.error('Error in getUnitsOfMeasure:', error);
    throw error;
  }
}

export async function getUnitOfMeasure(id: string): Promise<UnitOfMeasure | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUnitsOfMeasure.find(u => u.id === id) || null;
  } catch (error) {
    console.error('Error in getUnitOfMeasure:', error);
    throw error;
  }
}

export async function createUnitOfMeasure(unitOfMeasure: Omit<UnitOfMeasure, 'id' | 'createdAt' | 'updatedAt'>): Promise<UnitOfMeasure> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUnitOfMeasure: UnitOfMeasure = {
      ...unitOfMeasure,
      id: `uom${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUnitsOfMeasure.push(newUnitOfMeasure);
    return newUnitOfMeasure;
  } catch (error) {
    console.error('Error in createUnitOfMeasure:', error);
    throw error;
  }
}

export async function updateUnitOfMeasure(id: string, updates: Partial<UnitOfMeasure>): Promise<UnitOfMeasure | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockUnitsOfMeasure.findIndex(u => u.id === id);
    if (index === -1) return null;

    mockUnitsOfMeasure[index] = {
      ...mockUnitsOfMeasure[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockUnitsOfMeasure[index];
  } catch (error) {
    console.error('Error in updateUnitOfMeasure:', error);
    throw error;
  }
}

export async function deleteUnitOfMeasure(id: string): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockUnitsOfMeasure.findIndex(u => u.id === id);
    if (index === -1) return false;

    mockUnitsOfMeasure.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Error in deleteUnitOfMeasure:', error);
    throw error;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockProducts.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error in getProduct:', error);
    throw error;
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProduct: Product = {
      ...product,
      id: `prod${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;

    mockProducts[index] = {
      ...mockProducts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockProducts[index];
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;

    mockProducts.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
}

export async function getLots(productId?: string): Promise<Lot[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (productId) {
      return mockLots.filter(l => l.productId === productId);
    }
    return mockLots;
  } catch (error) {
    console.error('Error in getLots:', error);
    throw error;
  }
}

export async function getLot(id: string): Promise<Lot | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockLots.find(l => l.id === id) || null;
  } catch (error) {
    console.error('Error in getLot:', error);
    throw error;
  }
}

export async function createLot(lot: Omit<Lot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lot> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newLot: Lot = {
      ...lot,
      id: `lot${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLots.push(newLot);
    return newLot;
  } catch (error) {
    console.error('Error in createLot:', error);
    throw error;
  }
}

export async function updateLot(id: string, updates: Partial<Lot>): Promise<Lot | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockLots.findIndex(l => l.id === id);
    if (index === -1) return null;

    mockLots[index] = {
      ...mockLots[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockLots[index];
  } catch (error) {
    console.error('Error in updateLot:', error);
    throw error;
  }
}

export async function deleteLot(id: string): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockLots.findIndex(l => l.id === id);
    if (index === -1) return false;

    mockLots.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Error in deleteLot:', error);
    throw error;
  }
}
