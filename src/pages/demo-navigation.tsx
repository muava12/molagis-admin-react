import { useState } from "react";
import { 
  SimpleLayout, 
  useSimpleLayout, 
  type NavItem 
} from "@/components/application/app-navigation";
import { 
  BarChart03, 
  Building08, 
  Calendar, 
  File01, 
  Home01, 
  LifeBuoy01, 
  PieChart01, 
  Settings01, 
  Users01 
} from "@untitledui/icons";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";

// Custom navigation items for demo
const demoNavItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: Home01,
    active: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: BarChart03,
    badge: "New",
    children: [
      {
        id: "overview",
        label: "Overview",
        href: "/analytics/overview",
      },
      {
        id: "reports",
        label: "Reports",
        href: "/analytics/reports",
        badge: "5",
      },
      {
        id: "insights",
        label: "Insights",
        href: "/analytics/insights",
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    icon: Building08,
    badge: <BadgeWithDot color="success" type="modern" size="sm">12</BadgeWithDot>,
    children: [
      {
        id: "active-projects",
        label: "Active Projects",
        href: "/projects/active",
        badge: "8",
      },
      {
        id: "completed-projects",
        label: "Completed",
        href: "/projects/completed",
        badge: "24",
      },
      {
        id: "archived-projects",
        label: "Archived",
        href: "/projects/archived",
      },
    ],
  },
  {
    id: "tasks",
    label: "Tasks",
    href: "/tasks",
    icon: File01,
    badge: <BadgeWithDot color="warning" type="modern" size="sm">3</BadgeWithDot>,
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    id: "team",
    label: "Team",
    href: "/team",
    icon: Users01,
    children: [
      {
        id: "members",
        label: "Members",
        href: "/team/members",
        badge: "12",
      },
      {
        id: "roles",
        label: "Roles & Permissions",
        href: "/team/roles",
      },
      {
        id: "invitations",
        label: "Invitations",
        href: "/team/invitations",
        badge: <BadgeWithDot color="error" type="modern" size="sm">2</BadgeWithDot>,
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    href: "/reports",
    icon: PieChart01,
  },
];

const demoFooterItems: NavItem[] = [
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

export const DemoNavigationPage = () => {
  const { activeItemId, handleNavItemClick } = useSimpleLayout("home");
  const [currentPage, setCurrentPage] = useState("Home");

  const handleItemClick = (item: NavItem) => {
    setCurrentPage(item.label);
    handleNavItemClick(item);
  };

  return (
    <SimpleLayout
      navItems={demoNavItems}
      footerItems={demoFooterItems}
      activeItemId={activeItemId}
      onNavItemClick={handleItemClick}
      headerContent={
        <div className="flex items-center gap-2">
          <span className="text-sm text-fg-tertiary">Current:</span>
          <span className="text-sm font-medium text-fg-primary">{currentPage}</span>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-fg-primary">{currentPage}</h1>
            <p className="mt-2 text-fg-secondary">
              Demo page untuk testing simple navigation components
            </p>
          </div>
          <Button color="primary" size="lg">
            Action Button
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="rounded-xl border border-secondary bg-primary p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-fg-primary">
                  Card {i + 1}
                </h3>
                <div className="h-2 w-2 rounded-full bg-success-500"></div>
              </div>
              <p className="text-fg-secondary mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-tertiary">Status: Active</span>
                <Button color="secondary" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Projects", value: "24", change: "+12%" },
            { label: "Active Tasks", value: "156", change: "+8%" },
            { label: "Team Members", value: "12", change: "+2%" },
            { label: "Completed", value: "89%", change: "+5%" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-lg border border-secondary bg-primary p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-fg-tertiary">{stat.label}</p>
                <span className="text-xs text-success-600 font-medium">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-fg-primary mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="rounded-xl border border-secondary bg-primary overflow-hidden">
          <div className="px-6 py-4 border-b border-secondary">
            <h3 className="text-lg font-semibold text-fg-primary">
              Recent Activity
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="hover:bg-primary_hover">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-fg-primary">
                        Item {i + 1}
                      </div>
                      <div className="text-sm text-fg-tertiary">
                        Description here
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BadgeWithDot
                        color={i % 2 === 0 ? "success" : "warning"}
                        type="modern"
                        size="sm"
                      >
                        {i % 2 === 0 ? "Active" : "Pending"}
                      </BadgeWithDot>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fg-secondary">
                      Jan {i + 1}, 2024
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button color="secondary" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default DemoNavigationPage;