import no_data from "@/assets/image/no_notes.svg";
import receipt_long from "@/assets/image/receipt_long.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useAddVendorNote } from "@/components/vendor/api";
import { queryClient } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ArrowRight, Send, SendHorizonal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const VendorNotes = ({ data = [], vendor_id, isLoading }) => {
  const [note, setNote] = useState("");
  const { mutate, isPending } = useAddVendorNote();
 
  return (
    <Sheet className="">
      <SheetTrigger>
        <CustomTooltip content={"View Vendor Notes."}>
          <Button className="bg-transparent !min-h-[2.4rem]  !py-0  bg-primary border-primary w-[3rem] px-0  border-2 shadow-none text-[#000000] font-poppins font-normal text-sm relative">
            <img
              src={receipt_long}
              alt=""
              className="text-white !h-[20px] mx-4 "
            />
              {data?.length>0 && <p className="font-poppins font-normal text-xs  absolute -top-2 -right-1 w-5 h-5 flex justify-center items-center border border-primary bg-primary rounded-full text-white">{data?.length}</p>}
          </Button>
        </CustomTooltip>
      </SheetTrigger>

      <SheetContent
        style={{ boxShadow: "-4px 4px 8px 0px rgba(0, 0, 0, 0.12)" }}
        className="h-full"
      >
        <SheetHeader>
          <SheetTitle className="!text-[#222222] font-semibold font-poppins text-base leading-6 flex justify-between">
            <span>Vendor Notes</span>
            <SheetClose className="flex items-center gap-x-1 cursor-pointer">
              <span className="text-[#222222]  font-poppins font-normal text-sm leading-5">
                Collapse
              </span>
              <ArrowRight className="h-4 w-4" />
            </SheetClose>
          </SheetTitle>

          <SheetDescription className="!h-full flex justify-center items-center flex-1  ">
            {Object.keys(data)?.length == 0 ? (
              <div className="w-full flex  justify-center items-center min-h-[40rem]">
                <img src={no_data} alt="" />
              </div>
            ) : (
              <div className="flex-1 flex-col gap-y-4  flex items-center justify-between">
                <div className="flex overflow-auto flex-col gap-y-4 w-full md:max-h-[70vh] lg:max-h-[75vh] xl:max-h-[75vh] mt-2">
                  {isLoading
                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, ind) => (
                        <div
                          key={ind}
                          className="w-full flex justify-end mt-4 overflow-auto gap-y-4"
                        >
                          <Card className="flex flex-col justify-end items-end min-w-1/2">
                            <CardHeader className="!py-2 flex justify-end !w-fit flex-row">
                              <CardTitle className="capitalize">
                                {" "}
                                <Skeleton className={"w-36 h-5"} />
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="!pb-2 flex justify-end !w-fit flex-row">
                              <Skeleton className={"w-44 h-6"} />
                            </CardContent>
                          </Card>
                        </div>
                      ))
                    : data?.length > 0 &&
                      data?.map(
                        ({
                          note_uuid,
                          created_user,
                          note,
                          created_date,
                          last_modified_date
                        }) => (
                          <div
                            key={note_uuid}
                            className="w-full flex justify-start items-center pr-[2em] gap"
                          >
                            <div className=" rounded-md py-3 px-3 bg-[#F2F2F7] w-full  flex flex-col gap-y-1 ">
                              <p className="text-xs font-poppins  leading-4 text-[#2C2C2E] capitalize">
                                {created_user?.username || "Unknown"}
                              </p>
                              <p className="text-[0.9rem] text-[#2C2C2E] font-poppins leading-4 capitalize">
                                {" "}
                                {note}
                              </p>
                              <div className="flex justify-end items-center text-[#666668] text-[0.7rem] font-poppins font-normal">
                                {created_date
                                  ?.split(".")?.[0]
                                  ?.split("T")
                                  ?.join(" ")}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                </div>
              </div>
            )}
            <div className="flex w-full max-w-sm items-center space-x-2 py-1 bg-white  absolute bottom-[4rem] border-t border-t-[#E5E5EA] ">
              <Input
                type="text"
                value={note}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setNote("");
                    updateParams({ vendor_name_search: undefined });
                  } else {
                    setNote(e.target.value);
                  }
                }}
                placeholder="Start Typing..."
                onKeyDown={(e)=>e.key=="Enter"&&  mutate(
                  { vendor_id, note },
                  {
                    onSuccess: (d) => {
                      queryClient.invalidateQueries({
                        queryKey: ["vendor-notes", vendor_id]
                      });
                      toast.success(d?.message), setNote("");
                    },
                    onError: (d) => {
                      toast.error(d?.message);
                      setNote("");
                    }
                  }
                )}
                className="min-w- max-w-96 border border-b-0 placeholder:!text-[#666668] placeholder:!font-poppins border-gray-200 border-none focus:!ring-0 focus:!outline-none font-poppins font-normal text-[0.9rem] text-[#666668]"
              />
              <Button
                type="submit"
                onClick={() => {
                  mutate(
                    { vendor_id, note },
                    {
                      onSuccess: (d) => {
                        queryClient.invalidateQueries({
                          queryKey: ["vendor-notes", vendor_id]
                        });
                        toast.success(d?.message), setNote("");
                      },
                      onError: (d) => {
                        toast.error(d?.message);
                        setNote("");
                      }
                    }
                  );
                }}
                className="shadow-none bg-transparent hover:bg-transparent border-none outline-none"
              >
                {isPending ? (
                  <ReloadIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <SendHorizonal className="text-[#8E8E93] h-5 w-5" />
                )}
              </Button>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default VendorNotes;
