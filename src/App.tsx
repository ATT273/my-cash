import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Welcome from "./pages/welcome";
import ProtectedLayout from "./pages/app/layout";
import Dashboard from "./pages/app/dashboard";
import Transaction from "./pages/app/transaction";
import Report from "./pages/app/report";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/login",
    element: <div>Login</div>,
  },
  {
    path: "/register",
    element: <div>Register</div>,
  },
  {
    path: "/home",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "dashboard", Component: Dashboard },
      { path: "transaction", Component: Transaction },
      { path: "report", Component: Report },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
