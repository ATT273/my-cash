import SixJarMethod from "./SixJarMethod";
import ThreeJarMethod from "./ThreeJarMethod";
import ZeroBasedMethod from "./ZeroBasedMethod";

interface MethodSettingsProps {
  method: string;
}
const MethodSettings = ({ method }: MethodSettingsProps) => {
  switch (method) {
    case "6-jar":
      return <SixJarMethod />;
    case "50-30-20":
      return <ThreeJarMethod />;
    case "zero-based":
      return <ZeroBasedMethod />;
    default:
      return null;
  }
};

export default MethodSettings;
