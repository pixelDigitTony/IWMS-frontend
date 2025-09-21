import React from 'react';
import { Shipment } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Truck, Package, MapPin, Calendar } from 'lucide-react';

interface ShipmentsTableProps {
  shipments: Shipment[];
  onEdit: (shipment: Shipment) => void;
  onDelete: (shipment: Shipment) => void;
  onView: (shipment: Shipment) => void;
  onShip?: (shipment: Shipment) => void;
  onDeliver?: (shipment: Shipment) => void;
}

export function ShipmentsTable({
  shipments,
  onEdit,
  onDelete,
  onView,
  onShip,
  onDeliver
}: ShipmentsTableProps) {
  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PLANNED': return 'bg-blue-100 text-blue-800';
      case 'PICKED': return 'bg-indigo-100 text-indigo-800';
      case 'PACKED': return 'bg-purple-100 text-purple-800';
      case 'SHIPPED': return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT': return 'bg-cyan-100 text-cyan-800';
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Shipment['status']) => {
    switch (status) {
      case 'SHIPPED':
      case 'IN_TRANSIT':
      case 'DELIVERED':
        return <Truck className="h-4 w-4" />;
      case 'PACKED':
        return <Package className="h-4 w-4" />;
      case 'PLANNED':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const canShip = (shipment: Shipment) => ['PLANNED', 'PACKED'].includes(shipment.status);
  const canDeliver = (shipment: Shipment) => shipment.status === 'IN_TRANSIT';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shipments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No shipments found. Create shipments from outbound orders to get started.
            </div>
          ) : (
            shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{shipment.shipmentNumber}</h3>
                    <p className="text-sm text-gray-600">Order: {shipment.outboundOrderNumber}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(shipment.status)}>
                      {getStatusIcon(shipment.status)}
                      <span className="ml-1">{shipment.status}</span>
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(shipment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(shipment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(shipment)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Planned Ship Date</p>
                    <p className="text-gray-600">
                      {new Date(shipment.plannedShipDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Carrier & Tracking</p>
                    <p className="text-gray-600">
                      {shipment.carrier}<br />
                      {shipment.trackingNumber && (
                        <span className="font-mono text-xs">{shipment.trackingNumber}</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Packages & Weight</p>
                    <p className="text-gray-600">
                      {shipment.totalPackages} packages<br />
                      {shipment.totalWeight} kg
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Shipping Cost</p>
                    <p className="text-gray-600">
                      ${shipment.shippingCost.toLocaleString()}
                    </p>
                  </div>
                </div>

                {shipment.actualShipDate && (
                  <div className="mt-3">
                    <p className="font-medium text-sm">Actual Ship Date</p>
                    <p className="text-gray-600">
                      {new Date(shipment.actualShipDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {shipment.actualDeliveryDate && (
                  <div className="mt-3">
                    <p className="font-medium text-sm">Actual Delivery Date</p>
                    <p className="text-gray-600">
                      {new Date(shipment.actualDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {canShip(shipment) && onShip && (
                    <Button
                      size="sm"
                      onClick={() => onShip(shipment)}
                    >
                      Ship
                    </Button>
                  )}
                  {canDeliver(shipment) && onDeliver && (
                    <Button
                      size="sm"
                      onClick={() => onDeliver(shipment)}
                    >
                      Mark Delivered
                    </Button>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(shipment.createdAt).toLocaleDateString()} |
                  Updated: {new Date(shipment.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
