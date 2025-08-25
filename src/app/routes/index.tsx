import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage, WarehousesPage, ProductsPage, InventoryPage, TransfersPage, ReceivingPage, ShippingPage, UsersPage, ReportsPage } from '@/pages';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { PublicRoute } from '@/features/auth/components/PublicRoute';
import { AuthLoginPage } from '@/pages/AuthLoginPage';
import { AuthRegisterPage } from '@/pages/AuthRegisterPage';
import { AuthGatePage } from '@/pages/AuthGatePage';
import { AppLayout } from '@/app/layout/AppLayout';
import { AdminApprovalsPage } from '@/pages/AdminApprovalsPage';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><AuthLoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><AuthRegisterPage /></PublicRoute>} />
      <Route path="/gate" element={<AuthGatePage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/warehouses" element={<RequireAuth><WarehousesPage /></RequireAuth>} />
        <Route path="/products" element={<RequireAuth><ProductsPage /></RequireAuth>} />
        <Route path="/inventory" element={<RequireAuth><InventoryPage /></RequireAuth>} />
        <Route path="/transfers" element={<RequireAuth><TransfersPage /></RequireAuth>} />
        <Route path="/receiving" element={<RequireAuth><ReceivingPage /></RequireAuth>} />
        <Route path="/shipping" element={<RequireAuth><ShippingPage /></RequireAuth>} />
        <Route path="/users" element={<RequireAuth requiredPermission="users.manage"><UsersPage /></RequireAuth>} />
        <Route path="/admin/approvals" element={<RequireAuth><AdminApprovalsPage /></RequireAuth>} />
        <Route path="/reports" element={<RequireAuth requiredPermission="reports.view"><ReportsPage /></RequireAuth>} />
      </Route>
    </Routes>
  );
}


