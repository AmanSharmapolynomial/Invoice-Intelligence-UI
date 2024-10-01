import Login from "@/components/auth/Login";
import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import Protected from "@/routing/Protected";
import UserActivity from "@/components/user/UserActivity";
import Home from "@/components/home/Home";
import CreateInvoice from "@/components/invoice/CreateInvoice";
import VendorConsolidation from "@/components/vendor/VendorConsolidation";

const publicRoutes = [
  {
    path: "/login",
    element: <Login />
  }
];
const protectedRoutes = [
  {
    path: "/",
    element: (
      <Protected>
        <App />
      </Protected>
    )
  },
  {
    path: "/home",
    element: (
      <Protected>
        <Home />
      </Protected>
    )
  },

  {
    path: "/user-activity",
    element: (
      <Protected>
        <UserActivity />
      </Protected>
    )
  },
  {
    path: "/create-invoice",
    element: (
      <Protected>
        <CreateInvoice />
      </Protected>
    )
  },
  {
    path: "/vendor-consolidation",
    element: (
      <Protected>
        <VendorConsolidation />
      </Protected>
    )
  }
];
export const router = createBrowserRouter([
  ...protectedRoutes,
  ...publicRoutes
]);
