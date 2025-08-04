import { Outlet } from "react-router-dom";
import {
  BarChartSquare02,
  File05,
  PieChart03,
  Rows01,
  Users01,
  Settings01,
  LifeBuoy01,
  Code01
} from "@untitledui/icons";
import { SlimLayout } from "@/components/application/app-navigation/sidebar-slim-layout";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { BadgeWithDot } from "@/components/base/badges/badges";

// Navigation items berdasarkan aplikasi yang ada
const appNavItems: (NavItemType & { icon: React.FC<{ className?: string }> })[] = [
  {
    label: "Dashboard",
    href: "/app/dashboard",
    icon: BarChartSquare02,
  },
  {
    label: "Customers",
    href: "/app/customers",
    icon: Users01,
  },
  {
    label: "Orders",
    href: "/app/orders",
    icon: Rows01,
  },
  {
    label: "Finance",
    href: "/app/finance",
    icon: PieChart03,
  },
  {
    label: "Reports",
    href: "/app/reports",
    icon: File05,
  },
  {
    label: "Development",
    href: "/development",
    icon: Code01,
  },
];

const appFooterItems: (NavItemType & { icon: React.FC<{ className?: string }> })[] = [
  {
    label: "Support",
    href: "/app/support",
    icon: LifeBuoy01,
  },
  {
    label: "Settings",
    href: "/app/settings",
    icon: Settings01,
    badge: <BadgeWithDot color="success" type="modern" size="sm">Online</BadgeWithDot>,
  },
];

export const AppLayout = () => {


  return (
    <SlimLayout
      navItems={appNavItems}
      footerItems={appFooterItems}
    >
      <Outlet />
    </SlimLayout>
  );
};