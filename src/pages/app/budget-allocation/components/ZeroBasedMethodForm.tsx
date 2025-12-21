import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICON_LIST } from "@/constants/icon.constants";
import { useMemo, useState } from "react";
import { Palette, CircleQuestionMark } from "lucide-react";
import type { JarFormData } from "@/types/budget-allocation.types";

interface ZeroBasedMethodFormProps {
  onSubmit: (jarArray: JarFormData) => void;
}
const ZeroBasedMethodForm = ({ onSubmit }: ZeroBasedMethodFormProps) => {
  // const jarArray = Object.entries(THREE_JAR_METHOD);
  // const [jarArray, setJarArray] = useState<JarFormData[]>([]);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [formData, setFormData] = useState<JarFormData>({ name: "", color: "", icon: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onColorPicked = (color: string) => {
    setFormData({ ...formData, color });
  };

  const onSave = () => {
    setIsLoading(true);
    if (!formData.name || !formData.color || !formData.icon) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }
    onSubmit(formData);
    setFormData({ name: "", color: "", icon: "" });
    setOpenAddForm(false);
    setIsLoading(false);
  };

  const onCancel = () => {
    setOpenAddForm(false);
    setFormData({ name: "", color: "", icon: "" });
    setError("");
  };
  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpenAddForm(true)}>+ Add jar</Button>
      {openAddForm && (
        <div className="flex flex-col gap-1">
          <div
            className={`relative flex flex-col gap-1 p-2 rounded-lg shadow-md ${
              formData.color ? formData.color : "bg-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              {/* Icon */}
              <div className="flex justify-between items-center gap-2 text-xl font-bold text-white">
                <IconComponent
                  value={formData.icon}
                  onChange={(value) => setFormData({ ...formData, icon: value.icon })}
                />
              </div>
              {/* Color pallette */}
              <ColorPicker onColorPicked={onColorPicked} />
            </div>
            {/* Name */}
            <InputComponent
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value.name })}
              onError={(error) => setError(error)}
            />
          </div>
          <div>{error && <p className="text-red-500 text-sm">{error}</p>}</div>
          <div className="flex gap-2 justify-end">
            <Button variant={"outline"} onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Add"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface InputComponentProps {
  value: string;
  onChange: (value: { name: string }) => void;
  onError: (error: string) => void;
}

const InputComponent = ({ value, onChange, onError }: InputComponentProps) => {
  const [showNameInput, setShowNameInput] = useState(false);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (value.trim() === "") {
        onError("Name cannot be empty");
        return;
      } else {
        setShowNameInput(false);
      }
    }
  };
  return (
    <div>
      {showNameInput ? (
        <Input
          id="name"
          value={value}
          className="focus:bg-white"
          onChange={(e) => onChange({ name: e.target.value })}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div className="text-white text-3xl font-bold text-right cursor-pointer">
          {value ? (
            <span className="capitalize" onClick={() => setShowNameInput(true)}>
              {value}
            </span>
          ) : (
            <span className="text-gray-500" onClick={() => setShowNameInput(true)}>
              Enter name
            </span>
          )}
        </div>
      )}
    </div>
  );
};

interface IconComponentProps {
  value: string;
  onChange: (value: { icon: string }) => void;
}

const IconComponent = ({ value, onChange }: IconComponentProps) => {
  const [showIconSelect, setShowIconSelect] = useState(false);
  const SelectedIcon = useMemo(() => {
    return ICON_LIST.find((icon) => icon.key === value)?.icon || null;
  }, [value]);
  return (
    <div>
      {showIconSelect ? (
        <Select
          defaultOpen={true}
          value={value}
          onValueChange={(value) => {
            setShowIconSelect(false);
            onChange({ icon: value });
          }}
        >
          <SelectTrigger className="w-[50px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Icon</SelectLabel>
              {ICON_LIST.map((item) => {
                const Icon = item.icon;
                return (
                  <SelectItem key={item.key} value={item.key}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <div className="cursor-pointer" onClick={() => setShowIconSelect(true)}>
          {SelectedIcon ? <SelectedIcon className="text-white" /> : <CircleQuestionMark className="text-white" />}
        </div>
      )}
    </div>
  );
};

const ColorPicker = ({ onColorPicked }: { onColorPicked: (color: string) => void }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorClick = (color: string) => {
    onColorPicked(color);
    setShowColorPicker(false);
  };
  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex gap-2">
        <Button variant={"outline"} className="size-8" onClick={() => setShowColorPicker(!showColorPicker)}>
          <Palette />
        </Button>
      </div>
      {showColorPicker && (
        <div className="absolute top-10 right-0 flex gap-2 p-4 border rounded-2xl bg-white">
          <Button
            className="size-8 bg-sky-500 hover:bg-sky-500/50"
            onClick={() => {
              handleColorClick("bg-sky-500");
            }}
          />
          <Button
            className="size-8 bg-green-500 hover:bg-green-500/50"
            onClick={() => handleColorClick("bg-green-500")}
          />
          <Button
            className="size-8 bg-amber-500 hover:bg-amber-500/50"
            onClick={() => handleColorClick("bg-amber-500")}
          />
          <Button className="size-8 bg-red-500 hover:bg-red-500/50" onClick={() => handleColorClick("bg-red-500")} />
        </div>
      )}
    </div>
  );
};
export default ZeroBasedMethodForm;
