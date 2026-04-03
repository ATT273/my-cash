import { NavLink } from "react-router";
import { HandCoins, LayoutDashboard, ChartColumnBig, PiggyBank, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfilePopover from "@/pages/app/profile/components/ProfilePopover";

const SidebarNav = () => {
  return (
    <div className="flex flex-col justify-between items-center w-[50px] py-4 bg-white">
      <div className="flex flex-col gap-2">
        <NavLink to="dashboard">
          {({ isActive }) => (
            <Button title="Dashboard" variant={"ghost"} className={isActive ? "bg-gray-200 text-gray-900" : ""}>
              <LayoutDashboard />
            </Button>
          )}
        </NavLink>
        <NavLink to="transaction">
          {({ isActive }) => (
            <Button title="Transaction" variant={"ghost"} className={isActive ? "bg-gray-200 text-gray-900" : ""}>
              <HandCoins />
            </Button>
          )}
        </NavLink>
        <NavLink to="report">
          {({ isActive }) => (
            <Button title="Report" variant={"ghost"} className={isActive ? "bg-gray-200 text-gray-900" : ""}>
              <ChartColumnBig />
            </Button>
          )}
        </NavLink>
        <NavLink to="budget-allocation">
          {({ isActive }) => (
            <Button title="Budget Allocation" variant={"ghost"} className={isActive ? "bg-gray-200 text-gray-900" : ""}>
              <PiggyBank />
            </Button>
          )}
        </NavLink>
        <NavLink to="wallet">
          {({ isActive }) => (
            <Button title="Wallet" variant={"ghost"} className={isActive ? "bg-gray-200 text-gray-900" : ""}>
              <Wallet />
            </Button>
          )}
        </NavLink>
      </div>
      <ProfilePopover />
    </div>
  );
};

export default SidebarNav;
