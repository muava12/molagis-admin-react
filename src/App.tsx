import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from './pages/app-layout';
import { DashboardPage } from './pages/dashboard-page';
import { CustomersPage } from './pages/customers-page';
import { OrdersPage } from './pages/orders-page';
import { FinancePage } from './pages/finance-page';
import { ReportsPage } from './pages/reports-page';
import { SettingsPage } from './pages/settings-page';
import { LandingPage } from './pages/landing-page';
import { DevelopmentPage } from './pages/development-page';
import { LoginPage } from './pages/login-page';
import { SupabaseProvider, useSupabase } from './providers/supabase-provider';
import { ThemeProvider } from './providers/theme-provider';

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSupabase();
  const location = useLocation();

  if (isLoading) {
    // You could render a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/development" element={<DevelopmentPage />} />
      <Route path="/demo" element={<DevelopmentPage />} />

      {/* Protected app routes using a layout route */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all route should be last */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <SupabaseProvider>
          <AppRoutes />
        </SupabaseProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;