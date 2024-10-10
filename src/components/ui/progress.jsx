import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef(
  (
    {
      className,
      totalValue=1,
      innerClassName,
      label,
      innerText,
      value=1,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min((value / totalValue) * 100, 100); // Calculate percentage
    return (
      <ProgressPrimitive.Root
        ref={ref}
        max={totalValue}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(innerClassName, "h-full bg-primary transition-all")}
          style={{ width: `${percentage}%` }} // Set width based on percentage
        >
          {innerText && <p className="text-black">{innerText}</p>}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = "Progress"; // Update display name for better debugging

export { Progress };
