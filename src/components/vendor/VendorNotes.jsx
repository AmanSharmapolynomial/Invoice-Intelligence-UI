import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { queryClient } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { NotebookIcon, Send } from "lucide-react";
import { memo, useState } from "react";
import toast from "react-hot-toast";
import { useAddVendorNote } from "./api";

const VendorNotes = ({ data = [], vendor_id }) => {
  
  const [note, setNote] = useState("");
  const { mutate, isPending } = useAddVendorNote();
  return (
    <Sheet className="relative">
      <SheetTrigger>
        {" "}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <Button
                className={" bg-[#FFFFFF] !w-fit hover:bg-[#FFFFFF] px-2"}
              >
                <NotebookIcon className="text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className=" bg-[#FFFFFF] font-semibold text-primary !text-sm">
              <p>View Vendor Notes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="!text-lg">Vendor Notes</SheetTitle>
          <SheetDescription className="!h-full">
            <div className="flex-1 !h-[90vh] flex-col gap-y-4  flex items-center justify-between">
              <div className="flex-1  2xl:min-h-[86vh]   lg:min-h-[80vh]  overflow-auto flex-col w-full ">
                {data?.data?.map(
                  ({
                    note_uuid,
                    created_user,
                    note,
                    created_date,
                    last_modified_date
                  }) => (
                    <div
                      key={note_uuid}
                      className="w-full flex justify-end mt-4 overflow-auto gap-y-4"
                    >
                      <Card className="flex flex-col justify-end items-end min-w-1/2">
                        <CardHeader className="!py-2 flex justify-end !w-fit flex-row">
                          <CardTitle className="capitalize">{note}</CardTitle>
                        </CardHeader>
                        <CardContent className="!pb-2 flex justify-end !w-fit flex-row">
                          <p className="text-xs">
                            {created_date
                              ?.split(".")?.[0]
                              ?.split("T")
                              ?.join(" ")}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )
                )}
              </div>

              <div className="flex w-full max-w-sm items-center space-x-2 h-[10vh]    ">
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
                  placeholder="Type a message..."
                  className="min-w- max-w-96 border border-gray-200  focus:!ring-0 focus:!outline-none"
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
                >
                  {isPending ? (
                    <ReloadIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send />
                  )}
                </Button>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default memo(VendorNotes);
