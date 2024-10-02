export const invoiceTableHeaders = [
  {
    label: "Invoice ID",
    key: "invoice_number"
  },
  {
    label: "Source/Channel",
    key: "invoice_number"
  },
  {
    label: "Restaurant",
    key: "restaurant_name"
  },
  {
    label: "Vendor",
    key: "vendor_name"
  },
  {
    label: "Upload Date",
    key: "date_uploaded"
  },
  {
    label: "Auto Balance Status",
    key: ""
  },
  {
    label: "Manual Balance Status",
    key: ""
  },
  {
    label: "Final Status",
    key: ""
  },
  {
    label: "clickBACON Status",
    key: "clickbacon_status"
  },
  {
    label: "Failure Cause Code",
    key: ""
  },
  {
    label: "Accepted/Rejected",
    key: ""
  },
  {
    label: "Rejected Reason",
    key: "rejected_reason"
  },
  {
    label: "Invoice Type",
    key: "invoice_type"
  },
  {
    label: "Human Verification Date",
    key: "human_verified_date"
  }
];

export const vendorCategories = [
  {
    label: "NA",
    value: "NA"
  },
  {
    label: "Normal Invoice",
    value: "Normal Invoice"
  },
  {
    label: "Liquor Invoice",
    value: "Liquor Invoice"
  },
  {
    label: "Summary Invoice",
    value: "Summary Invoice"
  },
  {
    label: "None",
    value: "none"
  }
];

export const humanVerifiedOptions = [
  {
    label: "Verified",
    value: "Verified"
  },
  {
    label: "Not Verified",
    value: "Not Verified"
  },
  {
    label: "Clear",
    value: "none"
  }
];

export const HumanVerificationFilterOptions = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Human Verification Required",
    value: "Human Verification Required"
  },
  {
    label: "Human Verification Not Required",
    value: "Human Verification Not Required"
  }
];
export const InvoiceTypeFilterOptions = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Normal Invoice",
    value: "Normal Invoice"
  },
  {
    label: "Liquor Invoice",
    value: "Liquor Invoice"
  },
  {
    label: "Summary Invoice",
    value: "Summary Invoice"
  }
];

export const InvoiceDetectionStatusFilterOptions = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Detected",
    value: "Detected"
  },
  {
    label: "Not Detected",
    value: "Not Detected"
  }
];
export const InvoiceReRunStatusFilterOptions = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Rerun",
    value: "Rerun"
  },
  {
    label: "Not Rerun",
    value: "Not Rerun"
  }
];
export const AutoAcceptedFilterFilterOptions = [
  {
    label: "Both",
    value: "both"
  },
  {
    label: "True",
    value: true
  },
  {
    label: "False",
    value: false
  }
];
export const clickBACONStatusFilterOptions = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Pending",
    value: "pending"
  },
  {
    label: "Approved",
    value: "approved"
  },
  {
    label: "Rejected",
    value: "rejected"
  },
  {
    label: "Synced",
    value: "synced"
  },
  {
    label: "Manually Synced",
    value: "manually_synced"
  },
  {
    label: "Rereview Requested",
    value: "re_review_requested"
  }
];
