import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UseFetchLogger from "./UseFetchLogger";
import {
  LogBookListFunc,
  ClearstateLogList,
} from "../../Slice/BackofficeUser/LogListSlice";
function UseFetchLogs(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const [LogBookdetails, setLogBookdetails] = useState([]);
  const { isLogListSuccess, LogListResult, isLogListLoading, isLogListError } =
    useSelector((state) => state.logs);
  const { global } = UseFetchLogger();
  useEffect(() => {
    if (
      (obj?.StartDate !== null && obj?.EndDate !== null) ||
      (obj?.StartDate == null && obj?.EndDate == null)
    ) {
      dispatch(LogBookListFunc({ ...global, ...obj }));
    } else {
      return;
    }
  }, dep);

  useEffect(() => {
    if (isLogListSuccess && !isLogListLoading && !isLogListError) {
      setLogBookdetails(LogListResult);
    } else {
      return;
    }
  }, [isLogListLoading, isLogListSuccess, ...dep]);

  useEffect(() => {
    if (
      LogListResult?.length==LogBookdetails?.length
    ) {
      dispatch(ClearstateLogList());
    }
  },[LogBookdetails?.length]);
  return {
    isLogListLoading,
    isLogListSuccess,
    LogBookdetails,
  };
}

export default UseFetchLogs;
