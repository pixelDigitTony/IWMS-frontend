import React from 'react';
import { PickingList } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, CheckCircle, Clock, User, MapPin } from 'lucide-react';

interface PickingListsTableProps {
  pickingLists: PickingList[];
  onEdit: (list: PickingList) => void;
  onDelete: (list: PickingList) => void;
  onView: (list: PickingList) => void;
  onComplete?: (list: PickingList) => void;
}

export function PickingListsTable({
  pickingLists,
  onEdit,
  onDelete,
  onView,
  onComplete
}: PickingListsTableProps) {
  const getStatusColor = (status: PickingList['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'ACTIVE': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: PickingList['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'ACTIVE':
        return <Clock className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const canComplete = (list: PickingList) => list.status === 'ACTIVE';

  const getCompletedItems = (list: PickingList) => {
    return list.items.filter(item => item.pickedQuantity >= item.requestedQuantity).length;
  };

  const getProgressPercentage = (list: PickingList) => {
    const totalItems = list.items.length;
    const completedItems = getCompletedItems(list);
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Picking Lists</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pickingLists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No picking lists found. Create picking lists from outbound orders to get started.
            </div>
          ) : (
            pickingLists.map((list) => (
              <div
                key={list.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{list.pickingListNumber}</h3>
                    <p className="text-sm text-gray-600">
                      Order: {list.outboundOrderNumber} • Warehouse: {list.warehouseName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(list.status)}>
                      {getStatusIcon(list.status)}
                      <span className="ml-1">{list.status}</span>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(list)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(list)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(list)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Total Items</p>
                    <p className="text-gray-600">{list.totalItems} items</p>
                  </div>

                  <div>
                    <p className="font-medium">Progress</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{getProgressPercentage(list)}%</span>
                        <span>{getCompletedItems(list)}/{list.totalItems} completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(list)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Assigned To</p>
                    <p className="text-gray-600">
                      {list.assignedToName || 'Unassigned'}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Status Timeline</p>
                    <div className="space-y-1 mt-1">
                      {list.startedAt && (
                        <p className="text-gray-600 text-xs">
                          Started: {new Date(list.startedAt).toLocaleString()}
                        </p>
                      )}
                      {list.completedAt && (
                        <p className="text-green-600 text-xs">
                          Completed: {new Date(list.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {canComplete(list) && onComplete && (
                    <Button
                      size="sm"
                      onClick={() => onComplete(list)}
                    >
                      Complete Picking
                    </Button>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(list.createdAt).toLocaleDateString()} |
                  Updated: {new Date(list.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
