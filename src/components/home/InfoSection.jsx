import React from "react";

const InfoSection = () => {
  return (
    <div className=" flex justify-start   gap-x-4 items-center overflow-auto  w-full dark:text-[#FFFFFF] ">
      <div className="flex gap-x-2 items-center py-4 ">
        <div className="h-[0.88rem] w-[0.88rem]  bg-primary " />
        <p className="text-[#1C1C1E] text-sm font-poppins font-normal dark:text-[#FFFFFF]">Success</p>
      </div>
      <div className="flex gap-x-2 items-center py-4 ">
        <div className="h-[0.88rem] w-[0.88rem]  bg-[#F15156] " />
        <p className="text-[#1C1C1E] text-sm font-poppins font-normal dark:text-[#FFFFFF]">Failed</p>
      </div>
      <div className="flex gap-x-2 items-center py-4 ">
          <div className="h-[0.88rem] w-[0.88rem]  bg-[#FFA654]" />
        <p className="text-[#1C1C1E] text-sm font-poppins font-normal dark:text-[#FFFFFF]">
          Failed Due to Different Document Category
        </p>
      </div>
      <div className="flex gap-x-2 items-center py-4 ">
          <div className="h-[0.88rem] w-[0.88rem]  bg-[#FFEF00] " />
        <p className="text-[#1C1C1E] text-sm font-poppins font-normal dark:text-[#FFFFFF]">Failed Due to Page Missing</p>
      </div>
    </div>
  );
};

export default InfoSection;
