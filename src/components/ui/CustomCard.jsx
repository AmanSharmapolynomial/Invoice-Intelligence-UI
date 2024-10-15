import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const CustomCard = ({
  Icon = <></>,
  title = "Card",
  content = "abc",
  showIcon = false,
  onClick,
  className
}) => {
  return (
    <Card className={`${className} !w-full border-border bg-white shadow-none h-[5rem] hover:bg-textColor/50 hover:border-primary`} onClick={onClick}>
      <CardHeader className="!mb-0 !pb-0">
        <CardTitle className="flex !pb-0 ">
          {showIcon && (
            <span>
              <img src={Icon} alt="" />
            </span>
          )}
          <span className="pl-2 text-foreground !font-poppins font-medium text-[1rem]">
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="!mt-0 !pt-1">
        <div className="pl-6 !text-grey !text-[0.875rem] font-normal !font-poppins  ">
          {content}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
