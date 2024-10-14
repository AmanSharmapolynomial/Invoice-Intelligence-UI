import no_data from "@/assets/image/no-data.svg";
import Header from "@/components/common/Header";
import Layout from "@/components/common/Layout";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import {
  useCombineVendors,
  useGetSimilarVendors
} from "@/components/vendor/api";
import { usePersistStore } from "@/components/vendor/store/persisitStore";
import { combineVendorsHeaders } from "@/constants";
import { formatCombineVendorsArray } from "@/lib/helpers";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { Eye } from "lucide-react";
import { useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";

const CombineVendors = () => {
  const { vendor_id } = useParams();
  const navigate = useNavigate();
  const updateParams = useUpdateParams();
  const [searchParams] = useSearchParams();
  const pathname = useLocation();
  const similarity_value = searchParams.get("similarity") || 1;
  const actual_vendor_name = searchParams.get("vendor_name") || "";
  const { mutate, isPending } = useCombineVendors();
  const { data, isLoading ,isError} = useGetSimilarVendors({
    vendor_id,
    similarity: similarity_value
  });
  const [similarity, setSimilarity] = useState([similarity_value]);
  const [checkedVendors, setCheckedVendors] = useState([]);
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

  return (
    <>
      <Navbar className="" />

      <Layout className={"mx-10 box-border overflow-auto pb-4"}>
        <Header
          title={`Combine Vendors`}
          className="border mt-10 rounded-t-md border-primary !shadow-none bg-primary !capitalize !text-[#FFFFFF] relative "
        >
          <p>Actual Vendor Name :- {actualVendorName} </p>
        </Header>
        {checkedVendors?.length > 0 && (
          <Header className="border  rounded-t-md !shadow-none  !capitalize !text-[#FFFFFF] relative ">
            <div className="absolute left-4">
              {checkedVendors?.length > 0 && (
                <div className="w-full flex items-center ">
                  <p className="font-medium text-base text-gray-800">
                    Selected Vendor Names :-{" "}
                  </p>
                  <div className="!max-w-full  overflow-auto flex gap-x-4 items-center ml-2">
                    {checkedVendors?.map(({ vendor_id, vendor_name }) => (
                      <div
                        key={vendor_id}
                        className="border-2 px-2 min-w-fit text-gray-800 border-primary rounded-md flex items-center justify-center py-0.5 text-sm"
                      >
                        {vendor_name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Header>
        )}

        <div className="w-full border flex justify-between  items-center px-4 py-2 gap-x-4 overflow-auto !min-h-16 relative">
          {/* <div className="flex w-full max-w-sm items-center justify-between space-x-2"> */}

          <div className="w-full flex justify-center items-center max-w-xs">
            <div className="w-full justify-center flex flex-col items-center gap-y-2">
              <Slider
                defaultValue={similarity}
                max={100}
                step={1}
                className="cursor-pointer"
                onValueChange={(val) => setSimilarity(val)}
              />
            </div>
          </div>
          <p>
            {" "}
            Similarity :- <span>{similarity[0]}</span>
          </p>
          <div className="flex gap-x-2 items-center">
            <Button
              type="submit"
              disabled={isPending || checkedVendors?.length == 0}
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
              {isPending ? "Combining..." : "Combine"}
            </Button>
            <Button
              type="submit"
              onClick={() => {
                updateParams({ similarity: similarity });
              }}
            >
              Find Similar Vendors
            </Button>
          </div>
        </div>

        <Table className="max-h-[65vh] border-l">
          <TableRow className="flex w-full justify-between sticky top-0 !z-50">
            {combineVendorsHeaders?.map(({ label, value }) => (
              <TableHead
                key={value}
                className={`${
                  label == "Vendor Name"
                    ? "!justify-start pl-10"
                    : "justify-center"
                } !w-1/5 flex  border-r !text-left items-center  text-base justify-center !font-semibold !text-gray-800  border-b   bg-gray-200 h-14`}
              >
                {label}
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
                        } flex  !text-left items-center justify-center  w-1/5 pb-4 !font-semibold !text-gray-800 !min-w-40 border-b  `}
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
              <div className="!w-full max-h-[65vh]">
                {(data &&
                  Object?.keys(data?.["data"])?.length > 0 )?
                  formatCombineVendorsArray(data?.["data"])?.map(
                    ({
                      vendor_id,
                      human_verified,
                      documents_count,
                      matching_score,
                      vendor_name
                    }) => (
                      <TableRow
                        key={vendor_id}
                        className="flex w-full justify-between"
                      >
                        <TableCell className="flex  border-r !text-left justify-start w-1/5 items-center gap-x-4 pl-10  !font-normal !text-gray-800  border-b pb-4 !capitalize  ">
                          {vendor_name}
                        </TableCell>
                        <TableCell className="flex  border-r !text-left justify-center  w-1/5 items-center gap-x-4 pl-6  !font-normal !text-gray-800  border-b pb-4 !capitalize  ">
                          {documents_count}
                        </TableCell>
                        <TableCell className="flex  border-r !text-left justify-center w-1/5 items-center gap-x-4 pl-6  !font-normal !text-gray-800  border-b pb-4 !capitalize  ">
                          {matching_score}
                        </TableCell>
                        <TableCell className="flex  border-r !text-left justify-center w-1/5 items-center gap-x-4   !font-normal !text-gray-800  border-b pb-4 !capitalize  ">
                          <Eye
                            className="h-5 w-5 text-primary cursor-pointer"
                            onClick={() => {
                              navigate(
                                `/vendor-consolidation/compare-invoices/${actualVendorName}/${vendor_name}`
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell className="flex  border-r !text-left justify-center  w-1/5 items-center gap-x-4  !font-normal !text-gray-800  border-b pb-4 !capitalize  ">
                          <Checkbox
                            onCheckedChange={(val) => {
                              handleCheckedChange(val, vendor_id, vendor_name);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  ):isError && <div className="flex justify-center flex-col items-center h-full !w-[95vw] !overflow-hidden">
                  <img src={no_data} alt="" className="flex-1 !max-h-[60vh] " />
                </div>}
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
    </>
  );
};

export default CombineVendors;
