import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SimpleHeader } from "./simple-header";
import { SimpleSidebar, type NavItem, defaultNavItems, defaultFooterItems } from "./simple-sidebar";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cx } from "@/utils/cx";

interface SimpleLayoutProps {
  /** Navigation items */
  navItems?: NavItem[];
  /** Footer navigation items */
  footerItems?: NavItem[];
  /** Current active item ID */
  activeItemId?: string;
  /** Callback when nav item is clicked */
  onNavItemClick?: (item: NavItem) => void;
  /** Whether to show header notifications */
  showHeaderNotifications?: boolean;
  /** Whether to show header avatar */
  showHeaderAvatar?: boolean;
  /** Header content */
  headerContent?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Additional CSS classes for main content */
  contentClassName?: string;
}

export const SimpleLayout = ({
  navItems = defaultNavItems,
  footerItems = defaultFooterItems,
  activeItemId,
  onNavItemClick,
  showHeaderNotifications = true,
  showHeaderAvatar = true,
  headerContent,
  children,
  contentClassName,
}: SimpleLayoutProps) => {
  // Use localStorage for sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      
      // Close mobile menu when switching to desktop
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleNavItemClick = (item: NavItem) => {
    // Close mobile menu when item is clicked
    if (isMobile) {
      setMobileMenuOpen(false);
    }
    
    // Navigate using React Router (no page refresh)
    if (item.href && !item.children?.length) {
      navigate(item.href);
    }
    
    onNavItemClick?.(item);
  };

  return (
    <div className="flex h-screen bg-primary">
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-overlay/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:relative lg:translate-x-0",
          isMobile
            ? mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        <SimpleSidebar
          collapsed={sidebarCollapsed && !isMobile}
          items={navItems}
          footerItems={footerItems}
          activeItemId={activeItemId}
          onItemClick={handleNavItemClick}
        />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <SimpleHeader
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          showNotifications={showHeaderNotifications}
          showAvatar={showHeaderAvatar}
        >
          {headerContent}
        </SimpleHeader>

        {/* Main content */}
        <main
          className={cx(
            "flex-1 overflow-auto bg-secondary p-4 lg:p-6",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

// Hook for managing layout state
export const useSimpleLayout = (initialActiveId?: string) => {
  const [activeItemId, setActiveItemId] = useState(initialActiveId);

  const handleNavItemClick = (item: NavItem) => {
    setActiveItemId(item.id);
  };

  return {
    activeItemId,
    setActiveItemId,
    handleNavItemClick,
  };
};

// Example usage component
export const ExampleLayout = () => {
  const { activeItemId, handleNavItemClick } = useSimpleLayout("dashboard");

  return (
    <SimpleLayout
      activeItemId={activeItemId}
      onNavItemClick={handleNavItemClick}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-fg-primary">Dashboard</h1>
          <p className="text-fg-secondary">Welcome to your dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-secondary bg-primary p-6">
            <h3 className="text-lg font-semibold text-fg-primary">Card 1</h3>
            <p className="text-fg-secondary">Some content here</p>
          </div>
          <div className="rounded-lg border border-secondary bg-primary p-6">
            <h3 className="text-lg font-semibold text-fg-primary">Card 2</h3>
            <p className="text-fg-secondary">Some content here</p>
          </div>
          <div className="rounded-lg border border-secondary bg-primary p-6">
            <h3 className="text-lg font-semibold text-fg-primary">Card 3</h3>
            <p className="text-fg-secondary">Some content here</p>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};