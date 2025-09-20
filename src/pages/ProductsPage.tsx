import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts, getLots, getCategories, getCategory, getUnitsOfMeasure, getUnitOfMeasure,
  createProduct, updateProduct, deleteProduct, createLot, updateLot, deleteLot,
  createCategory, updateCategory, deleteCategory,
  createUnitOfMeasure, updateUnitOfMeasure, deleteUnitOfMeasure,
  Product, Lot, Category, UnitOfMeasure
} from '@/features/products';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, RefreshCw } from 'lucide-react';
import { ProductsTable } from '@/features/products/components/ProductsTable';
import { LotsTable } from '@/features/products/components/LotsTable';
import { CategoriesTable } from '@/features/products/components/CategoriesTable';
import { UnitsOfMeasureTable } from '@/features/products/components/UnitsOfMeasureTable';
import { ProductForm } from '@/features/products/components/ProductForm';
import { LotForm } from '@/features/products/components/LotForm';
import { CategoryForm } from '@/features/products/components/CategoryForm';
import { UnitOfMeasureForm } from '@/features/products/components/UnitOfMeasureForm';
import { ProductDetails } from '@/features/products/components/ProductDetails';
import { LotDetails } from '@/features/products/components/LotDetails';

type DialogMode =
  | 'create-product' | 'edit-product' | 'view-product'
  | 'create-lot' | 'edit-lot' | 'view-lot'
  | 'create-category' | 'edit-category' | 'view-category'
  | 'create-uom' | 'edit-uom' | 'view-uom'
  | null;

export function ProductsPage() {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedUnitOfMeasure, setSelectedUnitOfMeasure] = useState<UnitOfMeasure | null>(null);

  const queryClient = useQueryClient();

  // Fetch data
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        return await getProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
  });

  const { data: lots = [], isLoading: lotsLoading } = useQuery({
    queryKey: ['lots'],
    queryFn: async () => {
      try {
        return await getLots();
      } catch (error) {
        console.error('Error fetching lots:', error);
        throw error;
      }
    },
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await getCategories();
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
  });

  const { data: unitsOfMeasure = [], isLoading: unitsOfMeasureLoading } = useQuery({
    queryKey: ['unitsOfMeasure'],
    queryFn: async () => {
      try {
        return await getUnitsOfMeasure();
      } catch (error) {
        console.error('Error fetching units of measure:', error);
        throw error;
      }
    },
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDialogMode(null);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) => updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDialogMode(null);
      setSelectedProduct(null);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const createLotMutation = useMutation({
    mutationFn: createLot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      setDialogMode(null);
    },
  });

  const updateLotMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Lot> }) => updateLot(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      setDialogMode(null);
      setSelectedLot(null);
    },
  });

  const deleteLotMutation = useMutation({
    mutationFn: deleteLot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDialogMode(null);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) => updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDialogMode(null);
      setSelectedCategory(null);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const createUnitOfMeasureMutation = useMutation({
    mutationFn: createUnitOfMeasure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unitsOfMeasure'] });
      setDialogMode(null);
    },
  });

  const updateUnitOfMeasureMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<UnitOfMeasure> }) => updateUnitOfMeasure(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unitsOfMeasure'] });
      setDialogMode(null);
      setSelectedUnitOfMeasure(null);
    },
  });

  const deleteUnitOfMeasureMutation = useMutation({
    mutationFn: deleteUnitOfMeasure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unitsOfMeasure'] });
    },
  });

  // Handlers
  const handleProductSubmit = (data: any) => {
    if (dialogMode === 'create-product') {
      createProductMutation.mutate(data);
    } else if (dialogMode === 'edit-product' && selectedProduct) {
      updateProductMutation.mutate({ id: selectedProduct.id, updates: data });
    }
  };

  const handleLotSubmit = (data: any) => {
    if (dialogMode === 'create-lot') {
      createLotMutation.mutate(data);
    } else if (dialogMode === 'edit-lot' && selectedLot) {
      updateLotMutation.mutate({ id: selectedLot.id, updates: data });
    }
  };

  const handleCategorySubmit = (data: any) => {
    if (dialogMode === 'create-category') {
      createCategoryMutation.mutate(data);
    } else if (dialogMode === 'edit-category' && selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, updates: data });
    }
  };

  const handleUnitOfMeasureSubmit = (data: any) => {
    if (dialogMode === 'create-uom') {
      createUnitOfMeasureMutation.mutate(data);
    } else if (dialogMode === 'edit-uom' && selectedUnitOfMeasure) {
      updateUnitOfMeasureMutation.mutate({ id: selectedUnitOfMeasure.id, updates: data });
    }
  };

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogMode('edit-product');
  };

  const handleProductDelete = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      deleteProductMutation.mutate(product.id);
    }
  };

  const handleProductView = (product: Product) => {
    setSelectedProduct(product);
    setDialogMode('view-product');
  };

  const handleLotEdit = (lot: Lot) => {
    setSelectedLot(lot);
    setDialogMode('edit-lot');
  };

  const handleLotDelete = (lot: Lot) => {
    if (window.confirm(`Are you sure you want to delete lot "${lot.lotNumber}"?`)) {
      deleteLotMutation.mutate(lot.id);
    }
  };

  const handleLotView = (lot: Lot) => {
    setSelectedLot(lot);
    setDialogMode('view-lot');
  };

  const handleCategoryEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogMode('edit-category');
  };

  const handleCategoryDelete = (category: Category) => {
    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      deleteCategoryMutation.mutate(category.id);
    }
  };

  const handleCategoryView = (category: Category) => {
    setSelectedCategory(category);
    setDialogMode('view-category');
  };

  const handleUnitOfMeasureEdit = (unit: UnitOfMeasure) => {
    setSelectedUnitOfMeasure(unit);
    setDialogMode('edit-uom');
  };

  const handleUnitOfMeasureDelete = (unit: UnitOfMeasure) => {
    if (window.confirm(`Are you sure you want to delete unit "${unit.name}"?`)) {
      deleteUnitOfMeasureMutation.mutate(unit.id);
    }
  };

  const handleUnitOfMeasureView = (unit: UnitOfMeasure) => {
    setSelectedUnitOfMeasure(unit);
    setDialogMode('view-uom');
  };

  const categoriesForDropdown = categories.map(c => ({ id: c.id, name: c.name }));
  const unitsOfMeasureForDropdown = unitsOfMeasure.map(u => ({ id: u.id, name: u.name, code: u.code }));
  const productsForDropdown = products.map(p => ({ id: p.id, name: p.name, sku: p.sku }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products & Lots</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog, lots, categories, and units of measure
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['products'] });
              queryClient.invalidateQueries({ queryKey: ['lots'] });
              queryClient.invalidateQueries({ queryKey: ['categories'] });
              queryClient.invalidateQueries({ queryKey: ['unitsOfMeasure'] });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">
            Products ({products.length})
          </TabsTrigger>
          <TabsTrigger value="lots">
            All Lots ({lots.length})
          </TabsTrigger>
          <TabsTrigger value="categories">
            Categories ({categories.length})
          </TabsTrigger>
          <TabsTrigger value="uom">
            Units of Measure ({unitsOfMeasure.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Products</h2>
            <Button onClick={() => setDialogMode('create-product')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          <ProductsTable
            products={products}
            onEdit={handleProductEdit}
            onDelete={handleProductDelete}
            onView={handleProductView}
          />
        </TabsContent>

        <TabsContent value="lots" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Lots</h2>
            <Button onClick={() => setDialogMode('create-lot')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lot
            </Button>
          </div>

          <LotsTable
            lots={lots}
            onEdit={handleLotEdit}
            onDelete={handleLotDelete}
            onView={handleLotView}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Categories</h2>
            <Button onClick={() => setDialogMode('create-category')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <CategoriesTable
            categories={categories}
            onEdit={handleCategoryEdit}
            onDelete={handleCategoryDelete}
            onView={handleCategoryView}
          />
        </TabsContent>

        <TabsContent value="uom" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Units of Measure</h2>
            <Button onClick={() => setDialogMode('create-uom')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </div>

          <UnitsOfMeasureTable
            unitsOfMeasure={unitsOfMeasure}
            onEdit={handleUnitOfMeasureEdit}
            onDelete={handleUnitOfMeasureDelete}
            onView={handleUnitOfMeasureView}
          />
        </TabsContent>
      </Tabs>

      {/* Product Dialog */}
      <Dialog open={dialogMode?.includes('product')} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create-product' && 'Create New Product'}
              {dialogMode === 'edit-product' && 'Edit Product'}
              {dialogMode === 'view-product' && 'Product Details'}
            </DialogTitle>
          </DialogHeader>

          {dialogMode === 'view-product' && selectedProduct ? (
            <ProductDetails
              product={selectedProduct}
              onEdit={handleProductEdit}
              onDelete={handleProductDelete}
            />
          ) : (
            <ProductForm
              product={dialogMode === 'edit-product' ? selectedProduct || undefined : undefined}
              categories={categoriesForDropdown}
              unitsOfMeasure={unitsOfMeasureForDropdown}
              onSubmit={handleProductSubmit}
              onCancel={() => setDialogMode(null)}
              isLoading={createProductMutation.isPending || updateProductMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Lot Dialog */}
      <Dialog open={dialogMode?.includes('lot')} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create-lot' && 'Create New Lot'}
              {dialogMode === 'edit-lot' && 'Edit Lot'}
              {dialogMode === 'view-lot' && 'Lot Details'}
            </DialogTitle>
          </DialogHeader>

          {dialogMode === 'view-lot' && selectedLot ? (
            <LotDetails
              lot={selectedLot}
              onEdit={handleLotEdit}
              onDelete={handleLotDelete}
            />
          ) : (
            <LotForm
              lot={dialogMode === 'edit-lot' ? selectedLot || undefined : undefined}
              products={productsForDropdown}
              onSubmit={handleLotSubmit}
              onCancel={() => setDialogMode(null)}
              isLoading={createLotMutation.isPending || updateLotMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={dialogMode?.includes('category')} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create-category' && 'Create New Category'}
              {dialogMode === 'edit-category' && 'Edit Category'}
              {dialogMode === 'view-category' && 'Category Details'}
            </DialogTitle>
          </DialogHeader>

          <CategoryForm
            category={dialogMode === 'edit-category' ? selectedCategory || undefined : undefined}
            categories={categoriesForDropdown}
            onSubmit={handleCategorySubmit}
            onCancel={() => setDialogMode(null)}
            isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Unit of Measure Dialog */}
      <Dialog open={dialogMode?.includes('uom')} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create-uom' && 'Create New Unit of Measure'}
              {dialogMode === 'edit-uom' && 'Edit Unit of Measure'}
              {dialogMode === 'view-uom' && 'Unit of Measure Details'}
            </DialogTitle>
          </DialogHeader>

          <UnitOfMeasureForm
            unitOfMeasure={dialogMode === 'edit-uom' ? selectedUnitOfMeasure || undefined : undefined}
            onSubmit={handleUnitOfMeasureSubmit}
            onCancel={() => setDialogMode(null)}
            isLoading={createUnitOfMeasureMutation.isPending || updateUnitOfMeasureMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}