const ProgressBar = ({ title, currentValue, totalValue, className }) => {
  const progressValue = (currentValue / totalValue) * 100;

  return (
    <div
      className={`w-[${progressValue + 20}%] flex items-center  p-4 font-sans`}
    >
      <div className="font-semibold text-textColor/950 font-poppins text-sm dark:text-[#FFFFFF]">
        {title}
      </div>
      <div className="mx-4 w-64 h-[1.25rem] bg-gray-200 dark:bg-[#454545] rounded-full relative">
        <div
          className={`bg-primary h-full ${
            currentValue === totalValue ? "rounded-full" : "rounded-l-full"
          } flex items-center justify-center`}
          style={{ width: `${progressValue}%` }}
        >
          <span className="text-white text-xs font-normal font-poppins ">
            {currentValue && currentValue.toString()?.length == 1
              ? `0${currentValue}`
              : currentValue}
          </span>
        </div>
      </div>
      <div>
        <span className="text-textColor/950 font-medium text-sm font-poppins dark:text-[#FFFFFF]">
          Total: {totalValue}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
