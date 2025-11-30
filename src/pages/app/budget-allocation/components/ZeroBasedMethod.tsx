import { useEffect, useState } from "react";
import ZeroBasedMethodForm from "./ZeroBasedMethodForm";
import type { JarFormData } from "@/types/budget-allocation.types";
import { ICON_LIST } from "@/constants/icon.constants";
import { CircleQuestionMark } from "lucide-react";
import { Button } from "@/components/ui/button";

const ZeroBasedMethod = () => {
  const [jarArray, setJarArray] = useState<JarFormData[]>([]);

  useEffect(() => {
    const savedSettings = localStorage.getItem("my_cash_zero_based");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setJarArray(parsedSettings);
    } else {
      setJarArray([]);
    }
  }, []);

  const handleFormSubmit = (newJar: JarFormData) => {
    setJarArray((prev) => [...prev, newJar]);
  };

  const onSave = () => {
    localStorage.setItem("my_cash_zero_based", JSON.stringify(jarArray));
  };
  return (
    <div>
      <ZeroBasedMethodForm onSubmit={handleFormSubmit} />
      <div className="flex flex-col gap-4 py-4">
        <p className="text-xl font-semibold">Jar list</p>
        {jarArray.length > 0 ? (
          jarArray.map((jar, index) => {
            const Icon = ICON_LIST.find((icon) => icon.key === jar.icon)?.icon;
            return (
              <div key={`${jar.name}-${index}`} className={`flex flex-col gap-1 p-2 rounded-lg ${jar.color}`}>
                <div className="flex justify-between items-center gap-2 text-xl font-bold text-white">
                  {Icon ? <Icon className="text-white" /> : <CircleQuestionMark className="text-white" />}
                </div>

                <p className="text-white text-3xl font-bold text-right cursor-pointer">
                  <span className="capitalize">{jar.name}</span>
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-center text-zinc-400 p-4">No jar added</div>
        )}
      </div>
      {jarArray.length > 0 && (
        <div className="w-full flex justify-end">
          <Button onClick={onSave}>Save</Button>
        </div>
      )}
    </div>
  );
};

export default ZeroBasedMethod;
