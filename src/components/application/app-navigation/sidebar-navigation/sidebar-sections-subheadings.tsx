import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { MobileNavigationHeader } from "../base-components/mobile-header";
import { NavAccountCard } from "../base-components/nav-account-card";
import { NavItemBase } from "../base-components/nav-item";
import type { NavItemType } from "../config";

interface SidebarNavigationSectionsSubheadingsProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** List of items to display. */
    items: Array<{ label: string; items: NavItemType[] }>;
    /** List of items to display in the footer. */
    footerItems?: NavItemType[];
    /** Whether the sidebar is collapsed. */
    collapsed?: boolean;
}

export const SidebarNavigationSectionsSubheadings = ({ 
    activeUrl = "/", 
    items, 
    footerItems, 
    collapsed = false 
}: SidebarNavigationSectionsSubheadingsProps) => {
    const MAIN_SIDEBAR_WIDTH = collapsed ? 64 : 292;

    const content = (
        <aside
            style={
                {
                    "--width": `${MAIN_SIDEBAR_WIDTH}px`,
                } as React.CSSProperties
            }
            className={`flex h-full w-full max-w-full flex-col justify-between overflow-auto border-secondary bg-primary shadow-xs md:border-r lg:w-(--width) lg:rounded-xl lg:border transition-all duration-300 ${
                collapsed ? 'pt-2 lg:pt-3' : 'pt-4 lg:pt-5'
            }`}
        >
            <div className={`flex flex-col gap-5 ${collapsed ? 'px-2 lg:px-3' : 'px-4 lg:px-5'}`}>
                {!collapsed && <UntitledLogo className="h-8" />}
                {collapsed && (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 bg-brand-solid rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">U</span>
                        </div>
                    </div>
                )}
            </div>

            <ul className="mt-8">
                {items.map((group) => (
                    <li key={group.label}>
                        {!collapsed && (
                            <div className="px-5 pb-1">
                                <p className="text-xs font-bold text-quaternary uppercase">{group.label}</p>
                            </div>
                        )}
                        <ul className={collapsed ? 'px-2 pb-5' : 'px-4 pb-5'}>
                            {group.items.map((item) => (
                                <li key={item.label} className="py-0.5">
                                    <NavItemBase
                                        icon={item.icon}
                                        href={item.href}
                                        badge={item.badge}
                                        type="link"
                                        current={item.href === activeUrl}
                                    >
                                        {!collapsed && item.label}
                                    </NavItemBase>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <div className={`mt-auto flex flex-col gap-5 py-4 ${collapsed ? 'px-1 lg:gap-4 lg:px-2' : 'px-2 lg:gap-6 lg:px-4'}`}>
                {footerItems && (
                    <ul className={collapsed ? 'px-2 pb-5' : 'px-4 pb-5'}>
                        {footerItems.map((item) => (
                            <li key={item.label} className="py-0.5">
                                <NavItemBase
                                    icon={item.icon}
                                    href={item.href}
                                    badge={item.badge}
                                    type="link"
                                    current={item.href === activeUrl}
                                >
                                    {!collapsed && item.label}
                                </NavItemBase>
                            </li>
                        ))}
                    </ul>
                )}
                {!collapsed && <NavAccountCard />}
                {collapsed && (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                )}
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile header navigation */}
            <MobileNavigationHeader>{content}</MobileNavigationHeader>

            {/* Desktop sidebar navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:py-1 lg:pl-1">{content}</div>

            {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
            <div
                style={{
                    paddingLeft: MAIN_SIDEBAR_WIDTH + 4,
                }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
};
