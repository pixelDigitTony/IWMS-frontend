import React from 'react';
import { Product, getLots } from '../api';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, Tag, Barcode, Calendar, Settings } from 'lucide-react';
import { LotsTable } from './LotsTable';

interface ProductDetailsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductDetails({ product, onEdit, onDelete }: ProductDetailsProps) {
  const { data: lots = [], isLoading: lotsLoading } = useQuery({
    queryKey: ['lots', product.id],
    queryFn: () => getLots(product.id),
  });

  const totalStock = lots.reduce((sum, lot) => sum + lot.quantity, 0);
  const availableStock = lots.reduce((sum, lot) => sum + lot.availableQuantity, 0);
  const reservedStock = lots.reduce((sum, lot) => sum + lot.reservedQuantity, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <p className="text-gray-600 mt-1">{product.sku}</p>
              {product.description && (
                <p className="text-gray-700 mt-2">{product.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Badge variant={product.isActive ? 'default' : 'secondary'}>
                {product.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Tag className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Category</p>
                  <p className="text-gray-600">{product.categoryName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Unit of Measure</p>
                  <p className="text-gray-600">{product.unitOfMeasureName} ({product.unitOfMeasureCode})</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Barcode className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Barcode</p>
                  <p className="text-gray-600 font-mono">
                    {product.barcode || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-gray-600">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium">Stock Levels</p>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Min: {product.minimumStockLevel.toLocaleString()}</span>
                    <span>Max: {product.maximumStockLevel.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium">Current Stock</p>
                <div className="space-y-2 mt-2">
                  <div className="text-2xl font-bold">
                    {availableStock.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Reserved: {reservedStock.toLocaleString()}<br />
                    Total: {totalStock.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.keys(product.attributes).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Product Attributes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                  <Badge variant="outline">{String(value)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lots ({lots.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {lotsLoading ? (
            <div className="text-center py-8">Loading lots...</div>
          ) : (
            <LotsTable
              lots={lots}
              onEdit={() => {}} // TODO: Implement lot editing
              onDelete={() => {}} // TODO: Implement lot deletion
              onView={() => {}} // TODO: Implement lot viewing
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
