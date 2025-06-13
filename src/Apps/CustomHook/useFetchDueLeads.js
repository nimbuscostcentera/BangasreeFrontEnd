import { useEffect, useState } from "react";
import { DueLeadfunc, ClearState74 } from "../../Slice/Dashboard/DueLeadSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchDueLeads(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  const { isloading74, Resp74, isError74, error74, isSuccess74 } = useSelector(
    (state) => state.dueleads
  );

  useEffect(() => {
    if (at !== undefined && Object.keys(obj).length !== 0) {
      dispatch(DueLeadfunc({ ...global, ...obj }));
    } else if (at !== undefined) {
      dispatch(DueLeadfunc(global));
    }
  }, [...dep]);

  const [DueleadList, setDueleadList] = useState([]);
  const [count,setCount]=useState(0);
  useEffect(() => {
    if (isSuccess74 && !isloading74 && at !== undefined) {
      setDueleadList(Resp74);
      setCount(Resp74.length);
      dispatch(ClearState74());
    } else {
      return ;
    }
  }, [isSuccess74, isloading74,...dep]);

  return { count, DueleadList, isError74, error74, isSuccess74, isloading74 };
}

export default useFetchDueLeads;
