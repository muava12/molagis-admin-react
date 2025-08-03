import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './pages/app-layout';
import { DashboardPage } from './pages/dashboard-page';
import { CustomersPage } from './pages/customers-page';
import { OrdersPage } from './pages/orders-page';
import { FinancePage } from './pages/finance-page';
import { ReportsPage } from './pages/reports-page';
import DemoLoadingPage from './pages/demo-loading';
import { SettingsPage } from './pages/settings-page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
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