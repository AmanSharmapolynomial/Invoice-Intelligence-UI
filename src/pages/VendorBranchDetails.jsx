import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useGetVendorBranchDetails } from "@/components/vendor/api";
import { Search } from "lucide-react";

import CustomSelect from "@/components/ui/CustomSelect";
import { SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { vendorBranchDetailsPageFirstColRowData } from "@/constants";
import { makeKeyValueFromKey } from "@/lib/helpers";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";

const VendorBranchDetails = () => {
  const { branch_id } = useParams();
  const queryClient=new QueryClient()
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetVendorBranchDetails(branch_id);
  const [dropDownSearch, setDropDownSearch] = useState("");
  const [filteredDropDownItems, setFilteredDropDownItems] = useState(
    makeKeyValueFromKey(data?.data?.["vendor_address_synonyms"])
  );
console.log(data)
  return (
    <>
      <Navbar className="" />

      <Layout className={"mx-10 box-border overflow-auto pb-8"}>
        <Header
          title={`Vendor Branch  ${
            data?.data?.vendor_name
              ? "Deatils for" + data?.data?.vendor_name
              : ""
          }`}
          className="border mt-10 rounded-t-md !shadow-none bg-primary !text-[#FFFFFF] relative "
        >
          <Progress
            innerClassName="border-primary  !bg-white/85 "
            value={33}
            className="w-72 absolute right-4 h-4 bg-white/15 "
          />
        </Header>
        <div className="w-full border flex justify-between p-4 gap-x-4 overflow-auto">
          <div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setSearchTerm("");
                    // updateParams({ vendor_name_search: undefined });
                  } else {
                    setSearchTerm(e.target.value);
                  }
                }}
                placeholder="Search vendor address"
                className="min-w-72 max-w-96 border border-gray-200  focus:!ring-0 focus:!outline-none"
              />
              <Button
                type="submit"
                onClick={() => {
                  //   updateParams({ vendor_name_search: searchTerm });
                }}
              >
                <Search />
              </Button>
            </div>
          </div>
          <div className="flex gap-x-2">
            <Button>Save</Button>
            <Button className="bg-red-600 hover:bg-red-600/90">Delete</Button>
          </div>
        </div>
        <Table className="flex flex-col   box-border  scrollbar !w-full ">
          <TableRow className="flex  text-base  !border-none  ">
            <div className="!min-w-[50%]">
              <TableHead className="flex  border-r !text-left items-center justify-start pl-[5%] !font-semibold !text-gray-800  border-b   bg-gray-200 h-14">
                Field Name
              </TableHead>
              {vendorBranchDetailsPageFirstColRowData.map(
                ({ label, value }) => (
                  <TableCell
                    key={label}
                    className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14"
                  >
                    {label}
                  </TableCell>
                )
              )}
            </div>
            <div className="!min-w-[50%]">
              <TableHead className="flex  border-r !text-left items-center justify-start pl-[5%] !font-semibold !text-gray-800  border-b  !min-h-14 bg-gray-200 h-14">
                Field Value
              </TableHead>

              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
             <Input value=   {data?.data?.["vendor_address"]}
             onChange={(e)=>{

             }}
             />
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14 ">
                {data?.data?.created_date?.split("T")?.[0]}
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                {data?.data?.["last_modified_date"]?.split("T")?.[0]}
              </TableCell>

              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                <Switch  value={data?.data?.["human_verified"]} onCheckedChange={(val)=>{
                const copyObj=JSON.parse(JSON.stringify(data))
                copyObj.data['human_verifed']=val;
                queryClient.setQueryData(['vendor-branch-details'],copyObj)
                  console.log(data)
              
                }} />
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                {data?.data?.["document_count"]}
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                {data?.data?.["vendor_city"]}
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                {data?.data?.["vendor_phone_number"]}
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                {data?.data?.["vendor_state"]}
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                {data?.data?.["vendor_street"]}
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                {data?.data?.["vendor_zip_code"]}
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                <CustomSelect
                  showCustomContent={true}
                  placeholder={
                    makeKeyValueFromKey(
                      data?.data?.["vendor_address_synonyms"]
                    )?.[0]?.label
                  }
                  placeholderClassName={"font-normal"}
                  onSelect={(val) => {}}
                  data={makeKeyValueFromKey(
                    data?.data?.["vendor_address_synonyms"]
                  )}
                  className={"!min-w-fit"}
                >
                  <Input
                    placeholder="Search Vendor Address Synonym"
                    value={dropDownSearch}
                    onChange={(e) => {
                      setDropDownSearch(e.target.value);
                      let fil = makeKeyValueFromKey(
                        data?.data?.["vendor_address_synonyms"]
                      )?.filter((item) =>
                        item?.label?.includes(e.target.value)
                      );
                      setFilteredDropDownItems(fil);
                    }}
                  />
                  <div className="py-1">
                    {data && filteredDropDownItems?.length>0?
                      filteredDropDownItems?.map(({ label, value }) => (
                        <SelectItem key={value} value={value} className={``}>
                          {label}
                        </SelectItem>
                      )):<p className="flex justify-center">No data found.</p>}
                  </div>
                </CustomSelect>
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                {data?.data?.["vendor_id"]}
              </TableCell>
              <TableCell className="flex  !text-left items-center justify-start pl-[5%]  !font-normal !text-gray-800 !min-w-[100%] border-b border-r  !min-h-14">
                {data?.data?.["branch_id"]}
              </TableCell>
            </div>
          </TableRow>
        </Table>
      </Layout>
    </>
  );
};

export default VendorBranchDetails;
