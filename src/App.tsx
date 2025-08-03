import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './pages/app-layout';
import { DashboardPage } from './pages/dashboard-page';
import { CustomersPage } from './pages/customers-page';
import { OrdersPage } from './pages/orders-page';
import { FinancePage } from './pages/finance-page';
import { ReportsPage } from './pages/reports-page';
import DemoLoadingPage from './pages/demo-loading';

// Settings page placeholder
const SettingsPage = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-fg-primary">Settings</h1>
        <p className="mt-2 text-fg-secondary">
          Manage your application settings and preferences
        </p>
      </div>
    </div>
    <div className="rounded-xl border border-secondary bg-primary p-6">
      <p className="text-fg-secondary">Settings page content coming soon...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="loading-demo" element={<DemoLoadingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;