import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/base/buttons/button";
import { Menu02, X } from "@untitledui/icons";

export const AppLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-72'}`}>
                <Sidebar collapsed={sidebarCollapsed} />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header bar */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Sidebar toggle button */}
                        <Button
                            color="tertiary"
                            size="sm"
                            iconLeading={sidebarCollapsed ? Menu02 : X}
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};