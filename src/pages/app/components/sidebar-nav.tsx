import { NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound, HandCoins, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const SidebarNav = () => {
  return (
    <div className="flex flex-col justify-between items-center w-[50px] py-4 bg-white">
      <div className="flex flex-col gap-2">
        <NavLink to="dashboard">
          {({ isActive }) => (
            <Button
              variant={"ghost"}
              className={isActive ? "bg-gray-200 text-gray-900" : ""}
            >
              <LayoutDashboard />
            </Button>
          )}
        </NavLink>
        <NavLink to="transaction">
          {({ isActive }) => (
            <Button
              variant={"ghost"}
              className={isActive ? "bg-gray-200 text-gray-900" : ""}
            >
              <HandCoins />
            </Button>
          )}
        </NavLink>
      </div>
      <Avatar>
        <AvatarImage alt="@shadcn" />
        <AvatarFallback>
          <CircleUserRound />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default SidebarNav;
