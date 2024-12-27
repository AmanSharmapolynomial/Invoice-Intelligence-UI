export const vendorCategories = [
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
    value: true
  },
  {
    label: "Human Verification Not Required",
    value: false
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
  },
  {
    label: "None",
    value: "none"
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
    label: "Undetected",
    value: "Undetected"
  }
];
export const InvoiceReRunStatusFilterOptions = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Rerun",
    value: true
  },
  {
    label: "Not Rerun",
    value: false
  }
];
export const AutoAcceptedFilterFilterOptions = [
  {
    label: "All",
    value: "all"
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

export const vendorDetailsPageFirstColRowData = [
  {
    label: "Vendor Id",
    value: "vendor_id"
  },
  {
    label: "Vendor Name",
    value: "vendor_name"
  },
  {
    label: "Human Verified",
    value: "human_verified"
  },
  {
    label: "Auto Approve Invoices",
    value: "auto_approve_invoices"
  },
  {
    label: "Vendor Branches Count",
    value: "vendor_id"
  },
  {
    label: "Verified Branches Count",
    value: "verified_branch_count"
  },
  {
    label: "Total Items",
    value: "items_count"
  },
  {
    label: "Vendor Category",
    value: ""
  },
  {
    label: "Account Category",
    value: ""
  },
  {
    label: "Vendor Name Synonyms",
    value: "vendor_name_synonyms"
  },
  {
    label: "Vendor Document Type",
    value: "vendor_document_type"
  }
];

export const vendorBranchesHeaders = [
  {
    label: "Vendor Address",
    value: "vendor_address"
  },
  {
    label: "Document Count",
    value: "document_count"
  },
  {
    label: "Created Date",
    value: "created_date"
  },
  {
    label: "Select Master",
    value: ""
  },
  {
    label: "Select For Merge",
    value: ""
  },
  {
    label: "Migrate",
    value: ""
  },
  {
    label: "View Invoice",
    value: ""
  },
  {
    label: "Edit",
    value: ""
  },
  {
    label: "Delete",
    value: ""
  }
];

export const vendorBranchDetailsPageFirstColRowData = [
  {
    label: "Vendor Address",
    value: "vendor_address"
  },
  {
    label: "Creation Date",
    value: "created_date"
  },
  {
    label: "Last Modified Date",
    value: "last_modified_date"
  },
  {
    label: "Human Verified",
    value: "human_verified"
  },
  {
    label: "Document Count",
    value: "document_ount"
  },
  {
    label: "Vendor City",
    value: "vendor_city"
  },

  {
    label: "Vendor Phone Number",
    value: "vendor_phone_number"
  },
  {
    label: "Vendor State",
    value: "vendor_state"
  },
  {
    label: "Vendor Street",
    value: "vendor_street"
  },
  {
    label: "Vendor Zip Code",
    value: "vendor_zip_code"
  },
  {
    label: "Vendor Name Synonyms",
    value: "vendor_name_synonyms"
  },
  // {
  //   label: "Vendor Id",
  //   value: "vendor_id"
  // },
  // {
  //   label: "Branch Id",
  //   value: "branch_id"
  // }
  {
    label: "Verified By",
    value: "verified_by"
  },
  {
    label: "Updated By",
    value: "updated_by"
  }
];

export const vendorConsolidationHeaders = [
  {
    label: "Vendor Name",
    styling: "min-w-60 justify-start pl-6"
  },
  {
    label: "Vendor Category",
    styling: "min-w-60 justify-start pl-6"
  },
  {
    label: "Creation Date",
    styling: "min-w-36 pl-4"
  },
  {
    label: "Document Count",
    styling: "min-w-40 pl-4"
  },
  {
    label: "Branch Count",
    styling: "min-w-40 justify-center"
  },
  {
    label: "Verified Branch Count",
    styling: "min-w-48 justify-center"
  },
  {
    label: "Item Count",
    styling: "min-w-40  justify-center"
  },
  {
    label: "Verified Item Count",
    styling: "min-w-48 justify-center"
  },
  {
    label: "Verified By",
    styling: "min-w-44 justify-center"
  },
  {
    label: "Actions",
    styling: "min-w-44 justify-center "
  }
];

export const invoiceTableHeaders = [
  {
    label: "Invoice #",
    styling: "w-[11.11%]  justify-start"
  },

  {
    label: "Restaurant",
    styling: "!w-[11.11%]  !justify-start"
  },
  {
    label: "Vendor",
    styling: "!w-[11.11%]"
  },
  {
    label: "Load Date",
    styling: "w-[11.11%] !justify-start !pl-[3%]"
  },
  {
    label: "Due Time",
    styling: "w-[11.11%] justify-start !pl-[1rem]"
  },
  {
    label: "Invoice Status",
    styling: "w-[11.11%] justify-center"
  },

  {
    label: "clickBACON Status",
    styling: "w-[11.11%] !text-center "
  },


  {
    label: "Invoice Type",
    styling: "min-w-[11.11%] justify-start pl-3"
  },
  {
    label: "Human Verification Date",
    styling: "min-w-[11.11%] justify-center text-center"
  }
];

export const rawMetaDataHeaders = [
  {
    label: "Invoice Number",
    value: "invoice_number"
  },
  {
    label: "Invoice Type",
    value: "invoice_type"
  },
  {
    label: "Invoice Date",
    value: "invoice_date"
  },
  {
    label: "Due Date",
    value: "invoice_due_date"
  },
  {
    label: "Invoice Total",
    value: "invoice_extracted_total"
  },
  {
    label: "Invoice Balance Due",
    value: "invoice_balance_due"
  },
  {
    label: "Restaurant Name",
    value: "restaurant"
  },
  {
    label: "Vendor Name",
    value: "vendor_name"
  },
  {
    label: "Vendor Address",
    value: "vendor_address"
  },
  {
    label: "Vendor Phone Number",
    value: "vendor_phone_number"
  },
  {
    label: "Document Type Prediction",
    value: "document_type"
  },
  {
    label: "Verdict",
    value: ""
  },
  {
    label: "Concerns",
    value: ""
  },
  {
    label: "Human Verification Required",
    value: "human_verification_required"
  },
  {
    label: "Quick Books Document TYpe",
    value: "quick_book_document_type"
  },
  {
    label: "Taxes Added",
    value: "added_taxes"
  },
  {
    label: "Fees Added",
    value: "added_fees"
  },
  {
    label: "Invoice Payment Terms",
    value: "invoice_payment_terms"
  },
  {
    label: "Credit Card Name",
    value: "credit_card_name"
  },
  {
    label: "Credit Card Number",
    value: "credit_card_number"
  },
  {
    label: "Invoice Ship To",
    value: "invoice_ship_to"
  },
  {
    label: "Invoice Bill To",
    value: "invoice_bill_to"
  },
  {
    label: "Invoice Sold To",
    value: "invoice_sold_to"
  },
  {
    label: "Total No. of Pages Received",
    value: "total_number_of_pages_received"
  },
  {
    label: "Invoice Total From Table",
    value: "total_from_table"
  },
  {
    label: "Invoice UUID",
    value: "document_uuid"
  },
  {
    label: "Version",
    value: "version"
  },
  {
    label: "Rerun Status",
    value: "rerun_status"
  }
];

export const tableTabs = [
  {
    label: "Metadata",
    value: "metadata"
  },
  {
    label: "Raw Table",
    value: "raw_table"
  },
  {
    label: "Processed Table",
    value: "processed_table"
  },
  {
    label: "Combined Table",
    value: "combined_table"
  },
  {
    label: "Human Verification",
    value: "human_verification"
  }
];

export const quickBooksDocumentTypes = [
  {
    label: "Expense",
    value: "Expense"
  },
  {
    label: "Invoice",
    value: "Invoice"
  },
  {
    label: "Bill",
    value: "Bill"
  },
  {
    label: "Credit Memo",
    value: "Credit Memo"
  },
  {
    label: "Vendor Credit",
    value: "Vendor Credit"
  },
  {
    label: "Check",
    value: "Check"
  }
];

export const documentTypePrediction = [
  {
    label: "Receipt",
    value: "Receipt"
  },
  {
    label: "Invoice",
    value: "Invoice"
  }
];

export const editableFieldsForInvoiceMetadata = [
  "invoice_date",
  "invoice_number",
  "invoice_type",
  "vendor_address",
  "credit_card_number",
  "credit_card_name",
  "invoice_sold_to",
  "invoice_bill_to",
  "invoice_ship_to",
  "quick_book_document_type",
  "document_type",
  "vendor_name",
  "invoice_due_date"
];

export const combineVendorsHeaders = [
  {
    label: "Vendor Name",
    value: "vendor_id"
  },
  {
    label: "Documents Count",
    value: "documents_count"
  },
  {
    label: "Matching Score",
    value: "matching_score"
  },
  {
    label: "Compare Invoices",
    value: "invoice"
  }
];

export const invoiceDetailsTabs=[
  {
    label:"Metadata",
    value:"metadata"
  },
  {
    label:"Combined Table",
    value:"combined-table"
  },
  {
    label:"Human Verification",
    value:"human-verification"
  },
]