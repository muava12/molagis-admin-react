import { BarChartSquare02, File05, PieChart03, Rows01, Users01, Settings01 } from "@untitledui/icons";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { SidebarNavigationSectionsSubheadings } from "@/components/application/app-navigation/sidebar-navigation/sidebar-sections-subheadings";
import { useLocation } from "react-router";

const navItems: Array<{ label: string; items: NavItemType[] }> = [
    {
        label: "General",
        items: [
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
        ],
    },
];

const footerNavItems: NavItemType[] = [
    {
        label: "Settings",
        href: "/settings",
        icon: Settings01,
    },
];

interface SidebarProps {
    collapsed?: boolean;
}

export const Sidebar = ({ collapsed = false }: SidebarProps) => {
    const location = useLocation();
    return (
        <SidebarNavigationSectionsSubheadings 
            activeUrl={location.pathname} 
            items={navItems} 
            footerItems={footerNavItems}
            collapsed={collapsed}
        />
    );
};