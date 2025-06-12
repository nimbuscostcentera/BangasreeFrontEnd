import { useEffect, useState } from "react";
import {
  ClearState36,
  SuperUserList,
} from "../../Slice/BackofficeUser/BackofficeUserListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchSuperUser(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const [buList, setbuList] = useState([]);
  const { isloading36, Resp36, error36, isError36, isSuccess36 } = useSelector(
    (state) => state.superuser
  );
  var at = localStorage.getItem("AccessToken");
  let array = [];
  for (const key in obj) {
    array.push = obj[key];
  }

  useEffect(() => {
    if (at !== undefined) {
      dispatch(
        SuperUserList({ ...global, ...obj, BranchCode: global?.LoggerBranchId })
      );
    }
  }, [...dep, ...array]);

  useEffect(() => {
    if (Resp36 && Resp36?.length !== 0) {
      setbuList(Resp36);
    } else {
      return ;
    }
    dispatch(ClearState36());
  }, [Resp36, ...dep, ...array]);

  let bucount = buList?.length || 0;

  return { bucount, buList, isError36, error36, isSuccess36, isloading36 };
}

export default useFetchSuperUser;
