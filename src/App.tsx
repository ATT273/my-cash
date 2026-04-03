import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Welcome from "./pages/welcome";
import ProtectedLayout from "./pages/app/layout";
import Dashboard from "./pages/app/dashboard";
import Transaction from "./pages/app/transaction";
import Report from "./pages/app/report";
import BudgetAllocationPage from "./pages/app/budget-allocation";
import WalletPage from "./pages/app/wallet";
import ProfilePage from "./pages/app/profile";

const queryClient = new QueryClient();

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
      { path: "wallet", Component: WalletPage },
      { path: "profile", Component: ProfilePage },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
