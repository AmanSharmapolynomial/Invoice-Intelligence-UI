import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = ({ title, children, className, showVC }) => {
  return (
    <div
      className={`${className} w-full min-h-16 max-h-full shadow px-8 rounded-t-md flex items-center `}
    >
      {title && <p className="text-left font-semibold text-xl w-full">{title}</p>}
      <div className="flex gap-x-2 justify-end w-full right-8 items-center">
        {showVC && (
          <Link to={"/vendor-consolidation"} className="flex justify-end">
            <Button className=" bg-[#FFFFFF] text-black hover:bg-white/95">
              Vendor Consolidation
            </Button>
          </Link>
        )}
        {children}
      </div>
    </div>
  );
};

export default Header;
