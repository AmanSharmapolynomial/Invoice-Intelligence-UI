import { useSearchParams } from "react-router-dom";

const useUpdateParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (params) => {
    const newParams = {
      ...Object.fromEntries(searchParams),
      ...params
    };
    setSearchParams(newParams);
  };

  return updateParams;
};

export default useUpdateParams;
