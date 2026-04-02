import type { IBudget } from "@/types/budget-allocation.types";
import { ICON_LIST } from "@/constants/icon.constants";
import { BUDGET_TYPE_LABELS } from "@/constants/allocation.constants";
import { CircleQuestionMark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils";
import CustomAlertDialog from "@/components/custom-components/AlertDialog";

interface BudgetOverviewProps {
  budget: IBudget;
  onSwitchBudget: () => void;
  isSwitching?: boolean;
}

const BudgetOverview = ({ budget, onSwitchBudget, isSwitching }: BudgetOverviewProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Active Method</p>
          <p className="font-semibold text-gray-800">{BUDGET_TYPE_LABELS[budget.type] ?? budget.type}</p>
        </div>
        <CustomAlertDialog
          title="Switch Budget Method"
          description="Switching will archive your current budget. Your balance will be reallocated to the new budget's jars. Are you sure?"
          onConfirm={onSwitchBudget}
        >
          <Button variant="outline" size="sm" disabled={isSwitching}>
            {isSwitching ? "Switching..." : "Switch Budget"}
          </Button>
        </CustomAlertDialog>
      </div>

      <div className="flex flex-col gap-2">
        {budget.jars.map((jar) => {
          const Icon = ICON_LIST.find((i) => i.key === jar.icon)?.icon;
          const allocation = jar.allocation;
          return (
            <div key={jar.id} className={`flex items-center gap-2 p-2 rounded-lg ${jar.color}`}>
              <div className="text-white">
                {Icon ? <Icon size={18} /> : <CircleQuestionMark size={18} />}
              </div>
              <p className="text-white font-semibold flex-1">{jar.name}</p>
              <div className="text-right">
                {allocation?.percentage != null && (
                  <span className="text-white/80 text-xs mr-2">{allocation.percentage}%</span>
                )}
                <span className="text-white font-semibold">{formatCurrency(allocation?.amount ?? 0)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-sm text-gray-500">
        Started: {new Date(budget.startedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default BudgetOverview;
