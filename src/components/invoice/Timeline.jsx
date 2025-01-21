import { Check } from "lucide-react";
import React from "react";
import CustomTooltip from "../ui/Custom/CustomTooltip";

const Timeline = ({ timeline }) => {
  const styling = `grid-cols-${timeline?.length}`;

  return (
    <div
      className={`!relative flex  my-4 w-full !justify-between  items-start h-full bg-[#FAFAFA]`}
    >
      {timeline?.map(({ order, note, reached, timestamp, state }, index) => (
        <div key={order} className="relative flex w-full items-center  ">
          {/* Connecting line for all steps except the first */}
          {index > 0 && (
            <div
              className={`${
                reached && order !== length - 1 && "!bg-primary"
              } absolute 2xl:-left-[89.1%]  xl:-left-[82.1%] lg:-left-[80.1%] -left-[5%]    top-2 h-0.5  z-10 w-full bg-[#C6C6C6]`}
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
      ))}
    </div>
  );
};

export default Timeline;
