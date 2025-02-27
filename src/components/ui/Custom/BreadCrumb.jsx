import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import home from "@/assets/image/home.svg";
import home_white from "@/assets/image/home_white.svg";
import { ArrowLeft, MoveLeft } from "lucide-react";
import useFilterStore from "@/store/filtersStore";
import { includes } from "lodash";

const BreadCrumb = ({
  crumbs = [],
  title,
  showCustom = false,
  children,
  hideTitle = false
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  let from_view = searchParams.get("from_view");
  const { filters } = useFilterStore();

  const navigator = () => {
    if (pathname == "/home") {
      navigate("/");
    }else if (pathname=="/item-master-vendors"){
      navigate("/")
    } else if (pathname=="/bulk-categorization"){
      navigate('/')
    }
    
    else if (from_view == "item-master-vendors") {
      navigate("/item-master-vendors");
    } else if (pathname == "/invoice-details/") {
      if (from_view == "review_later") {
        const newParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            newParams.set(key, value);
          }
        });
        navigate(`/review-later-tasks` + `?${newParams?.toString()}`);
      } else if (from_view == "my-tasks") {
        const newParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            newParams.set(key, value);
          }
        });
        navigate(`/my-tasks` + `?${newParams?.toString()}`);
      } else {
        const newParams = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            newParams.set(key, value);
          }
        });
        navigate(`/home` + `?${newParams?.toString()}`);
      }
    } else {
      window.history.back();
    }
  };
  return (
    <div
      className="flex w-full items-center justify-between py-3 pr-2   "
      id="bread"
    >
      <p className="text-textColor/950 font-poppins font-semibold  dark:text-[#FFFFFF] flex items-center gap-x-2">
        <ArrowLeft
          className="h-5 w-5 cursor-pointer"
          onClick={() => navigator()}
        />{" "}
        <span className="!text-xl !font-semibold font-poppins text-[#121212] dark:!text-[#FFFFFF] capitalize">
          {" "}
          {!hideTitle && (title || crumbs?.[crumbs?.length - 1]?.["label"])}
        </span>
        {showCustom && children}
      </p>
      <Breadcrumb>
        <BreadcrumbList className="flex items-center">
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="flex items-center">
              <Link to="/">
                <img src={home} alt="" className="-mt-0.5 dark:hidden" />
                <img
                  src={home_white}
                  alt=""
                  className="-mt-0.5 hidden dark:block"
                />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator
            className={"text-[#000000] dark:text-[#FFFFFF]"}
          />
          {crumbs?.map(({ label, path }, index) => {
            return (
              <>
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink asChild>
                    <Link
                      to={path}
                      className={`${
                        index == crumbs?.length - 1 &&
                        "!text-[#1E7944] dark:!text-[#1E7944]"
                      } text-[#000000] !font-poppins !font-normal capitalize text-xs dark:!text-[#FFFFFF]`}
                    >
                      {label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index !== crumbs?.length - 1 && (
                  <BreadcrumbSeparator
                    className={"dark:!text-[#FFFFFF] dark:bg-[#FFFFFF]"}
                  />
                )}
              </>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
