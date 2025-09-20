import React from 'react';
import { Category } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, FolderOpen } from 'lucide-react';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onView: (category: Category) => void;
}

export function CategoriesTable({ categories, onEdit, onDelete, onView }: CategoriesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No categories found. Create your first category to get started.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.code}</p>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(category)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Parent Category</p>
                    <p className="text-gray-600">
                      {category.parentCategoryName || 'None (Top-level)'}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Hierarchy</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <FolderOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {category.parentCategoryName
                          ? `${category.parentCategoryName} > ${category.name}`
                          : category.name
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(category.createdAt).toLocaleDateString()} |
                  Updated: {new Date(category.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
