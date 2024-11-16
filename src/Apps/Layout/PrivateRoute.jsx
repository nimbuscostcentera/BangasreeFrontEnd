import React, { useEffect } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import UseFetchLogger from "../CustomHook/UseFetchLogger";

const PrivateRoute = ({ authenticated }) => {
  let a;
  return authenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
