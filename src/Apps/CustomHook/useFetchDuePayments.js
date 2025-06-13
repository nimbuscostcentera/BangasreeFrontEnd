import { useEffect, useState } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import { DuePaymentsfunc, ClearState66 } from "../../Slice/Dashboard/DuePaymentsSlice";
function useFetchDuePayments(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const [DuePayments, setDuePayments] = useState([]);
  const { isloading66, Resp66, isSuccess66 } = useSelector(
    (state) => state.DuePay
  );
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(DuePaymentsfunc({ ...global, Status: 1,...obj }));
    }
  }, [...dep]);

  useEffect(() => {
    if (isSuccess66 && !isloading66) {
      setDuePayments(Resp66);
      dispatch(ClearState66());
    }
    else {
      return;
    }
  }, [isSuccess66, ...dep]);

  return { DuePayments };
}

export default useFetchDuePayments;
