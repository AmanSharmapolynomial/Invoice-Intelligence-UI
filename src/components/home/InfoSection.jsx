import React from "react";

const InfoSection = () => {
  return (
    <div className=" border-b flex justify-start px-10 gap-x-24 items-center ">
      <div className="flex gap-x-4 items-center py-4 ">
        <div className="h-5 w-5 rounded-full bg-red-500 " />
        <p className="font-medium text-sm">Failed</p>
      </div>
      <div className="flex gap-x-4 items-center py-4 ">
        <div className="h-5 w-5 rounded-full bg-green-500 " />
        <p className="font-medium text-sm">Success</p>
      </div>
      <div className="flex gap-x-4 items-center py-4 ">
        <div className="h-5 w-5 rounded-full bg-yellow-500 " />
        <p className="font-medium text-sm">
          Failed Due to Different Document Category
        </p>
      </div>
      <div className="flex gap-x-4 items-center py-4 ">
        <div className="h-5 w-5 rounded-full bg-orange-500 " />
        <p className="font-medium text-sm">Failed Due to Page Missing</p>
      </div>
    </div>
  );
};

export default InfoSection;
