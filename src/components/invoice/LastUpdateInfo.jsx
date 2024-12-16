import React from "react";

const LastUpdateInfo = ({ info }) => {
  return (
    <div
      className="w-full   border-[#F0F0F0]  rounded-md my-4"
      style={{ boxShadow: "0px 0px 8px 0px #0000001F" }}
    >
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
    </div>
  );
};

export default LastUpdateInfo;
