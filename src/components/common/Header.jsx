import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Header = ({ title, children, className, showVC, showDeDuplication }) => {
  return (
    <div
      className={`${className} w-full min-h-16 shadow px-8 flex items-center `}
    >
      {title && <p className="text-left font-semibold text-xl ">{title}</p>}

      {children}

      <div className="flex gap-x-2 absolute right-8 items-center">
        {showDeDuplication && (
          <Link to={""} className="flex justify-end">
            <Button className=" bg-[#FFFFFF] text-black hover:bg-white/95">De Duplication</Button>
          </Link>
        )}
        {showVC && (
          <Link to={"/vendor-consolidation"} className="flex justify-end">
            <Button className=" bg-[#FFFFFF] text-black hover:bg-white/95">Vendor Consolidation</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
