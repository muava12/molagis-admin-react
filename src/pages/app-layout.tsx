import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChartSquare02,
  File05,
  PieChart03,
  Rows01,
  Users01,
  Settings01,
  LifeBuoy01
} from "@untitledui/icons";
import { SlimLayout } from "@/components/application/app-navigation/sidebar-slim-layout";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { BadgeWithDot } from "@/components/base/badges/badges";

// Navigation items berdasarkan aplikasi yang ada
const appNavItems: (NavItemType & { icon: React.FC<{ className?: string }> })[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: BarChartSquare02,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users01,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: Rows01,
  },
  {
    label: "Finance",
    href: "/finance",
    icon: PieChart03,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: File05,
  },
  {
    label: "Loading Demo",
    href: "/loading-demo",
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

const appFooterItems: (NavItemType & { icon: React.FC<{ className?: string }> })[] = [
  {
    label: "Support",
    href: "/support",
    icon: LifeBuoy01,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings01,
    badge: <BadgeWithDot color="success" type="modern" size="sm">Online</BadgeWithDot>,
  },
];

export const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleItemClick = (item: NavItemType) => {
    if (item.href) {
      navigate(item.href);
    }
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const activeItem = [...appNavItems, ...appFooterItems].find(
      item => item.href === location.pathname
    );
    return activeItem?.label || "Dashboard";
  };

  return (
    <SlimLayout
      navItems={appNavItems}
      footerItems={appFooterItems}
      activeUrl={location.pathname}
      onNavItemClick={handleItemClick}
      headerContent={
        <div className="flex items-center gap-2">
          <span className="text-sm text-fg-tertiary">Current:</span>
          <span className="text-sm font-medium text-fg-primary">{getCurrentPageTitle()}</span>
        </div>
      }
    >
      <Outlet />
    </SlimLayout>
  );
};