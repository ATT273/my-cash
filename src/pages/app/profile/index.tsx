import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { CircleUserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/AuthProvider";
import { useChangePassword } from "@/hooks/profile/UseChangePassword";
import { useGetUserProfile } from "@/hooks/profile/UseGetUserProfile";

const initPasswordForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const { data: profile } = useGetUserProfile();
  const { mutate: changePassword, isPending } = useChangePassword();
  const navigate = useNavigate();

  const [passwordForm, setPasswordForm] = useState(initPasswordForm);

  const handleChangePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (!currentUser) return;

    changePassword(
      { userId: currentUser.id, currentPassword, newPassword },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast.success("Password changed successfully");
            setPasswordForm(initPasswordForm);
          } else {
            toast.error(data.message ?? "Failed to change password");
          }
        },
        onError: () => toast.error("Failed to change password"),
      }
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <p className="text-2xl font-bold">Profile</p>
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg max-w-lg overflow-y-auto">

        {/* Personal Info */}
        <div className="flex flex-col gap-4">
          <p className="font-semibold">Personal Information</p>
          <Avatar className="h-16 w-16">
            <AvatarImage alt={currentUser?.useName} />
            <AvatarFallback className="h-16 w-16">
              <CircleUserRound className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs">Username</Label>
            <p className="text-sm font-medium">{currentUser?.useName ?? "—"}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs">Email</Label>
            <p className="text-sm font-medium">{profile?.email ?? "—"}</p>
          </div>
        </div>

        <Separator />

        {/* Change Password */}
        <div className="flex flex-col gap-4">
          <p className="font-semibold">Change Password</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Enter current password"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Enter new password"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
            />
          </div>
          <Button onClick={handleChangePassword} disabled={isPending} className="self-start">
            {isPending ? "Saving..." : "Save Password"}
          </Button>
        </div>

        <Separator />

        {/* Account */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Account</p>
          <Button variant="destructive" className="self-start" onClick={handleLogout}>
            Logout
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
