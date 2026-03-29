import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_ALLOCATION_METHODS } from "@/constants/allocation.constants";
import { useState } from "react";
import MethodSettings from "./components/MethodSettings";
import WalletButton from "../wallet/components/WalletButton";

const BudgetAllocationPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">Budget Allocation</p>
        <WalletButton />
      </div>
      <div className="w-full h-full flex gap-4">
        <div className="flex flex-col gap-4 w-[500px] h-full p-4 bg-white rounded-lg">
          <p className="text-xl font-semibold">Jar settings</p>
          <p>Choose method</p>
          <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as string)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Methods</SelectLabel>
                {DEFAULT_ALLOCATION_METHODS.map((method) => (
                  <SelectItem key={method.key} value={method.key}>
                    <div className="flex items-center gap-2">{method.label}</div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <MethodSettings method={selectedTemplate} />
        </div>
        <div className="flex flex-col gap-4 h-full p-4 grow bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">List of Transactions</p>
            {/* <Button className="bg-green-500" onClick={() => exportDB()}>
              <Download />
            </Button> */}
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex-1">
              <p className="text-xl font-bold text-green-500">Income</p>
              {/* <TransactionList type="income" /> */}
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-red-500">Expense</p>
              {/* <TransactionList type="expense" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocationPage;
