import React from 'react';
import { Product } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Package } from 'lucide-react';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

export function ProductsTable({ products, onEdit, onDelete, onView }: ProductsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found. Create your first product to get started.
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.sku}</p>
                    {product.description && (
                      <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(product)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-gray-600">{product.categoryName}</p>
                  </div>

                  <div>
                    <p className="font-medium">Unit of Measure</p>
                    <p className="text-gray-600">{product.unitOfMeasureName} ({product.unitOfMeasureCode})</p>
                  </div>

                  <div>
                    <p className="font-medium">Stock Levels</p>
                    <p className="text-gray-600">
                      Min: {product.minimumStockLevel.toLocaleString()}<br />
                      Max: {product.maximumStockLevel.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Barcode</p>
                    <p className="text-gray-600 font-mono">
                      {product.barcode || 'N/A'}
                    </p>
                  </div>
                </div>

                {Object.keys(product.attributes).length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-sm mb-2">Attributes</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(product.attributes).map(([key, value]) => (
                        <Badge key={key} variant="outline">
                          {key}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
