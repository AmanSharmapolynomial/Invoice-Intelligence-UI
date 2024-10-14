import Login from "@/pages/Login";
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
import CombineVendors from "@/pages/CombineVendors";
import VendorItemMaster from "@/pages/VendorItemMaster";
import CreateUser from "@/pages/CreateUser";
import CompareInvoices from "@/pages/CompareInvoices";
import InvoiceProcessor from "@/pages/InvoiceProcessor";

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
  // Users and auth Pages Routes
  {
    path: "/user-activity",
    element: (
      <Protected>
        <UserActivity />
      </Protected>
    )
  },
  {
    path: "/create-user",
    element: (
      <Protected>
        <CreateUser/>
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
    path: "/invoice-processor",
    element: (
      <Protected>
        <InvoiceProcessor />
      </Protected>
    )
  },
  {
    path: "/invoice-details/",
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
    path: "/vendor-consolidation/combine-vendors/:vendor_id",
    element: (
      <Protected>
        <CombineVendors />
      </Protected>
    )
  },
  {
    path: "/vendor-consolidation/compare-invoices/:vendor_one/:vendor_two",
    element: (
      <Protected>
        <CompareInvoices/>
      </Protected>
    )
  },
  {
    path: "/vendor-consolidation/vendor-item-master/:vendor_id",
    element: (
      <Protected>
        <VendorItemMaster />
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
    path: "/vendor-branch-details/:vendor_id/:branch_id",
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
