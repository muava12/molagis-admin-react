import { Bell01, Menu01, X } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

interface SimpleHeaderProps {
  /** Whether the sidebar is collapsed */
  sidebarCollapsed?: boolean;
  /** Function to toggle sidebar */
  onToggleSidebar?: () => void;
  /** Whether to show notifications */
  showNotifications?: boolean;
  /** Whether to show avatar dropdown */
  showAvatar?: boolean;
  /** Additional content to display */
  children?: React.ReactNode;
}

export const SimpleHeader = ({
  sidebarCollapsed = false,
  onToggleSidebar,
  showNotifications = true,
  showAvatar = true,
  children,
}: SimpleHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-secondary bg-primary px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center rounded-lg p-2 text-fg-secondary hover:bg-primary_hover hover:text-fg-secondary_hover lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu01 className="h-5 w-5" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden items-center justify-center rounded-lg p-2 text-fg-secondary hover:bg-primary_hover hover:text-fg-secondary_hover lg:flex"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <Menu01 className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>

        {/* Logo has been moved to sidebar */}
        {/* Logo placeholder - now handled in sidebar */}
        <div className="w-8"></div>
      </div>

      {/* Center section */}
      <div className="flex-1 flex justify-center">
        {children}
      </div>

      {/* Right section - only notifications, dark mode toggle, and avatar */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <ThemeToggle />

        {/* Notifications */}
        {showNotifications && (
          <button
            className="relative flex items-center justify-center rounded-lg p-2 text-fg-secondary hover:bg-primary_hover hover:text-fg-secondary_hover"
            aria-label="Notifications"
          >
            <Bell01 className="h-5 w-5" />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error-500"></span>
          </button>
        )}

        {/* Avatar */}
        {showAvatar && (
          <div className="ml-2">
            <Avatar
              alt="User"
              src="https://www.untitledui.com/images/avatars/olivia-rhye?bg=%23E0E0E0"
              size="sm"
              className="cursor-pointer"
            />
          </div>
        )}
      </div>
    </header>
  );
};