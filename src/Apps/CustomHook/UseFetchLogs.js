import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import UseFetchLogger from "./UseFetchLogger";
import { LogBookListFunc } from "../../Slice/BackofficeUser/LogListSlice";
function UseFetchLogs(obj = {},dep=[]) {
    const dispatch = useDispatch()
      const {
        isLogListSuccess,
        isLogListError,
        LogListError,
        LogListResult,
        isLogListLoading,
      } = useSelector((state) => state.logs);
    const { global } = UseFetchLogger();
    useEffect(() => {
       dispatch (LogBookListFunc(global));
    }, dep);
    const LogBookdetails = useMemo(() => {
      if (isLogListSuccess) {
        return LogListResult;
      }
    }, [isLogListSuccess,...dep]);
  return {
    LogBookdetails,
  };
}

export default UseFetchLogs;
