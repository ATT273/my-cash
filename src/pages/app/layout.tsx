import SidebarNav from "./components/sidebar-nav";
import { Outlet } from "react-router";
import { TransactionsProvider } from "./components/app-provider";

const ProtectedLayout = () => {
  return (
    <TransactionsProvider>
      <div className="flex h-dvh w-full justify-start">
        <SidebarNav />
        <div className="flex-1 p-4 bg-gray-200">
          <Outlet />
        </div>
      </div>
    </TransactionsProvider>
  );
};

export default ProtectedLayout;
