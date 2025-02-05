import no_data from "@/assets/image/no_notes.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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

import { useCreateDocumentNote } from "@/components/invoice/api";
import CustomTooltip from "@/components/ui/Custom/CustomTooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  ArrowRight,
  MessageCircleMore,
  Send,
  SendHorizonal
} from "lucide-react";
import { useState } from "react";
import { formatDateTimeToReadable, formatDateToReadable } from "@/lib/helpers";

const DocumentNotes = ({ data = [], document_uuid, isLoading }) => {
  const [note, setNote] = useState("");

  const { mutate, isPending } = useCreateDocumentNote();

  return (
    <Sheet>
      <SheetTrigger>
        {" "}
        <CustomTooltip content={"View Document Notes."}>
          <Button className="bg-transparent !min-h-[2.4rem]  !py-0  bg-primary border-primary w-[3rem]  border-2 shadow-none text-[#000000] font-poppins font-normal text-sm relative">
            <MessageCircleMore className="text-white !h-[1.25rem] !w-[1.25rem] " />
            {data?.length>0 && <p className="font-poppins font-normal text-xs  absolute -top-2 -right-1 w-5 h-5 flex justify-center items-center border border-primary bg-primary rounded-full text-white">{data?.length}</p>}
          </Button>
        </CustomTooltip>
      </SheetTrigger>
      <SheetContent
        style={{ boxShadow: "-4px 4px 8px 0px rgba(0, 0, 0, 0.12)" }}
        className="h-full  max-h-[60rem]"
      >
        <SheetHeader>
          <SheetTitle className="!text-[#222222] font-semibold font-poppins text-base leading-6 flex justify-between">
            <span>Document Notes</span>
            <SheetClose className="flex items-center gap-x-1 cursor-pointer">
              <span className="text-[#222222]  font-poppins font-normal text-sm leading-5">
                Collapse
              </span>
              <ArrowRight className="h-4 w-4" />
            </SheetClose>
          </SheetTitle>
          <SheetDescription className="!h-full flex justify-center items-center flex-1  ">
            {Object.keys(data)?.length == 0 ? (
              <div className="w-full flex  min-h-[40rem] justify-center items-center">
                <img src={no_data} alt="" />
              </div>
            ) : (
              <div className="flex-1  flex-col gap-y-4  flex items-center justify-between">
                <div className="flex-1   overflow-auto flex-col w-full ">
                  {isLoading ? (
                    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, ind) => (
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
                  ) : (
                    <div className="flex flex-col gap-y-4">
                      {data?.map(
                        ({ createdAt, fromEmail, fromName, id, notes }) => (
                          <div
                            className={`${
                              fromName == "clickBACON AI"
                                ? "justify-end"
                                : "justify-start"
                            } w-full flex gap-y-4  `}
                          >
                            <div
                              className={`${
                                fromName == "clickBACON AI"
                                  ? "bg-[#348355] !text-white mr-2 rounded-md "
                                  : "bg-[#F2F2F7] ml-4"
                              } max-w-[80%]  py-3 px-2  relative rounded-md `}
                            >
                              {fromName === "clickBACON AI" && (
                                <span className="absolute -right-2 top-0 w-[20px] h-[20px] bg-[#348355] rounded-bl-[10px] clip-triangle" />
                              )}
                              {fromName !== "clickBACON AI" && (
                                <span className="absolute -left-3 top-0 w-[20px] h-[20px] bg-[#F2F2F7] rounded-bl-[10px] clip-left-triangle" />
                              )}

                              <p
                                dangerouslySetInnerHTML={{
                                  __html: notes
                                }}
                                className="!break-words leading-5 capitalize max-w-[20rem] max-h-[15rem] overflow-hidden  !font-poppins  !font-normal !text-[0.9rem] "
                              />

                             <div className="flex items-center justify-end mt-2">
                             <p className="text-xs">
                               
                                  {formatDateTimeToReadable(createdAt)}
                              </p>
                             </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex w-full max-w-sm items-center space-x-2 py-1   absolute bottom-[4rem] border-t border-t-[#E5E5EA] ">
              <Input
                type="text"
                value={note}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setNote("");
                  } else {
                    setNote(e.target.value);
                  }
                }}
                onKeyDown={(e)=>e.key=="Enter"&&  mutate(
                  { document_uuid, note },
                  {
                    onSuccess: () => {
                      setNote("");
                    }
                  }
                )}
                placeholder="Start Typing..."
                className="min-w- max-w-96 border border-b-0 placeholder:!text-[#666668] placeholder:!font-poppins border-gray-200 border-none focus:!ring-0 focus:!outline-none font-poppins font-normal text-[0.9rem] text-[#666668]"
              />
              <Button
                type="submit"
                onClick={() => {
                  mutate(
                    { document_uuid, note },
                    {
                      onSuccess: () => {
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

export default DocumentNotes;
