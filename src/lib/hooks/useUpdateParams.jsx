import { useSearchParams } from "react-router-dom";

const useUpdateParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const updateParams = (params) => {
    const currentParams = Object.fromEntries(searchParams);
   

    // Remove any parameters that are set to undefined
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) {
        delete currentParams[key];
      } else {
        currentParams[key] = params[key];
      }
    });

    setSearchParams(currentParams);
  };

  return updateParams;
};

export default useUpdateParams;
