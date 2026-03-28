import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signIn } from "@/services/auth.service";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const SigninForm = ({ openSignupForm }: { openSignupForm: () => void }) => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleSignin = async () => {
    if (formData.userName.trim() === "" || formData.password.trim() === "") {
      return;
    }
    const result = await signIn(formData.userName, formData.password);

    if (!result.success) {
      toast.error("Your credentials is invalid. Please check your user name and password again!");
      return;
    }
    toast.success("Sign in sucessfull");
    navigate("/home", { replace: true });
  };
  return (
    <div className="flex flex-col gap-4 w-[500px] border rounded-2xl p-4">
      <h1 className="text-center font-semibold text-2xl">Sign in</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p>User Name</p>
          <Input
            value={formData.userName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                userName: e.target.value.trim(),
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>Password</p>
          <Input
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value.trim(),
              }))
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <Button className="w-full" onClick={handleSignin}>
          Sign in
        </Button>
        <p className="underline text-sky-400 cursor-pointer" onClick={openSignupForm}>
          Don't have an account? Create new one here
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
