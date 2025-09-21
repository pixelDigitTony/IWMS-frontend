import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getInventorySummary,
  getStockOnHand,
  getStockMovements,
  getAgingReport,
  exportStockOnHandReport,
  exportStockMovementsReport
} from '@/features/reports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Download,
  RefreshCw,
  DollarSign
} from 'lucide-react';

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState('summary');

  // Fetch summary data
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['inventorySummary'],
    queryFn: getInventorySummary,
  });

  // Fetch stock on hand data
  const { data: stockOnHand = [], isLoading: stockLoading } = useQuery({
    queryKey: ['stockOnHand'],
    queryFn: () => getStockOnHand(),
  });

  // Fetch stock movements data
  const { data: stockMovements = [], isLoading: movementsLoading } = useQuery({
    queryKey: ['stockMovements'],
    queryFn: () => getStockMovements(),
  });

  // Fetch aging report data
  const { data: agingReport = [], isLoading: agingLoading } = useQuery({
    queryKey: ['agingReport'],
    queryFn: () => getAgingReport(),
  });

  const handleExportStockOnHand = async () => {
    try {
      const blob = await exportStockOnHandReport('CSV');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stock-on-hand-report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleExportMovements = async () => {
    try {
      const blob = await exportStockMovementsReport('CSV');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stock-movements-report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  if (summaryLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive inventory reports and business intelligence
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summary?.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Items</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.expiringItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="inventory">Stock on Hand</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total SKUs:</span>
                    <span className="font-medium">{summary?.totalSKUs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Quantity:</span>
                    <span className="font-medium">{summary?.totalQuantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Locations:</span>
                    <span className="font-medium">{summary?.activeLocations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Warehouses:</span>
                    <span className="font-medium">{summary?.totalWarehouses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recent Transactions:</span>
                    <span className="font-medium">{summary?.recentTransactions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Out of Stock:</span>
                    <span className="font-medium text-red-600">{summary?.outOfStockItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expired Items:</span>
                    <span className="font-medium text-red-600">{summary?.expiredItems}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stock on Hand Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Stock on Hand Report</h2>
            <Button onClick={handleExportStockOnHand}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {stockOnHand.map((item) => (
                  <div key={`${item.warehouseId}-${item.locationId}-${item.productId}`} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{item.productName}</h3>
                        <p className="text-sm text-gray-600">{item.productSku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.quantity} {item.unitOfMeasure}</p>
                        <p className="text-sm text-gray-600">${item.value.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{item.warehouseName} • {item.locationName}</p>
                      <p>Available: {item.availableQuantity} • Reserved: {item.reservedQuantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Movements Tab */}
        <TabsContent value="movements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Stock Movement Report</h2>
            <Button onClick={handleExportMovements}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {stockMovements.map((movement) => (
                  <div key={movement.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{movement.productName}</h3>
                        <p className="text-sm text-gray-600">{movement.productSku}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unitOfMeasure}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(movement.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{movement.transactionType.replace('_', ' ')} • {movement.userName}</p>
                      <p>{movement.reference || 'No reference'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}