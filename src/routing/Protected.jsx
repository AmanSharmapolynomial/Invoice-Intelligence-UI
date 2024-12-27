import userStore from "@/components/auth/store/userStore";
import React from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
const managerRoutes = ["/create-user"];
const Protected = ({ children }) => {
  const { pathname } = useParams();
  let [searchParams] = useSearchParams()
  let token = searchParams.get("token");
  let user_id = searchParams.get("user_id");
  let refresh_token = searchParams.get("refresh_token");
  let username = searchParams.get("username");
  let role = searchParams.get("role");
  let user_email = searchParams.get("user_email");
  let first_name = searchParams.get("first_name");
  let last_name = searchParams.get("last_name");


  const { access_token, setAccessToken, setRefreshToken, setUserId, setUsername, setRole, setEmail, setFirstName, setLastName } = userStore()

  if (!access_token) {
    if (token) {
      setAccessToken(token)
      setRefreshToken(refresh_token)
      setUserId(user_id)
      setUsername(username)
      setRole(role)
      setEmail(user_email)
      setFirstName(first_name)
      setLastName(last_name)
    }
  }
  return (access_token || token) ? (
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
