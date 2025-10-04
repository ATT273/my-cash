import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";

const Welcome = () => {
  return (
    <div>
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold">Hello, Guest!</p>

        <Button className="w-fit pointer-cursor">
          <NavLink to="/home" end>
            To Home
          </NavLink>
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
