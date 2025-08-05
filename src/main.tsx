import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { CustomersPage } from "@/pages/customers-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { FinancePage } from "@/pages/finance-page";
import { LandingPage } from "@/pages/landing-page";
import { LoginPage } from "@/pages/login-page";
import { NotFound } from "@/pages/not-found";
import { OrdersPage } from "@/pages/orders-page";
import { ReportsPage } from "@/pages/reports-page";
import { SettingsPage } from "@/pages/settings-page";
import DemoNavigationPage from "@/pages/demo-navigation";
import { AppLayout } from "@/pages/app-layout";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { UserProvider } from "@/hooks/use-user";
import { RoleBasedGuard } from "@/components/guards/role-based-guard";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <UserProvider>
                <BrowserRouter>
                    <RouteProvider>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/demo" element={<DemoNavigationPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<RoleBasedGuard roles={['owner', 'manager', 'cs']}><DashboardPage /></RoleBasedGuard>} />
                            <Route path="/customers" element={<RoleBasedGuard roles={['owner', 'manager', 'cs']}><CustomersPage /></RoleBasedGuard>} />
                            <Route path="/orders" element={<RoleBasedGuard roles={['owner', 'manager', 'cs']}><OrdersPage /></RoleBasedGuard>} />
                            <Route path="/finance" element={<RoleBasedGuard roles={['owner', 'manager']}><FinancePage /></RoleBasedGuard>} />
                            <Route path="/reports" element={<RoleBasedGuard roles={['owner', 'manager']}><ReportsPage /></RoleBasedGuard>} />
                            <Route path="/settings" element={<RoleBasedGuard roles={['owner', 'manager']}><SettingsPage /></RoleBasedGuard>} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    </RouteProvider>
                </BrowserRouter>
            </UserProvider>
        </ThemeProvider>
    </StrictMode>,
);
