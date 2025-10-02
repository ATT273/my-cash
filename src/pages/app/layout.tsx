import SidebarNav from "./components/sidebar-nav";
import { Outlet } from "react-router";

const ProtectedLayout = () => {
  return (
    <div className="flex h-dvh w-full justify-start">
      <SidebarNav />
      <div className="flex-1 p-4 bg-gray-200">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
