import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BarChartSquare02, File05, PieChart03, Rows01, Users01, Settings01, LifeBuoy01 } from "@untitledui/icons";
import { SimpleLayout, useSimpleLayout, type NavItem } from "@/components/application/app-navigation";
import { BadgeWithDot } from "@/components/base/badges/badges";

// Navigation items berdasarkan aplikasi yang ada
const appNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "",
    icon: BarChartSquare02,
  },
  {
    id: "customers",
    label: "Customers",
    href: "/customers",
    icon: Users01,
  },
  {
    id: "orders",
    label: "Orders",
    href: "/orders",
    icon: Rows01,
  },
  {
    id: "finance",
    label: "Finance",
    href: "/finance",
    icon: PieChart03,
  },
  {
    id: "reports",
    label: "Reports",
    href: "/reports",
    icon: File05,
  },
  {
    id: "loading-demo",
    label: "Loading Demo",
    href: "/loading-demo",
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

const appFooterItems: NavItem[] = [
  {
    id: "support",
    label: "Support",
    href: "/support",
    icon: LifeBuoy01,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings01,
    badge: <BadgeWithDot color="success" type="modern" size="sm">Online</BadgeWithDot>,
  },
];

export const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active item based on current route
  const getActiveItemId = (pathname: string) => {
    if (pathname === "/dashboard" || pathname === "/") return "dashboard";
    if (pathname.startsWith("/customers")) return "customers";
    if (pathname.startsWith("/orders")) return "orders";
    if (pathname.startsWith("/finance")) return "finance";
    if (pathname.startsWith("/reports")) return "reports";
    if (pathname.startsWith("/settings")) return "settings";
    if (pathname.startsWith("/support")) return "support";
    return "dashboard"; // default
  };

  const { handleNavItemClick } = useSimpleLayout(getActiveItemId(location.pathname));

  const handleItemClick = (item: NavItem) => {
    handleNavItemClick(item);
    if (item.href) {
      navigate(item.href);
    }
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const activeId = getActiveItemId(location.pathname);
    const activeItem = [...appNavItems, ...appFooterItems].find(item => item.id === activeId);
    return activeItem?.label || "Dashboard";
  };

  return (
    <SimpleLayout
      navItems={appNavItems}
      footerItems={appFooterItems}
      activeItemId={getActiveItemId(location.pathname)}
      onNavItemClick={handleItemClick}
      headerContent={
        <div className="flex items-center gap-2">
          <span className="text-sm text-fg-tertiary">Current:</span>
          <span className="text-sm font-medium text-fg-primary">{getCurrentPageTitle()}</span>
        </div>
      }
    >
      <Outlet />
    </SimpleLayout>
  );
};