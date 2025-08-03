import type { FC } from "react";
import {
    Archive,
    BarChartSquare02,
    CheckDone01,
    ClockFastForward,
    CurrencyDollarCircle,
    Grid03,
    HomeLine,
    Inbox01,
    LifeBuoy01,
    LineChartUp03,
    NotificationBox,
    Package,
    PieChart03,
    Rows01,
    Settings01,
    Settings03,
    Star01,
    Stars01,
    User01,
    UserSquare,
    Users01,
    UsersPlus,
} from "@untitledui/icons";
import type { NavItemType } from "./config";
import { SidebarNavigationSlim } from "./sidebar-navigation/sidebar-slim";

const navItemsDualTier: (NavItemType & { icon: FC<{ className?: string }> })[] = [
    {
        label: "Home",
        href: "/",
        icon: HomeLine,
        items: [
            { label: "Overview", href: "/overview", icon: Grid03 },
            { label: "Products", href: "/products", icon: Package },
            { label: "Orders", href: "/orders", icon: CurrencyDollarCircle },
            { label: "Customers", href: "/customers", icon: Users01 },
            { label: "Inbox", href: "/inbox", icon: Inbox01, badge: 4 },
            { label: "What's new?", href: "/whats-new", icon: Stars01 },
        ],
    },
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: BarChartSquare02,
        items: [
            { label: "Overview", href: "/dashboard/overview", icon: Grid03 },
            { label: "Notifications", href: "/dashboard/notifications", icon: NotificationBox, badge: 10 },
            { label: "Analytics", href: "/dashboard/analytics", icon: LineChartUp03 },
            { label: "Saved reports", href: "/dashboard/saved-reports", icon: Star01 },
            { label: "Scheduled reports", href: "/dashboard/scheduled-reports", icon: ClockFastForward },
            { label: "User reports", href: "/dashboard/user-reports", icon: UserSquare },
            { label: "Manage notifications", href: "/dashboard/manage-notifications", icon: Settings03 },
        ],
    },
    {
        label: "Projects",
        href: "/projects",
        icon: Rows01,
        items: [
            { label: "View all", href: "/projects/all", icon: Rows01 },
            { label: "Personal", href: "/projects/personal", icon: User01 },
            { label: "Team", href: "/projects/team", icon: Users01 },
            { label: "Shared with me", href: "/projects/shared-with-me", icon: UsersPlus },
            { label: "Archive", href: "/projects/archive", icon: Archive },
        ],
    },
    {
        label: "Tasks",
        href: "/tasks",
        icon: CheckDone01,
        badge: 10,
    },
    {
        label: "Reporting",
        href: "/reporting",
        icon: PieChart03,
    },
    {
        label: "Users",
        href: "/users",
        icon: Users01,
    },
];

export const SidebarNavigationSlimDemo = () => (
    <SidebarNavigationSlim
        items={navItemsDualTier}
        footerItems={[
            {
                label: "Support",
                href: "/support",
                icon: LifeBuoy01,
            },
            {
                label: "Settings",
                href: "/settings",
                icon: Settings01,
            },
        ]}
    />
);