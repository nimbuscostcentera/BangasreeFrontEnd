import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function UseFetchLogger() {
  const { isloading, userInfo, error, isError, isSuccess, toasterBool } =
    useSelector((state) => state.auth);
  let authObj = {},
    RefreshToken,
    AccessToken;
  authObj = {
    CompanyCode: userInfo?.details?.CompanyCode,
    LoggerID: userInfo?.details?.UserID,
    Utype: userInfo?.details?.Utype,
    LoggerBranchId: userInfo?.details?.BranchId,
    LoggerUUid: userInfo?.details?.UUid,
    SuperUserType: userInfo?.details?.SuperUserType,
  };
  let global = Object.keys(authObj).reduce((acc, key) => {
    if (authObj[key] !== undefined && authObj[key] !== null && authObj[key] !== "")
    {
      acc[key] = authObj[key];
    }  
    return acc;
  }, {});
  RefreshToken = localStorage.getItem("RefreshToken");
  AccessToken = localStorage.getItem("AccessToken");
  return {
    isloading,
    userInfo,
    error,
    isError,
    isSuccess,
    global,
    toasterBool,
    RefreshToken,
    AccessToken,
  };
}

export default UseFetchLogger;
