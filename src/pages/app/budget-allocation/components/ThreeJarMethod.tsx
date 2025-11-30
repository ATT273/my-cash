import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { THREE_JAR_METHOD } from "@/constants/allocation.constants";
import { useEffect, useState } from "react";

const initialValue = {
  wants: 30,
  savings: 20,
  needs: 50,
};
const ThreeJarMethod = () => {
  const jarArray = Object.entries(THREE_JAR_METHOD);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [jarPercentage, setJarPercentage] = useState(initialValue);

  const [selectedJar, setSelectedJar] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSelectedJar("");
    }
  };

  const onSave = () => {
    const totalPercentage = Object.values(jarPercentage).reduce((acc, val) => acc + val, 0);
    if (totalPercentage !== 100) {
      setError("Total percentage must equal 100%");
      return;
    }
    setError("");
    setIsLoading(true);
    localStorage.setItem("my_cash_3_jars", JSON.stringify(jarPercentage));
    setIsLoading(false);
    setIsSuccess(true);
  };
  useEffect(() => {
    const savedSettings = localStorage.getItem("my_cash_3_jars");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setJarPercentage(parsedSettings);
    } else {
      setJarPercentage(initialValue);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {jarArray.map(([key, value]) => {
        const Icon = value.icon;
        return (
          <div key={key} className={`flex flex-col gap-1 p-2 rounded-lg ${value.color}`}>
            <div className="flex justify-between items-center gap-2 text-xl font-bold text-white">
              {/* {value.label} */}
              <Icon className="text-white" />
            </div>

            {selectedJar === key ? (
              <div className="flex w-full justify-end gap-2">
                <p className="capitalize text-white text-3xl font-bold">{key}</p>
                <Input
                  value={jarPercentage[key as keyof typeof jarPercentage] ?? "0"}
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;
                    let newPercentage = e.target.value ? parseFloat(e.target.value) : 0;
                    if (newPercentage < 0 || newPercentage > 100) {
                      newPercentage = 0;
                    }
                    setJarPercentage({
                      ...jarPercentage,
                      [key]: newPercentage,
                    });
                  }}
                  autoFocus
                  className="w-[70px] !text-white !font-bold !text-3xl"
                  onKeyDown={handleKeyDown}
                />
              </div>
            ) : (
              <p
                className="text-white text-3xl font-bold text-right cursor-pointer"
                onClick={() => setSelectedJar(key)}
              >
                <span className="capitalize">{key}</span>{" "}
                <span>{jarPercentage[key as keyof typeof jarPercentage]}%</span>
              </p>
            )}
          </div>
        );
      })}
      <div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {isSuccess && <p className="text-green-500 text-sm">Settings saved successfully!</p>}
      </div>
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default ThreeJarMethod;
