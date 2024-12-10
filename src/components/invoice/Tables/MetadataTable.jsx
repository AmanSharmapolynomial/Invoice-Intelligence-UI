import CustomInput from "@/components/ui/Custom/CustomInput";
import React from "react";
const Template = ({ title, children, className }) => {
  return (
    <div className={`${className} flex flex-col gap-y-3`}>
      <p className="font-poppins  font-medium text-sm leading-5 text-[#000000]">
        {title}
      </p>
      {children}
    </div>
  );
};
const MetadataTable = ({ data }) => {
  const invoice_number =
    data?.document_metadata?.invoice_number ||
    data?.data?.[0]?.document_metadata?.invoice_number;
  return (
    <div className="w-full mt-2 border shadow-sm p-2 rounded-sm">
      <div className="grid grid-cols-3 gap-x-4">
        <Template title="Invoice Number">
          <CustomInput value={invoice_number} />
        </Template>
        <Template title="Invoice Type">
          <CustomInput />
        </Template>
        <Template title="Invoice Date">
          <CustomInput />
        </Template>
      </div>
      <div className="grid grid-cols-3 gap-x-4 mt-2">
        <Template title="Due Date">
          <CustomInput value={invoice_number} />
        </Template>
        <Template title="Vendor Name" className="col-span-2">
          <CustomInput />
        </Template>
      </div>
      <div className="grid grid-cols-1 gap-x-4 mt-2">
        <Template title="Vendor Address">
          <CustomInput value={invoice_number} />
        </Template>
      </div>
    </div>
  );
};

export default MetadataTable;
