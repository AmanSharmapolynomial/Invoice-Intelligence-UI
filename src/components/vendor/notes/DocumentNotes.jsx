import no_data from "@/assets/image/no-data.svg";
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
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ScrollText, Send } from "lucide-react";
import { useState } from "react";
import { useCreateDocumentNote } from "@/components/invoice/api";

const DocumentNotes = ({ data = [], document_uuid, isLoading }) => {
  const [note, setNote] = useState("");

  const { mutate, isPending } = useCreateDocumentNote();
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
                <ScrollText className="text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className=" bg-[#FFFFFF] font-semibold text-primary !text-sm">
              <p>View Document Notes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="!text-lg">Document Notes</SheetTitle>

          <SheetDescription className="!h-full">
            {data?.length == 0 ? (
              <div className="w-full flex h-[80vh] justify-center items-center">
                <img src={no_data} alt="" />
              </div>
            ) : (
              <div className="flex-1 !h-[80vh] flex-col gap-y-4  flex items-center justify-between">
                <div className="flex-1  2xl:min-h-[86vh]   lg:min-h-[80vh]  overflow-auto flex-col w-full ">
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
                    <>
                      {data?.data?.map(
                        ({ createdAt, fromEmail, fromName, id, notes }) => (
                          <div
                            key={id}
                            className={`${
                              fromName == "ClickBACON AI"
                                ? "justify-start"
                                : "justify-end"
                            } w-full flex  mt-4 overflow-auto gap-y-4 gap-x-1`}
                          >
                            {fromName == "ClickBACON AI" && (
                              <Avatar className="mt-0.5">
                                <AvatarImage src="https://ui-avatars.com/api/?rounded=true&name=click+BAcon&background=1e7944&color=fff" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                            )}

                            <Card className="!max-w-[80%]">
                              <CardDescription className="flex flex-col justify-end items-end ">
                                <CardHeader className="!py-2 flex justify-end !w-fit flex-row">
                                  <CardTitle className="capitalize">
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: notes
                                      }}
                                      className="!break-words leading-5"
                                    />
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="!pb-2 flex justify-end !w-fit flex-row">
                                  <p className="text-xs">
                                    {createdAt
                                      ?.split(".")?.[0]
                                      ?.split("T")
                                      ?.join(" ")}
                                  </p>
                                </CardContent>
                              </CardDescription>
                            </Card>
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            <div className="flex w-full max-w-sm items-center space-x-2 lg:h-[15vh] 2xl:h-[20vh]    ">
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
                placeholder="Type a message..."
                className="min-w- max-w-96 border border-gray-200  focus:!ring-0 focus:!outline-none"
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
              >
                {isPending ? (
                  <ReloadIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <Send />
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
