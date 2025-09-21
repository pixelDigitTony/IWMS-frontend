import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  Warehouse,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ArrowRight,
  FileText,
  Truck,
  RefreshCw,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock dashboard data aligned with implemented features
const dashboardData = {
  summary: {
    totalProducts: 1247,
    totalValue: 245000,
    totalWarehouses: 3,
    totalLocations: 45,
    lowStockItems: 12,
    expiringItems: 8,
    recentTransactions: 156
  },
  recentActivity: [
    {
      id: 1,
      type: 'INBOUND',
      description: 'PO-2024-001 received',
      location: 'Main Warehouse',
      time: '2 hours ago',
      value: 2500
    },
    {
      id: 2,
      type: 'OUTBOUND',
      description: 'SO-2024-001 shipped',
      location: 'Distribution Center',
      time: '4 hours ago',
      value: -1200
    },
    {
      id: 3,
      type: 'TRANSFER',
      description: 'Transfer completed to Secondary Warehouse',
      location: 'Main Warehouse',
      time: '6 hours ago',
      value: 0
    }
  ],
  topCategories: [
    { name: 'Electronics', count: 450, value: 125000 },
    { name: 'Pharmaceuticals', count: 320, value: 89000 },
    { name: 'Industrial', count: 280, value: 31000 },
    { name: 'Consumer Goods', count: 197, value: 15000 }
  ],
  alerts: {
    lowStock: 12,
    expiring: 8,
    outOfStock: 3,
    pendingOrders: 5
  }
};

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Inter-Warehouse Management System - Real-time inventory overview
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/attachments">
              <FileText className="h-4 w-4 mr-2" />
              Upload Documents
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.summary.totalProducts.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(dashboardData.summary.totalValue / 1000).toFixed(0)}K
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
                <p className="text-2xl font-bold text-gray-900">{dashboardData.alerts.lowStock}</p>
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
                <p className="text-2xl font-bold text-gray-900">{dashboardData.alerts.expiring}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'INBOUND' ? 'bg-green-500' :
                      activity.type === 'OUTBOUND' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-600">{activity.location} • {activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${activity.value > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                      {activity.value > 0 ? '+' : ''}${Math.abs(activity.value).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" asChild className="w-full">
                <Link to="/inventory">
                  View All Activity
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Warehouse className="h-5 w-5 mr-2" />
              Inventory by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-600">{category.count} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(category.value / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-600">
                      {((category.value / dashboardData.summary.totalValue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" asChild className="w-full">
                <Link to="/products">
                  View All Categories
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="h-16 flex-col">
              <Link to="/warehouses">
                <Warehouse className="h-6 w-6 mb-2" />
                Manage Warehouses
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 flex-col">
              <Link to="/products">
                <Package className="h-6 w-6 mb-2" />
                Manage Products
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 flex-col">
              <Link to="/receiving">
                <Truck className="h-6 w-6 mb-2" />
                Process Receiving
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16 flex-col">
              <Link to="/shipping">
                <Eye className="h-6 w-6 mb-2" />
                Manage Shipping
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-lg font-bold text-red-600">{dashboardData.alerts.outOfStock}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-lg font-bold text-orange-600">{dashboardData.alerts.pendingOrders}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Transactions</p>
                <p className="text-lg font-bold text-green-600">{dashboardData.summary.recentTransactions}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Locations</p>
                <p className="text-lg font-bold text-blue-600">{dashboardData.summary.totalLocations}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Warehouse className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ label, value, loading }: { label: string; value: number | string; loading?: boolean }) {
  return (
    <div className="bg-white border rounded shadow p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-semibold">{loading ? '…' : value}</div>
    </div>
  );
}


