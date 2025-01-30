import { Check, GitCommitHorizontal } from "lucide-react";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CustomTooltip from "../ui/Custom/CustomTooltip";
import { Modal, ModalDescription } from "../ui/Modal";
import { useGetDocumentTimeLine } from "./api";

const LastUpdateInfo = ({ info, document_id }) => {
  const [timeline, setTimeline] = React.useState([]);
  const { mutate, isPending } = useGetDocumentTimeLine();
  const [searchParams]=useSearchParams()
  let page_number=searchParams.get("page_number")
  const [open, setOpen] = React.useState(false);
  useEffect(()=>{
     setOpen(false)
     setTimeline([])
  },[page_number])
  return (
    <div
      className="w-full   border-[#F0F0F0]  rounded-md my-4 relative"
      style={{ boxShadow: "0px 0px 8px 0px #0000001F" }}
    >
      <div
        className="flex items-center gap-x-0  absolute right-4 top-2 border h-8 w-12 justify-center cursor-pointer rounded-md"
        onClick={() => {
          mutate(document_id, {
            onSuccess: (data) => {
              setTimeline(data);
            }
          });
          setOpen(true);
        }}
      >
        <GitCommitHorizontal className="h-4 w-fit" />
        <GitCommitHorizontal className="h-4 w-fit" />
      </div>
      <p className="font-poppins font-semibold border-b text-[#000000] px-4 text-base border-[#E0E0E0] py-3 leading-6">
        Update Details
      </p>

      <div className="my-4 grid grid-cols-3 gap-x-4">
        <div className="flex justify-center flex-col items-center ">
          <p className="font-poppins font-medium text-base leading-6 text-[#222222]">
            Action
          </p>
          <p className="font-poppins font-normal text-[0.9rem] capitalize leading-6 text-[#222222]">
            {info?.action}
          </p>
        </div>

        <div className="flex justify-center flex-col items-center ">
          <p className="font-poppins font-medium text-base leading-6 text-[#222222]">
            Updated At
          </p>
          <p className="font-poppins font-normal text-[0.9rem] capitalize leading-6 text-[#222222]">
            {info?.updated_at?.split("T")?.[0]}{" "}
            {info?.updated_at?.split("T")?.[1]?.split(".")?.[0]}
          </p>
        </div>

        <div className="flex justify-center flex-col items-center ">
          <p className="font-poppins font-medium text-base leading-6 text-[#222222]">
            Updated By
          </p>
          <p className="font-poppins font-normal text-[0.9rem] capitalize leading-6 text-[#222222]">
            {info?.updated_by}
          </p>
        </div>
      </div>
      <Modal
        open={open}
        setOpen={setOpen}
        title="Update Details Info"
        className={"2xl:min-w-[80rem] md:min-w-[70rem] "}
      >
        <ModalDescription className="flex justify-center items-center flex-col w-full ">
          <div className="  h-full w-full flex justify-center items-center  ">
            <div
              className={`!relative flex  my-4 w-full !justify-between  items-start h-full bg-[#FAFAFA]`}
            >
              {timeline?.map(
                ({ order, note, reached, timestamp, state }, index) => (
                  <div
                    key={order}
                    className="relative flex w-full items-center   justify-center"
                  >
                    {/* Connecting line for all steps except the first */}
                    {index > 0 && (
                      <div
                        className={`${
                          reached && order !== length - 1 && "!bg-primary"
                        } absolute 2xl:-left-[50.1%]  xl:-left-[50.1%] lg:-left-[50.1%] -left-[5%]    top-2 h-0.5  z-10 w-full bg-[#C6C6C6]`}
                      ></div>
                    )}

                    <CustomTooltip
                      content={`${state == "Rejected" ? "Reason :- " : ""}${
                        note ? note : ""
                      }`}
                    >
                      <div className="!text-[#6F6F6F] flex flex-col !z-50 items-center font-lato text-xs font-medium">
                        <div
                          className={`${
                            reached
                              ? "bg-primary !border-primary"
                              : "border-[#C6C6C6] bg-white"
                          } flex justify-center items-center z-50 h-5 border border-[#C6C6C6] w-5 rounded-full `}
                        >
                          {reached && <Check className="text-white h-3 w-3" />}
                        </div>
                        <span className="!text-[#6F6F6F] mt-1">{state}</span>
                        <span className="!text-[#6F6F6F] mt-1">
                          {timestamp &&
                            `${timestamp
                              ?.split(".")[0]
                              ?.split("T")
                              ?.join("  ")
                              ?.split(" ")[0]
                              ?.split("-")
                              ?.reverse()
                              ?.join("/")} \u00A0\u00A0 ${timestamp
                              ?.split("T")[1]
                              ?.split(".")[0]
                              ?.split(":")
                              ?.slice(0, 2)
                              ?.join(":")}`}
                        </span>
                      </div>
                    </CustomTooltip>
                  </div>
                )
              )}
            </div>
          </div>
        </ModalDescription>
      </Modal>
    </div>
  );
};

export default LastUpdateInfo;
