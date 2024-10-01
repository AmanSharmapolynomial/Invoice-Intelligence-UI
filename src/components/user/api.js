import { useQuery } from "@tanstack/react-query";
import { getUsersList } from "./utils";

export const useGetUsersList = () => {
  return useQuery({
    queryKey: ["all-users-list"],
    queryFn: getUsersList,
    
  });
};
