import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils";
import type { IJar } from "@/types/budget-allocation.types";
import type { JarAllocationInput } from "@/types/transaction.types";
import { ICON_LIST } from "@/constants/icon.constants";
import { CircleHelp } from "lucide-react";

interface Props {
  open: boolean;
  incomeAmount: number;
  jars: IJar[];
  onConfirm: (allocations: JarAllocationInput[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ZeroBasedAllocationDialog = ({ open, incomeAmount, jars, onConfirm, onCancel, isLoading }: Props) => {
  const [inputs, setInputs] = useState<Record<string, string>>(() =>
    Object.fromEntries(jars.map((j) => [j.id, ""]))
  );

  const totalAllocated = useMemo(() => {
    return jars.reduce((sum, jar) => {
      const val = Number(inputs[jar.id] ?? 0);
      return sum + val;
    }, 0);
  }, [inputs, jars]);

  const remaining = incomeAmount - totalAllocated;
  const isFullyAllocated = remaining === 0;
  const isOverAllocated = remaining < 0;

  const handleConfirm = () => {
    const allocations: JarAllocationInput[] = jars.map((jar) => ({
      jarId: jar.id,
      amount: Number(inputs[jar.id] ?? 0),
    }));
    onConfirm(allocations);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isLoading) onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Allocate Income to Jars</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Total income</span>
          <span className="font-semibold">{formatCurrency(incomeAmount)}</span>
        </div>

        <div className="flex flex-col gap-3">
          {jars.map((jar) => {
            const Icon = ICON_LIST.find((i) => i.key === jar.icon)?.icon;
            const rawValue = inputs[jar.id] ?? "";

            return (
              <div key={jar.id} className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${jar.color}`}
                >
                  {Icon ? (
                    <Icon size={14} className="text-white" />
                  ) : (
                    <CircleHelp size={14} className="text-white" />
                  )}
                </span>
                <span className="w-28 text-sm font-medium truncate">{jar.name}</span>
                <Input
                  className="flex-1"
                  type="text"
                  placeholder="0"
                  value={rawValue === "" ? "" : formatCurrency(Number(rawValue))}
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/[^0-9]/g, "");
                    setInputs((prev) => ({ ...prev, [jar.id]: numeric }));
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-sm mt-1 pt-2 border-t">
          <span className={isOverAllocated ? "text-red-500 font-medium" : "text-gray-500"}>
            {isOverAllocated ? "Over-allocated" : "Remaining"}
          </span>
          <span
            className={
              isOverAllocated
                ? "text-red-500 font-semibold"
                : isFullyAllocated
                ? "text-green-600 font-semibold"
                : "font-semibold"
            }
          >
            {isOverAllocated
              ? `+${formatCurrency(Math.abs(remaining))}`
              : formatCurrency(remaining)}
          </span>
        </div>

        {isOverAllocated && (
          <p className="text-xs text-red-500">
            Total allocated exceeds the income amount. Please reduce some jar amounts.
          </p>
        )}

        {!isFullyAllocated && !isOverAllocated && (
          <p className="text-xs text-gray-400">
            Zero-based budgeting requires every dollar to be allocated. Distribute the remaining {formatCurrency(remaining)}.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isFullyAllocated || isLoading}>
            {isLoading ? "Saving..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ZeroBasedAllocationDialog;
