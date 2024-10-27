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
      className={`${className} !w-full border-border bg-white shadow-none h-[5rem] hover:bg-textColor/50 dark:bg-[#051C14] dark:border-textColor/800 hover:border-primary`}
      onClick={onClick}
    >
      <CardHeader className="!mb-0 !pb-0">
        <CardTitle className="flex !pb-0 ">
          {showIcon && (
            <span>
              <img src={Icon} alt="" className="dark:hidden " />
              <Terminal className="dark:flex hidden h-4 w-4" />
            </span>
          )}
          <span className="pl-2 text-foreground !font-poppins font-medium text-[1rem] dark:text-[#FFFFFF]">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="!mt-0 !pt-1">
        <div className="pl-6 !text-grey !text-[0.875rem] font-normal !font-poppins  dark:text-textColor/200 ">
          {content}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
