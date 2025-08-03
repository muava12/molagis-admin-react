// Simple Navigation Components
export { SimpleHeader } from "./simple-header";
export { SimpleSidebar, defaultNavItems, defaultFooterItems } from "./simple-sidebar";
export { SimpleLayout, useSimpleLayout, ExampleLayout } from "./simple-layout";

// Types
export type { NavItem } from "./simple-sidebar";

// Legacy components (for backward compatibility)
export { HeaderNavigationBase } from "./header-navigation";
export { SidebarNavigationSimple } from "./sidebar-navigation/sidebar-simple";
export * from "./sidebar-navigation-base";
export type { NavItemType, NavItemDividerType } from "./config";