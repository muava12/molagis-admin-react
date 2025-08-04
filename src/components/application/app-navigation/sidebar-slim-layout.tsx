import { SlimHeader } from "./slim-header";
import type { NavItemType } from "./config";
import { SidebarNavigationSlim } from "./sidebar-navigation/sidebar-slim";
import { cx } from "@/utils/cx";

interface SlimLayoutProps {
  /** Navigation items */
  navItems: (NavItemType & { icon: React.FC<{ className?: string }> })[];
  /** Footer navigation items */
  footerItems?: (NavItemType & { icon: React.FC<{ className?: string }> })[];
  /** Current active URL */
  activeUrl?: string;
  /** Header content */
  headerContent?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Additional CSS classes for main content */
  contentClassName?: string;
}

export const SlimLayout = ({
  navItems,
  footerItems = [],
  activeUrl,
  headerContent,
  children,
  contentClassName,
}: SlimLayoutProps) => {
  // Get the current URL
  const currentUrl = activeUrl || "";


  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen bg-primary">
        {/* Sidebar - only visible on desktop */}
        <SidebarNavigationSlim
          activeUrl={currentUrl}
          items={navItems}
          footerItems={footerItems}
          hideBorder={false}
          hideRightBorder={false}
        />

        {/* Main content area for desktop */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Desktop Header */}
          <SlimHeader>
            {headerContent}
          </SlimHeader>

          {/* Main content */}
          <main
            className={cx(
              "flex-1 overflow-auto bg-secondary p-6",
              contentClassName
            )}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-screen bg-primary flex flex-col">
        {/* Mobile Navigation Header (handled by SidebarNavigationSlim) */}
        <SidebarNavigationSlim
          activeUrl={currentUrl}
          items={navItems}
          footerItems={footerItems}
          hideBorder={false}
          hideRightBorder={false}
        />

        {/* Main content area for mobile - full width below header */}
        <main
          className={cx(
            "flex-1 overflow-auto bg-secondary p-4",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    </>
  );
};