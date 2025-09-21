import React from 'react';
import { AdvanceShippingNotice } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Truck, Package, Calendar } from 'lucide-react';

interface ASNsTableProps {
  asns: AdvanceShippingNotice[];
  onView: (asn: AdvanceShippingNotice) => void;
}

export function ASNsTable({ asns, onView }: ASNsTableProps) {
  const getStatusColor = (status: AdvanceShippingNotice['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'RECEIVED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advance Shipping Notices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {asns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No advance shipping notices found. ASNs will appear here when suppliers send them.
            </div>
          ) : (
            asns.map((asn) => (
              <div
                key={asn.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{asn.asnNumber}</h3>
                    <p className="text-sm text-gray-600">{asn.supplierName}</p>
                    <p className="text-sm text-gray-500">PO: {asn.poNumber}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(asn.status)}>
                      {asn.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(asn)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Expected Delivery</p>
                    <p className="text-gray-600">
                      {new Date(asn.expectedDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Carrier & Tracking</p>
                    <p className="text-gray-600">
                      {asn.carrier}<br />
                      {asn.trackingNumber && (
                        <span className="font-mono text-xs">{asn.trackingNumber}</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Packages & Weight</p>
                    <p className="text-gray-600">
                      {asn.totalPackages} packages<br />
                      {asn.totalWeight} kg
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Volume</p>
                    <p className="text-gray-600">
                      {asn.totalVolume} m³
                    </p>
                  </div>
                </div>

                {asn.actualDeliveryDate && (
                  <div className="mt-3">
                    <p className="font-medium text-sm">Actual Delivery</p>
                    <p className="text-gray-600">
                      {new Date(asn.actualDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(asn.createdAt).toLocaleDateString()} |
                  Updated: {new Date(asn.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
