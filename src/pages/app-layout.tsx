import { Outlet } from "react-router";
import { Sidebar } from "./sidebar";

export const AppLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};