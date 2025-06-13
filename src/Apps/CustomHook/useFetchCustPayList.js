import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PaymentDetailList,
  ClearState29,
} from "../../Slice/PaymentDetails/PaymentDetailsSlice";
import UseFetchLogger from "./UseFetchLogger";
const useFetchCustPayList = (obj = {}, dep = []) => {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  //Collection List for Table
  const { isloading29, Resp29, isError29, error29, isSuccess29 } = useSelector(
    (state) => state.CustPayDetails
  );
  var at = localStorage.getItem("AccessToken");

  const [sumColl, setSumColl] = useState(0);
  const [pay,setPay]=useState([])

  //Collection List
  useEffect(() => {
    if (Object.keys(obj).length != 0) {
      let flag = 1;
      for (const key in obj) {
        if (obj[key] == undefined) {
          flag = 0;
          break;
        }
      }
      if (flag == 1) {
        dispatch(PaymentDetailList({ ...global, ...obj }));
      }
    } else {
      dispatch(PaymentDetailList(global));
    }
  }, dep);

  useEffect(() => {
    if (isSuccess29 && !isloading29 && at !== undefined) {
      setPay(Resp29);
      let sum = Resp29?.reduce((acc, curr) => acc + curr?.totcolection, 0);
      setSumColl(sum);
      dispatch(ClearState29());
    } else {
      return;
    }
  }, [isloading29,isSuccess29, ...dep]);

  return { isloading29, pay, sumColl, isError29, error29, isSuccess29 };
};
export default useFetchCustPayList;
