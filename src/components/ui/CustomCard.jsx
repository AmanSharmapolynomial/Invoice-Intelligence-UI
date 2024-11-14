import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Terminal } from "lucide-react";

const CustomCard = ({
  Icon = <></>,
  title = "Card",
  content = "abc",
  showIcon = false,
  onClick,
  className
}) => {
  return (
    <Card
      className={`${className} !w-full border-[#E2E8F0] bg-[#FFFFFF] shadow-none py-3  hover:bg-textColor/50 dark:bg-[#051C14] dark:border-textColor/800 hover:border-primary rounded-md`}
      onClick={onClick}
    >
      <CardHeader className=" flex justify-center items-center  w-full ">
        <CardTitle className=" flex  justify-center items-center ">
          {showIcon && (
            <span>
              <img src={Icon} alt="" className="dark:hidden " />
              <Terminal className="dark:flex hidden h-4 w-4" />
            </span>
          )}
          <span className="pl-2 text-foreground !font-poppins font-medium text-[1.2rem] dark:!text-[#FFFFFF]">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default CustomCard;
