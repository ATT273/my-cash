import SidebarNav from "./components/SideBar";
import { Outlet } from "react-router";
import { TransactionsProvider } from "./components/AppProvider";
import { Toaster } from "@/components/ui/sonner";

const ProtectedLayout = () => {
  return (
    <TransactionsProvider>
      <div className="flex h-dvh w-full justify-start">
        <SidebarNav />
        <div className="flex-1 p-4 bg-gray-200">
          <Outlet />
        </div>
      </div>
      <Toaster position="top-center" closeButton richColors />
    </TransactionsProvider>
  );
};

export default ProtectedLayout;
