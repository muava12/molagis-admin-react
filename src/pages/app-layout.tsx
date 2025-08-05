import { Outlet } from "react-router-dom";
import {
  BarChartSquare02,
  File05,
  PieChart03,
  Rows01,
  Users01,
  Settings01,
  Code01
} from "@untitledui/icons";
import { SlimLayout } from "@/components/application/app-navigation/sidebar-slim-layout";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { useUser } from "@/hooks/use-user";

const allNavItems: (NavItemType & { icon: React.FC<{ className?: string }>; roles: string[] })[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: BarChartSquare02,
    roles: ["owner", "manager", "cs"],
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users01,
    roles: ["owner", "manager", "cs"],
  },
  {
    label: "Orders",
    href: "/orders",
    icon: Rows01,
    roles: ["owner", "manager", "cs"],
  },
  {
    label: "Finance",
    href: "/finance",
    icon: PieChart03,
    roles: ["owner", "manager"],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: File05,
    roles: ["owner", "manager"],
  },
  {
    label: "Development",
    href: "/development",
    icon: Code01,
    roles: ["owner"],
  },
];

const allFooterItems: (NavItemType & { icon: React.FC<{ className?: string }>; roles: string[] })[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings01,
    badge: <BadgeWithDot color="success" type="modern" size="sm">Online</BadgeWithDot>,
    roles: ["owner", "manager"],
  },
];

export const AppLayout = () => {
  const { profile } = useUser();

  const appNavItems = allNavItems.filter(item => item.roles.includes(profile?.role || ''));
  const appFooterItems = allFooterItems.filter(item => item.roles.includes(profile?.role || ''));

  return (
    <SlimLayout
      navItems={appNavItems}
      footerItems={appFooterItems}
    >
      <Outlet />
    </SlimLayout>
  );
};