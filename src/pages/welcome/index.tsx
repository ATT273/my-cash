import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";
// import DBConfigMenu from "../app/components/DBConfigMenu";
import { useEffect, useState } from "react";
import * as authService from "@/services/auth.service";
import type { ILocalUser } from "@/types/user.types";
import SigninForm from "./components/SigninForm";
import SignupForm from "./components/SignupForm";
import { Toaster } from "@/components/ui/sonner";

const Welcome = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSigninForm, setOpenSigninForm] = useState(true);
  const [localUser, setLocalUser] = useState<ILocalUser | null>(null);

  const checkUserAuth = async () => {
    const result = await authService.getIsAuthed();
    if (result) {
      const user = authService.getCurrentUser();
      setLocalUser(user);
    }
    setIsLoggedIn(result);
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  return (
    <div>
      <Toaster position="top-center" closeButton richColors theme="light" />
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold">Hello, {localUser?.useName ?? "Guest"}!</p>

        {!isLoggedIn ? (
          <>
            {openSigninForm ? (
              <SigninForm openSignupForm={() => setOpenSigninForm(false)} />
            ) : (
              <SignupForm openSigninForm={() => setOpenSigninForm(true)} />
            )}
          </>
        ) : (
          <Button className="w-fit pointer-cursor">
            <NavLink to="/home" end>
              To Home
            </NavLink>
          </Button>
        )}
        {/* <DBConfigMenu /> */}
      </div>
    </div>
  );
};

export default Welcome;
