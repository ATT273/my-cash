import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";
import Wallet from "../components/Wallet";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-bold">Dashboard</p>
      <div>
        <Wallet />
        <div className="flex gap-4">
          <div className="flex flex-col justify-between items-start w-[200px] h-[120px] p-2 bg-white rounded-lg">
            <div className="flex gap-2 items-center">
              <ArrowBigDownDash className="w-6 h-6 text-green-500" />
              <p className="text-3xl font-semibold">Income</p>
            </div>
            <div className="flex justify-end w-full gap-2">
              <p className="text-xl font-semibold">1</p>
              <p className="text-xl font-semibold"> Transactions</p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start w-[200px] h-[120px] p-2 bg-white rounded-lg">
            <div className="flex gap-2 items-center">
              <ArrowBigUpDash className="w-6 h-6 text-red-500" />
              <p className="text-3xl font-semibold">Expense</p>
            </div>
            <div className="flex justify-end w-full gap-2">
              <p className="text-xl font-semibold">2</p>
              <p className="text-xl font-semibold"> Transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
