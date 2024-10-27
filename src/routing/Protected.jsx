import userStore from "@/components/auth/store/userStore";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
const managerRoutes = ["/create-user"];
const Protected = ({ children }) => {
  const { pathname } = useParams();
const {access_token}=userStore()

  return access_token ? (
    // managerRoutes.includes(pathname) && role !== "manager" ? (
    //   // <Navigate to={"/"} />
      children
    // ) : (
      // children
    // )
  ) : (
    <Navigate to={"/login"} />
  );
};

export default Protected;
