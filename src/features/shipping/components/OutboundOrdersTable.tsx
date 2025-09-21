import React from 'react';
import { OutboundOrder } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Truck, Package, Calendar, MapPin } from 'lucide-react';

interface OutboundOrdersTableProps {
  orders: OutboundOrder[];
  onEdit: (order: OutboundOrder) => void;
  onDelete: (order: OutboundOrder) => void;
  onView: (order: OutboundOrder) => void;
  onCreateShipment?: (order: OutboundOrder) => void;
  onCreatePickingList?: (order: OutboundOrder) => void;
}

export function OutboundOrdersTable({
  orders,
  onEdit,
  onDelete,
  onView,
  onCreateShipment,
  onCreatePickingList
}: OutboundOrdersTableProps) {
  const getStatusColor = (status: OutboundOrder['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING_PICK': return 'bg-yellow-100 text-yellow-800';
      case 'PICKING': return 'bg-blue-100 text-blue-800';
      case 'PICKED': return 'bg-indigo-100 text-indigo-800';
      case 'PACKING': return 'bg-purple-100 text-purple-800';
      case 'PACKED': return 'bg-pink-100 text-pink-800';
      case 'READY_TO_SHIP': return 'bg-orange-100 text-orange-800';
      case 'SHIPPED': return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT': return 'bg-cyan-100 text-cyan-800';
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: OutboundOrder['priority']) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OutboundOrder['status']) => {
    switch (status) {
      case 'SHIPPED':
      case 'DELIVERED':
        return <Truck className="h-4 w-4" />;
      case 'PACKED':
      case 'PACKING':
        return <Package className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const canCreateShipment = (order: OutboundOrder) => ['PICKED', 'PACKED', 'READY_TO_SHIP'].includes(order.status);
  const canCreatePickingList = (order: OutboundOrder) => ['PENDING_PICK', 'PICKING'].includes(order.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outbound Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No outbound orders found. Create your first order to get started.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status.replace('_', ' ')}</span>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(order)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Order Date</p>
                    <p className="text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Requested Ship Date</p>
                    <p className="text-gray-600">
                      {new Date(order.requestedShipDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Items & Quantity</p>
                    <p className="text-gray-600">
                      {order.totalItems} items<br />
                      {order.totalQuantity.toLocaleString()} total
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Weight & Volume</p>
                    <p className="text-gray-600">
                      {order.totalWeight} kg<br />
                      {order.totalVolume} m³
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {order.shippingAddress.company} • {order.shippingAddress.city}, {order.shippingAddress.state}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {canCreatePickingList(order) && onCreatePickingList && (
                    <Button
                      size="sm"
                      onClick={() => onCreatePickingList(order)}
                    >
                      Create Picking List
                    </Button>
                  )}
                  {canCreateShipment(order) && onCreateShipment && (
                    <Button
                      size="sm"
                      onClick={() => onCreateShipment(order)}
                    >
                      Create Shipment
                    </Button>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(order.createdAt).toLocaleDateString()} |
                  Updated: {new Date(order.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
