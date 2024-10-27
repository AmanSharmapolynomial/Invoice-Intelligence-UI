import no_data from "@/assets/image/no-data.svg";
import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import BreadCrumb from "@/components/ui/Custom/BreadCrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import {
  useCombineVendors,
  useGetSimilarVendors
} from "@/components/vendor/api";
import { usePersistStore } from "@/components/vendor/store/persisitStore";
import { combineVendorsHeaders } from "@/constants";
import {
  findVendorIdByVendorName,
  formatCombineVendorsArray
} from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import persistStore from "@/store/persistStore";
import { Eye, Merge, Search, X } from "lucide-react";
import { useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import receipt from "@/assets/image/receipt.svg";
const CombineVendors = () => {
  const { vendor_id } = useParams();
  const navigate = useNavigate();
  const updateParams = useUpdateParams();
  const [searchParams] = useSearchParams();
  const pathname = useLocation();
  const similarity_value = searchParams.get("similarity") || 1;
  const actual_vendor_name = searchParams.get("vendor_name") || "";
  const { mutate, isPending } = useCombineVendors();
  const { data, isLoading, isError } = useGetSimilarVendors({
    vendor_id,
    similarity: similarity_value
  });
  const [similarity, setSimilarity] = useState([similarity_value]);
  const [checkedVendors, setCheckedVendors] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const handleCheckedChange = (value, vendor_id, vendor_name) => {
    if (value == true) {
      setCheckedVendors([
        ...checkedVendors,
        {
          vendor_id,
          vendor_name
        }
      ]);
    } else {
      let fil = checkedVendors?.filter((item) => item?.vendor_id !== vendor_id);
      setCheckedVendors(fil);
    }
  };

  const { actualVendorName } = usePersistStore();
  const { vendorNames } = persistStore();
  const selectAllVendors = (val) => {
    let temp = [];
    formatCombineVendorsArray(data?.["data"])?.map((it) => {
      temp.push({ vendor_name: it?.vendor_name, vendor_id: it?.vendor_id });
    });
    if (val == false) {
      setCheckedVendors([]);
    } else {
      setCheckedVendors(temp);
    }
  };
  console.log(checkedVendors);
  return (
    <div className="h-screen !overflow-hidden " id="maindiv">
      <Navbar className="" />

      <Layout className={"mx-6 box-border flex flex-col gap-y-4 mt-2  "}>
        <BreadCrumb
          crumbs={[
            {
              path: `/vendor-details/${findVendorIdByVendorName(
                vendorNames,
                actualVendorName
              )}`,
              label: `${actualVendorName}`
            },
            { path: "", label: `Similar Vendors` }
          ]}
        />
        <div className="w-full flex justify-between items-center px-3">
          <p className="font-poppins  font-semibold text-xl">Combine Vendors</p>
          <Button
            type="submit"
            disabled={isPending || checkedVendors?.length == 0}
            className="font-poppins !font-normal text-xs p-0 rounded-sm px-3  h-10 flex items-center  gap-x-2"

            onClick={() => {
              let data = checkedVendors?.reduce((acc, item) => {
                acc.push(item?.vendor_id);
                return acc;
              }, []);
              mutate(
                { vendor_id, data },
                {
                  onSuccess: () => {
                    setCheckedVendors([]);
                  }
                }
              );
            }}
          >
            <Merge className="h-4 w-4"/>
            {isPending ? "Combining..." : "Combine"}
          </Button>
        </div>
        <div className="w-full  flex justify-between  items-center py-2 gap-x-4 overflow-auto px-3 !min-h-16 relative">
          <div className="flex gap-x-2 items-center ">
            <p className="flex gap-x-1 items-center">
              <span className="font-poppins font-medium text-sm text-[#000000]">
                Actual Vendor Name :
              </span>
              <span className="font-poppins font-medium text-sm text-[#000000] capitalize">
                {actualVendorName}
              </span>
            </p>
          </div>
          <div className="w-full flex gap-x-4 items-center max-w-md">
            <p className="flex gap-x-1 !font-poppins !font-medium  !text-sm !text-textColor/950">
              {" "}
              <span className="!font-poppins !font-medium  !text-sm !text-textColor/950">
                {" "}
                Similarity
              </span>
              :
              <span className="!font-poppins !font-medium  !text-sm !text-textColor/950">
                {similarity[0]}
              </span>
            </p>
            <div className="w-full justify-center flex flex-col items-center gap-y-2">
              <Slider
                defaultValue={similarity}
                max={100}
                step={1}
                className="cursor-pointer"
                onValueChange={(val) => setSimilarity(val)}
              />
            </div>
            <Button
              type="submit"
              className="p-0"
              onClick={() => {
                updateParams({ similarity: similarity });
              }}
            >
              <Search className="h-4 w-10" />
            </Button>
          </div>
        </div>
        {checkedVendors?.length > 0 && (
          <div className="w-full overflow-auto">
            {checkedVendors?.length > 0 && (
              <div className="w-full flex items-center ">
                <p className="font-medium text-sm  text-grey font-poppins ">
                  Selected Vendor Names :{" "}
                </p>
                <div className="!max-w-[87vw]  overflow-auto flex gap-x-1 items-center ml-2">
                  {checkedVendors?.map(({ vendor_id, vendor_name }) => (
                    <div
                      key={vendor_id}
                      className="border capitalize p-0.5 px-2 min-w-fit gap-x-1 text-grey font-poppins text-xs border-[#E0E0E0] rounded-md flex items-center justify-center  "
                    >
                      <span>{vendor_name}</span>
                      <span
                        className="cursor-pointer"
                        onClick={() =>
                          handleCheckedChange(false, vendor_id, vendor_name)
                        }
                      >
                        <X className="h-3 w-4" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <Table className="max-h-[65vh] border-none">
          <TableRow className="flex w-full justify-around sticky top-0 !z-50 !border-none">
            {combineVendorsHeaders?.map(({ label, value }) => (
              <TableHead
                key={value}
                className={`${
                  value == "vendor_id"
                    ? "!justify-start pl-4 !flex"
                    : " justify-center"
                } !w-1/4 flex  !text-left  items-center gap-x-4  text-base    bg-[#FFFFFF] !text-gray-800      !border-none`}
              >
                <span>
                  {label == "Vendor Name" && (
                    <Checkbox
                      className={` !rounded-[2px] border-[1.8px] border-grey checked:!border-none`}
                      checked={
                       !isLoading && checkedVendors?.length ==
                        formatCombineVendorsArray(data?.data)?.length
                      }
                      onCheckedChange={(val) => {
                        selectAllVendors(val);
                      }}
                    />
                  )}
                </span>{" "}
                <span className="!font-semibold">{label}</span>
              </TableHead>
            ))}
          </TableRow>

          {/* <TableBody> */}

          {isLoading ? (
            <div className="!w-full max-h-[65vh]">
              {new Array(15).fill(10)?.map((_, index) => (
                <TableRow
                  className="flex w-full justify-between min-h-10 py-2"
                  key={index}
                >
                  {["a", "b", "c", "d", "e"]?.map((_, i) => {
                    return (
                      <TableHead
                        key={i}
                        className={`${
                          _ == "a" && "!justify-start pl-4"
                        } flex  !text-left items-center justify-center  w-1/4 pb-4 !font-semibold !bg-transparent !min-w-40 border-b  `}
                      >
                        {" "}
                        <Skeleton className={"w-44 h-5"} />
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </div>
          ) : (
            <>
              <div className="!w-full max-h-[65vh] ">
                {data && Object?.keys(data?.["data"])?.length > 0
                  ? formatCombineVendorsArray(data?.["data"])?.map(
                      ({
                        vendor_id,
                        human_verified,
                        documents_count,
                        matching_score,
                        vendor_name
                      }) => (
                        <TableRow
                          key={vendor_id}
                          className="flex w-full justify-between border-none space-y-2"
                        >
                          <TableCell className="flex font-poppins text-sm text-[#000000]  !text-left !justify-start w-1/4 !items-center gap-x-4 pl-4  !font-normal  !capitalize  ">
                            <span className="-mt-0.5">
                              {" "}
                              <Checkbox
                                className={`${
                                  checkedVendors?.some(
                                    (it) => it.vendor_id == vendor_id
                                  ) && "!border-primary"
                                } !rounded-[2px] border-[1.8px] border-grey checked:!border-none`}
                                checked={checkedVendors?.some(
                                  (it) => it.vendor_id == vendor_id
                                )}
                                onCheckedChange={(val) => {
                                  handleCheckedChange(
                                    val,
                                    vendor_id,
                                    vendor_name
                                  );
                                }}
                              />
                            </span>
                            <span className="-mt-1"> {vendor_name}</span>
                          </TableCell>
                          <TableCell className=" font-poppins text-sm text-[#000000]   !text-left justify-center  w-1/4 items-center gap-x-4   !font-normal flex    !capitalize  ">
                            {documents_count}
                          </TableCell>
                          <TableCell className="flex font-poppins text-sm text-[#000000]   !text-left justify-center w-1/4 items-center gap-x-4   !font-normal   !capitalize  ">
                            {matching_score}
                          </TableCell>
                          <TableCell className="flex font-poppins text-sm text-[#000000] pl-6 !text-left justify-center w-1/4 items-center gap-x-4   !font-normal !capitalize  ">
                            <img
                              className="cursor-pointer"
                              src={receipt}
                              alt=""
                              onClick={() => {
                                navigate(
                                  `/vendor-consolidation/compare-invoices/${actualVendorName}/${vendor_name}`
                                );
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )
                  : isError && (
                      <div className="flex justify-center flex-col items-center h-full !w-[95vw] !overflow-hidden">
                        <img
                          src={no_data}
                          alt=""
                          className="flex-1 !max-h-[60vh] "
                        />
                      </div>
                    )}
              </div>
              {data && Object?.keys(data?.["data"])?.length === 0 && (
                <div className="flex justify-center flex-col items-center h-full !w-[95vw] !overflow-hidden">
                  <img src={no_data} alt="" className="flex-1 !max-h-[60vh] " />
                </div>
              )}
            </>
          )}
        </Table>
      </Layout>
    </div>
  );
};

export default CombineVendors;
