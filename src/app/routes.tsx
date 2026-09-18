import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { Layout } from '@/components/layout/Layout';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { Role } from '@/types/auth';

// Lazy load existing pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ProfilePage = lazy(() => import('@/features/auth/pages/ProfilePage'));
const PreferencesPage = lazy(() => import('@/features/auth/pages/PreferencesPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const VisitsPage = lazy(() => import('@/features/visits/pages/VisitsPage'));
const CasesPage = lazy(() => import('@/features/cases/pages/CasesPage'));
const CaseDetailPage = lazy(() => import('@/features/cases/pages/CaseDetailPage'));
const NewCaseWizard = lazy(() => import('@/features/cases/pages/NewCaseWizard'));
const PatientsPage = lazy(() => import('@/features/patients/pages/PatientsPage'));
const DentistsPage = lazy(() => import('@/features/dentists/pages/DentistsPage'));
const ClinicsPage = lazy(() => import('@/features/clinics/pages/ClinicsPage'));

// New modules
const ProductionPage = lazy(() => import('@/features/production/pages/ProductionPage'));
const QCPage = lazy(() => import('@/features/quality-control/pages/QCPage'));
const InventoryPage = lazy(() => import('@/features/inventory/pages/InventoryPage'));
const InvoicesPage = lazy(() => import('@/features/finance/pages/InvoicesPage'));
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'));
const PaymentsPage = lazy(() => import('@/features/payments/pages/PaymentsPage'));
const ExpensesPage = lazy(() => import('@/features/expenses/pages/ExpensesPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const UsersPage = lazy(() => import('@/features/admin/pages/UsersPage'));

const NotFoundPage = lazy(() => import('@/app/pages/NotFoundPage'));

// Placeholder pages for modules not yet built
// const PlaceholderPage = lazy(() => import('@/app/pages/PlaceholderPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            {/* Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Account */}
            <Route path="/profile"     element={<ProfilePage />} />
            <Route path="/preferences" element={<PreferencesPage />} />

            {/* Directory */}
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/dentists" element={<DentistsPage />} />
            <Route path="/clinics" element={<ClinicsPage />} />

            {/* Visits */}
            <Route
              path="/visits"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST]}>
                  <VisitsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/visits/new"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST]}>
                  <VisitsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/cases"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.TECHNICIAN, Role.QC]}>
                  <CasesPage />
                </RequireAuth>
              }
            />
            <Route
              path="/cases/new"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST]}>
                  <NewCaseWizard />
                </RequireAuth>
              }
            />
            <Route
              path="/cases/:caseId"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.TECHNICIAN, Role.QC]}>
                  <CaseDetailPage />
                </RequireAuth>
              }
            />
            <Route
              path="/production"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.TECHNICIAN]}>
                  <ProductionPage />
                </RequireAuth>
              }
            />
            <Route
              path="/qc"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.QC]}>
                  <QCPage />
                </RequireAuth>
              }
            />
            <Route
              path="/quality-control"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.QC]}>
                  <QCPage />
                </RequireAuth>
              }
            />
            <Route
              path="/inventory"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.STOREKEEPER]}>
                  <InventoryPage />
                </RequireAuth>
              }
            />
            <Route
              path="/invoices"
              element={
                <RequireAuth
                  allowedRoles={[Role.ADMIN, Role.MANAGER, Role.RECEPTIONIST, Role.ACCOUNTANT]}
                >
                  <InvoicesPage />
                </RequireAuth>
              }
            />
            <Route
              path="/payments"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT]}>
                  <PaymentsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/expenses"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT]}>
                  <ExpensesPage />
                </RequireAuth>
              }
            />
            <Route
              path="/reports"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN, Role.MANAGER, Role.ACCOUNTANT]}>
                  <ReportsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN]}>
                  <UsersPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <RequireAuth allowedRoles={[Role.ADMIN]}>
                  <SettingsPage />
                </RequireAuth>
              }
            />
          </Route>
        </Route>

        {/* Fallback routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
