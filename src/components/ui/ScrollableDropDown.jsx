import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { makeKeyValueFromKey } from "@/lib/helpers";
import { Button } from "./button";

const ScrollableDropDown = ({
  children,
  placeholder = "Select",
  triggerClassName = "",
  scrollableClassName = "",
  contentClassName = "",
  data = [],
  onButtonClick,
  onItemClick,
  showRemoveButton = true
}) => {
  let myData = makeKeyValueFromKey(data);
  myData.pop();
  let modifiedData = myData;

  return (
    <Select>
      <SelectTrigger
        className={`${triggerClassName} min-w-[180px] w-full focus:!border-none focus:ring-0 !border `}
      >
        <SelectValue placeholder={modifiedData?.[0]?.label || placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        <ScrollArea
          className={`${scrollableClassName} max-h-[200px]  overflow-auto min-w-[350px] h-fit rounded-sm text-sm !bg-transparent`}
        >
          {children}

          {modifiedData?.map(({ label, value }, index) => (
            <div
              key={index}
              className="bg-gray-100 p-2 px-2 my-1 flex justify-between items-center "
            >
              <p
                onClick={() => {
                  onItemClick({ label, value });
                }}
              >
                {label}
              </p>
              {showRemoveButton && (
                <Button
                  className={"h-8 font-normal"}
                  onClick={() => {
                    onButtonClick({ label, value });
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export default ScrollableDropDown;
