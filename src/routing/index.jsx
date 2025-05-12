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
import FastItemVerification from "@/pages/FastItemVerification";
import ReviewLaterTasks from "@/pages/ReviewLaterTasks";
import MyTasks from "@/pages/MyTasks";
import Test from "@/pages/Test";
import NotSupportedDocuments from "@/pages/NotSupportedDocuments";
import ItemMasterVendors from "@/pages/ItemMasterVendors";
import ItemMasterDetails from "@/pages/ItemMasterDetails";
import BulkCategoriesListing from "@/pages/BulkCategoriesListing";
import CategoryWiseItems from "@/pages/CategoryWiseItems";
import ItemsCategorization from "@/pages/ItemsCategorization";
import VendorsWithPotentialDuplicates from "@/pages/VendorsWithPotentialDuplicates";
import CombineDuplicateVendors from "@/pages/CombineDuplicateVendors";
import VendorsDuplicateBranchFindingsListing from "@/pages/VendorsDuplicateBranchFindingsListing";
import CombineDuplicateBranchFindings from "@/pages/CombineDuplicateBranchFindings";
import RecentDuplicateBranchesListing from "@/pages/RecentDuplicateBranchesListing";
import RecentDuplicateVendorsListing from "@/pages/RecentDuplicateVendorsListing";

const publicRoutes = [
  {
    path: "/login",
    element: <Login />
  },

  {
    path: "/test",
    element: <Test />
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
    path: "/review-later-tasks",
    element: (
      <Protected>
        <ReviewLaterTasks />
      </Protected>
    )
  },
  {
    path: "/not-supported-documents",
    element: (
      <Protected>
        <NotSupportedDocuments />
      </Protected>
    )
  },
  {
    path: "/my-tasks",
    element: (
      <Protected>
        <MyTasks />
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
        <CreateUser />
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
    path: "/process-invoice",
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
  {
    path: "/item-master-details/:item_uuid",
    element: (
      <Protected>
        <ItemMasterDetails />
      </Protected>
    )
  },

  // Vendor Pages Routes

  {
    path: "/item-master-vendors",
    element: (
      <Protected>
        <ItemMasterVendors />
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
        <CompareInvoices />
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
  },
  {
    path: "/fast-item-verification/:vendor_id",
    element: (
      <Protected>
        <FastItemVerification />
      </Protected>
    )
  },

  {
    path: "/bulk-categorization",
    element: (
      <Protected>
        <BulkCategoriesListing/>
      </Protected>
    )
  },
  {
    path: "/category-wise-items/:category_id",
    element: (
      <Protected>
        <CategoryWiseItems/>
      </Protected>
    )
  },
  {
    path: "/items-categorization/:category_id/:vendor_id",
    element: (
      <Protected>
        <ItemsCategorization/>
      </Protected>
    )
  },

  // Duplicate Vendors Findings
  {
    path: "/vendors-potential-duplicates",
    element: (
      <Protected>
        <VendorsWithPotentialDuplicates/>
      </Protected>
    )
  },
  {
    path: "/combine-duplicate-vendors/:vendor1/:vendor2",
    element: (
      <Protected>
        <CombineDuplicateVendors/>
      </Protected>
    )
  },
   {
    path: "/recent-duplicate-vendor-findings",
    element: (
      <Protected>
        <RecentDuplicateVendorsListing/>
      </Protected>
    )
  },

  // Duplicate Branch Findings
  {
    path: "/vendors-duplicate-branch-findings",
    element: (
      <Protected>
        <VendorsDuplicateBranchFindingsListing/>
      </Protected>
    )
  },
  {
    path: "/combine-duplicate-branch-findings/:vendor_id",
    element: (
      <Protected>
        <CombineDuplicateBranchFindings/>
      </Protected>
    )
  },
  {
    path: "/recent-duplicate-branch-findings",
    element: (
      <Protected>
        <RecentDuplicateBranchesListing/>
      </Protected>
    )
  },
];
export const router = createBrowserRouter([
  ...protectedRoutes,
  ...publicRoutes
]);
