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
  const [bucount, setBUcount] = useState(0);
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
    if (isSuccess36 && !isloading36) {
      setbuList(Resp36);
      setBUcount(Resp36?.length);
      dispatch(ClearState36());
    } else {
      return;
    }
  }, [Resp36, ...dep, ...array]);

  return { bucount, buList, isError36, error36, isSuccess36, isloading36 };
}

export default useFetchSuperUser;
