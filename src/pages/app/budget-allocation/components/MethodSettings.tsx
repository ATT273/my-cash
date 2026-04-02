import { ALLOCATION_METHOD_KEY } from "@/constants/allocation.constants";
import SixJarMethod from "./SixJarMethod";
import ThreeJarMethod from "./ThreeJarMethod";
import ZeroBasedMethod from "./ZeroBasedMethod";
import type { CreateBudgetJarInput } from "@/types/budget-allocation.types";

interface MethodSettingsProps {
  method: string;
  walletBalance: number;
  onSubmit: (jars: CreateBudgetJarInput[]) => void;
  isLoading?: boolean;
}

const MethodSettings = ({ method, walletBalance, onSubmit, isLoading }: MethodSettingsProps) => {
  switch (method) {
    case ALLOCATION_METHOD_KEY.SIX_JAR:
      return <SixJarMethod walletBalance={walletBalance} onSubmit={onSubmit} isLoading={isLoading} />;
    case ALLOCATION_METHOD_KEY.THREE_JAR:
      return <ThreeJarMethod walletBalance={walletBalance} onSubmit={onSubmit} isLoading={isLoading} />;
    case ALLOCATION_METHOD_KEY.ZERO_BASED:
      return <ZeroBasedMethod walletBalance={walletBalance} onSubmit={onSubmit} isLoading={isLoading} />;
    default:
      return null;
  }
};

export default MethodSettings;
