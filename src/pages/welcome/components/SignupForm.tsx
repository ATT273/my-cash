import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useDB } from "@/components/DBProvider";

const SignupForm = ({ openSigninForm }: { openSigninForm: () => void }) => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
  });
  const { createUser } = useDB();
  const handleSignup = async () => {
    if (formData.userName.trim() === "" || formData.password === "" || formData.email.trim() === "") {
      toast.error("Please fill all fields in form");
      return;
    }

    const result = await createUser(formData);
    if (!result.success) {
      toast.error("There is an error while creating your account! Please try again");
      return;
    }
    toast.success("Sign up successfull! Please sign in to your account");
    openSigninForm();
  };
  return (
    <div className="flex flex-col gap-4 w-[500px] border rounded-2xl p-4">
      <h1 className="text-center font-semibold text-2xl">Sign up</h1>
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
          <p>Email</p>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value.trim(),
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>Password</p>
          <Input
            type="password"
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
        <Button className="w-full" onClick={handleSignup}>
          Sign up
        </Button>
        <p className="underline text-sky-400 cursor-pointer" onClick={openSigninForm}>
          Have an account? Sign in here
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
