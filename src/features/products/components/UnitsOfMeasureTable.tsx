import React from 'react';
import { UnitOfMeasure } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Scale } from 'lucide-react';

interface UnitsOfMeasureTableProps {
  unitsOfMeasure: UnitOfMeasure[];
  onEdit: (unit: UnitOfMeasure) => void;
  onDelete: (unit: UnitOfMeasure) => void;
  onView: (unit: UnitOfMeasure) => void;
}

export function UnitsOfMeasureTable({ unitsOfMeasure, onEdit, onDelete, onView }: UnitsOfMeasureTableProps) {
  const getTypeColor = (type: UnitOfMeasure['type']) => {
    switch (type) {
      case 'COUNT': return 'bg-blue-100 text-blue-800';
      case 'WEIGHT': return 'bg-green-100 text-green-800';
      case 'VOLUME': return 'bg-purple-100 text-purple-800';
      case 'LENGTH': return 'bg-orange-100 text-orange-800';
      case 'AREA': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Units of Measure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {unitsOfMeasure.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No units of measure found. Create your first unit to get started.
            </div>
          ) : (
            unitsOfMeasure.map((unit) => (
              <div
                key={unit.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{unit.name}</h3>
                    <p className="text-sm text-gray-600">{unit.code}</p>
                    {unit.description && (
                      <p className="text-sm text-gray-500 mt-1">{unit.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(unit.type)}>
                      {unit.type}
                    </Badge>
                    <Badge variant={unit.isActive ? 'default' : 'secondary'}>
                      {unit.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(unit)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(unit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(unit)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Type</p>
                    <p className="text-gray-600">{unit.type}</p>
                  </div>

                  <div>
                    <p className="font-medium">Base Unit</p>
                    <p className="text-gray-600">{unit.baseUnit}</p>
                  </div>

                  <div>
                    <p className="font-medium">Conversion Factor</p>
                    <p className="text-gray-600">
                      {unit.conversionFactor.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Scale className="h-4 w-4" />
                    <span>
                      1 {unit.name} = {unit.conversionFactor} {unit.baseUnit}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(unit.createdAt).toLocaleDateString()} |
                  Updated: {new Date(unit.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
