import React from "react";
import { Navigate, useParams } from "react-router-dom";
const managerRoutes = ["/create-user"];
const Protected = ({ children }) => {
  const { pathname } = useParams();
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  return token ? (
    managerRoutes.includes(pathname) && role !== "manager" ? (
      <Navigate to={"/"} />
    ) : (
      children
    )
  ) : <Navigate to={"/login"}/>;
};

export default Protected;
