import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import Masters from './pages/Masters';
import ContractorLedger from './pages/ContractorLedger';
import WorkOrders from './pages/WorkOrders';
import VariationOrders from './pages/VariationOrders';
import BudgetDashboard from './pages/BudgetDashboard';
import Bills from './pages/Bills';
import Payments from './pages/Payments';
import PaymentRequests from './pages/PaymentRequests';
import VersionHistory from './pages/VersionHistory';
import AdminUsers from './pages/AdminUsers';
import Sales from './pages/Sales';
import SaleDetail from './pages/SaleDetail';
import CustomerLedger from './pages/CustomerLedger';
import RecoveryDashboard from './pages/RecoveryDashboard';
import Login from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/masters" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'CEO', 'PURCHASE_MANAGER', 'STORE_MANAGER']}>
              <Layout>
                <ErrorBoundary>
                  <Masters />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/contractors/:id/ledger" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'ACCOUNTS', 'CEO', 'PROJECT_MANAGER']}>
              <Layout>
                <ErrorBoundary>
                  <ContractorLedger />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/work-orders" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'CEO', 'ACCOUNTS']}>
              <Layout>
                <ErrorBoundary>
                  <WorkOrders />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/variation-orders" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'CEO', 'ACCOUNTS']}>
              <Layout>
                <ErrorBoundary>
                  <VariationOrders />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/budget-analytics" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CEO', 'PROJECT_MANAGER', 'ACCOUNTS']}>
              <Layout>
                <ErrorBoundary>
                  <BudgetDashboard />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/bills" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'ACCOUNTS', 'CEO']}>
              <Layout>
                <ErrorBoundary>
                  <Bills />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/payments" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'ACCOUNTS', 'CEO']}>
              <Layout>
                <ErrorBoundary>
                  <Payments />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/payment-requests" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'ACCOUNTS', 'CEO']}>
              <Layout>
                <ErrorBoundary>
                  <PaymentRequests />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/version-history" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <ErrorBoundary>
                  <VersionHistory />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <ErrorBoundary>
                  <AdminUsers />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/sales" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'ACCOUNTS', 'CEO']}>
              <Layout>
                <ErrorBoundary>
                  <Sales />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/sales/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'ACCOUNTS', 'CEO']}>
              <Layout>
                <ErrorBoundary>
                  <SaleDetail />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/customers/:id/ledger" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'ACCOUNTS', 'CEO']}>
              <Layout>
                <ErrorBoundary>
                  <CustomerLedger />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/recovery" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'ACCOUNTS', 'CEO']}>
              <Layout>
                <ErrorBoundary>
                  <RecoveryDashboard />
                </ErrorBoundary>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}
