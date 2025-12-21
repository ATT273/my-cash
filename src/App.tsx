import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Welcome from "./pages/welcome";
import ProtectedLayout from "./pages/app/layout";
import Dashboard from "./pages/app/dashboard";
import Transaction from "./pages/app/transaction";
import Report from "./pages/app/report";
import BudgetAllocationPage from "./pages/app/budget-allocation";
import { DBProvider } from "./components/DBProvider";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/home",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "dashboard", Component: Dashboard },
      { path: "transaction", Component: Transaction },
      { path: "report", Component: Report },
      { path: "budget-allocation", Component: BudgetAllocationPage },
    ],
  },
]);

function App() {
  return (
    <DBProvider>
      <RouterProvider router={router} />
    </DBProvider>
  );
}

export default App;
