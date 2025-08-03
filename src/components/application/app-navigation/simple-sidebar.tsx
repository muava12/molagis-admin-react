import { useState } from "react";
import { ChevronDown, LifeBuoy01, Settings01 } from "@untitledui/icons";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { cx } from "@/utils/cx";

export interface NavItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Navigation URL */
  href?: string;
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Badge content */
  badge?: React.ReactNode;
  /** Sub-items */
  children?: NavItem[];
  /** Whether item is currently active */
  active?: boolean;
}

interface SimpleSidebarProps {
  /** Whether sidebar is collapsed */
  collapsed?: boolean;
  /** Navigation items */
  items?: NavItem[];
  /** Footer items */
  footerItems?: NavItem[];
  /** Current active item ID */
  activeItemId?: string;
  /** Callback when item is clicked */
  onItemClick?: (item: NavItem) => void;
  /** Additional CSS classes */
  className?: string;
}

export const SimpleSidebar = ({
  collapsed = false,
  items = [],
  footerItems = [],
  activeItemId,
  onItemClick,
  className,
}: SimpleSidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: NavItem, event: React.MouseEvent) => {
    if (item.children?.length) {
      event.preventDefault();
      toggleExpanded(item.id);
    }
    onItemClick?.(item);
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeItemId === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    return (
      <li key={item.id}>
        <button
          onClick={(e) => handleItemClick(item, e)}
          className={cx(
            "group flex w-full items-center rounded-lg text-sm font-medium transition-colors text-left",
            // Perfect alignment for collapsed state - icon only
            collapsed && level === 0
              ? "mx-2 px-2 py-2 justify-center"
              : level === 0
                ? "mx-2 px-3 py-2"
                : "mx-2 ml-6 px-3 py-2",
            isActive
              ? "bg-primary_alt text-primary cursor-pointer"
              : "text-fg-secondary hover:bg-primary_hover hover:text-fg-secondary_hover cursor-pointer"
          )}
          aria-current={isActive ? "page" : undefined}
          title={collapsed && level === 0 ? item.label : undefined}
        >
          {/* Icon */}
          {Icon && (
            <Icon
              className={cx(
                "h-5 w-5 shrink-0",
                // Perfect icon spacing - no margin when collapsed for perfect centering
                collapsed && level === 0 ? "" : "mr-3",
                isActive ? "text-primary" : "text-fg-quaternary"
              )}
            />
          )}

          {/* Label - hidden when collapsed (only for level 0) */}
          {!collapsed && level === 0 && (
            <>
              <span className="flex-1 truncate">{item.label}</span>

              {/* Badge */}
              {item.badge && (
                <span className="ml-2">
                  {typeof item.badge === "string" || typeof item.badge === "number" ? (
                    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-fg-secondary">
                      {item.badge}
                    </span>
                  ) : (
                    item.badge
                  )}
                </span>
              )}

              {/* Expand/collapse icon */}
              {hasChildren && (
                <ChevronDown
                  className={cx(
                    "ml-2 h-4 w-4 shrink-0 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              )}
            </>
          )}

          {/* Label - always show for sub-items even when sidebar is collapsed */}
          {level > 0 && (
            <>
              <span className="flex-1 truncate">{item.label}</span>

              {/* Badge */}
              {item.badge && (
                <span className="ml-2">
                  {typeof item.badge === "string" || typeof item.badge === "number" ? (
                    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-fg-secondary">
                      {item.badge}
                    </span>
                  ) : (
                    item.badge
                  )}
                </span>
              )}

              {/* Expand/collapse icon */}
              {hasChildren && (
                <ChevronDown
                  className={cx(
                    "ml-2 h-4 w-4 shrink-0 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              )}
            </>
          )}
        </button>

        {/* Children */}
        {hasChildren && (isExpanded || level > 0) && (!collapsed || level > 0) && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div
      className={cx(
        "flex h-full flex-col border-r border-secondary bg-primary transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header - always show logo in sidebar */}
      <div className="flex h-16 items-center px-4">
        {collapsed ? (
          <UntitledLogo className="h-8 w-8" />
        ) : (
          <UntitledLogo className="h-8" />
        )}
      </div>

      {/* Navigation */}
      <nav className={cx("flex-1", collapsed ? "px-1 py-4 overflow-hidden" : "px-2 py-4 overflow-y-auto")}>
        <ul className={cx("space-y-1", collapsed && "space-y-2")}>
          {items.map((item) => renderNavItem(item))}
        </ul>
      </nav>

      {/* Footer - only footer items, no avatar */}
      {footerItems.length > 0 && (
        <div className={cx("border-t border-secondary", collapsed ? "p-2 overflow-hidden" : "p-4 overflow-y-auto")}>
          <ul className={cx("space-y-1", collapsed && "space-y-2")}>
            {footerItems.map((item) => renderNavItem(item))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Default navigation items for demo
export const defaultNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    ),
    active: true,
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    badge: "12",
    children: [
      {
        id: "active-projects",
        label: "Active Projects",
        href: "/projects/active",
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
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    badge: <BadgeWithDot color="success" type="modern" size="sm">3</BadgeWithDot>,
  },
  {
    id: "team",
    label: "Team",
    href: "/team",
    icon: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  },
];

export const defaultFooterItems: NavItem[] = [
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