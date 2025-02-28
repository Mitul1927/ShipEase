import { jwtDecode } from "jwt-decode";
import React from "react";
import { useSelector } from "react-redux";

const UserInfo = () => {
  const token = localStorage.getItem("token");
  let username = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    username = decodedToken.username;
  }
  return <div>{username}</div>;
};

export default UserInfo;
