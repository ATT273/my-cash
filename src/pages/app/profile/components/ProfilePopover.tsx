import { useState } from "react";
import { useNavigate } from "react-router";
import { CircleUserRound, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/AuthProvider";

const ProfilePopover = () => {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    setOpen(false);
    navigate("/home/profile");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage alt={currentUser?.useName} />
          <AvatarFallback>
            <CircleUserRound />
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent side="right" align="end" className="w-56 p-2">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{currentUser?.useName ?? "User"}</p>
        </div>
        <Separator className="my-1" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={handleProfileClick}
        >
          <User className="h-4 w-4" />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
