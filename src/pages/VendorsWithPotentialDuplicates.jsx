import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import TablePagination from "@/components/common/TablePagination";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import CustomDropDown from "@/components/ui/CustomDropDown";
import {
  useGetVendorsHavingDuplicatesList,
  useGetVendorsWithPotentialDuplicates
} from "@/components/vendor/potentialDuplicates/api";
import PotentialDuplicatesTable from "@/components/vendor/potentialDuplicates/PotentialDuplicatesTable";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { useNavigate, useSearchParams } from "react-router-dom";

const VendorsWithPotentialDuplicates = () => {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  const navigate = useNavigate();
  let page = searchParams.get("page") || 1;
  let page_size = searchParams.get("page_size") || 10;
  let vendor_id = searchParams.get("vendor_id");
  const { data, isLoading } = useGetVendorsWithPotentialDuplicates({
    page,
    page_size,
    vendor_id
  });
  const { data: vendorsList, isLoading: loadinVendorsList } =
    useGetVendorsHavingDuplicatesList();
  const vendorsWithDuplicatesFormatter = (vendors) => {
    if (vendors?.length > 0) {
      return vendors?.map((v) => {
        let obj = {
          label: v?.vendor?.vendor_name,
          value: v?.vendor?.vendor_id,
          human_verified: v?.vendor?.human_verified,
          count: v?.duplicate_findings_count
        };
        return obj;
      });
    } else {
      return [];
    }
  };

  const columns = [
    {
      label: "Vendor Name",
      key: "verified_vendor[vendor_name]"
    },

    {
      label: "Duplicate Vendor",
      key: "potential_duplicate_vendor[vendor_name]"
    },
    {
      label: "Similarity",
      key: "similarity_score"
    },

    {
      label: "Match Reason",
      key: "match_reason"
    }
  ];

  return (
    <div className="overflow-hidden flex w-full">
      <Sidebar />

      <div className="w-full ml-12">
        <Navbar />
        <Layout>
          <BreadCrumb
            title="Vendors with Potential Duplicates"
            crumbs={[
              { path: null, label: "Vendors with Potential Duplicates" }
            ]}
          />
          <div className="flex items-center gap-x-2 justify-end">
            {/* <div className="flex items-center gap-x-3">
              <Button
                className=" font-poppins font-normal rounded-sm text-sm"
                onClick={() => {
                  navigate(`/recent-duplicate-vendor-findings`);
                }}
              >
                Recent Duplicate Vendors
              </Button>
              <CustomDropDown
                Value={vendor_id}
                placeholder="Select vendor"
                onChange={(v) => {
                  updateParams({
                    vendor_id: v
                  });
                }}
                data={vendorsWithDuplicatesFormatter(vendorsList?.data)}
              />
            </div> */}
          </div>
          <PotentialDuplicatesTable
            data={data?.data || []}
            isLoading={isLoading}
            columns={columns}
          />
          <TablePagination
            page={page}
            isFinalPage={data?.is_final_page}
            totalPages={data?.total_pages}
          />
        </Layout>
      </div>
    </div>
  );
};

export default VendorsWithPotentialDuplicates;
