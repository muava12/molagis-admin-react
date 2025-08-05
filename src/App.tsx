import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { ThemeProvider } from './providers/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/development" element={<DevelopmentPage />} />
          
          {/* Protected app routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;