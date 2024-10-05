import Login from "@/components/auth/Login";
import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import Protected from "@/routing/Protected";
import UserActivity from "@/components/user/UserActivity";
import Home from "@/pages/Home";
import CreateInvoice from "@/components/invoice/CreateInvoice";
import VendorDetails from "@/pages/VendorDetails";
import VendorConsolidation from "@/pages/VendorConsolidation";
import VendorBranches from "@/pages/VendorBranches";
import VendorBranchDetails from "@/pages/VendorBranchDetails";
import InvoiceDetails from "@/pages/InvoiceDetails";

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
  // Users Pages Routes
  {
    path: "/user-activity",
    element: (
      <Protected>
        <UserActivity />
      </Protected>
    )
  },

  // Invoice Pages Routes
  {
    path: "/create-invoice",
    element: (
      <Protected>
        <CreateInvoice />
      </Protected>
    )
  },
  {
    path: "/invoice-details/:invoice_id",
    element: (
      <Protected>
        <InvoiceDetails />
      </Protected>
    )
  },

  // Vendor Pages Routes
  {
    path: "/vendor-consolidation",
    element: (
      <Protected>
        <VendorConsolidation />
      </Protected>
    )
  },
  {
    path: "/vendor-details/:vendor_id",
    element: (
      <Protected>
        <VendorDetails />
      </Protected>
    )
  },
  {
    path: "/vendor-branches/:vendor_id",
    element: (
      <Protected>
        <VendorBranches />
      </Protected>
    )
  },
  {
    path: "/vendor-branch-details/:branch_id",
    element: (
      <Protected>
        <VendorBranchDetails />
      </Protected>
    )
  }
];
export const router = createBrowserRouter([
  ...protectedRoutes,
  ...publicRoutes
]);
