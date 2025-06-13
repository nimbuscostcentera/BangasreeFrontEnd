import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MontlyPaymentFunc,
  ClearState52,
} from "../../Slice/PaymentDetails/MontlyPaymentSlice";
import UseFetchLogger from "./UseFetchLogger";
import { defaultProps } from "@nivo/bar";
const useFetchMonthlyPayment = (obj={},dep=[]) => {
  const [mpay, setmpay] = useState([]);
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  //Collection List for Table
  const { isloading52, Resp52, isError52, error52, isSuccess52 } = useSelector(
    (state) => state.mp
  );
  var at = localStorage.getItem("AccessToken");
  //Collection List
  useEffect(() => {
    if (at !== undefined) {
      dispatch(MontlyPaymentFunc({ ...global, ...obj }));
    }
  }, [...dep]);

  useEffect(() => {
    if (isSuccess52 && !isloading52 && at !== undefined) {
      setmpay(Resp52);
      dispatch(ClearState52());
    }
    else
    {
      return;
      }
  }, [isSuccess52, isloading52,...defaultProps]);

  return { isloading52, mpay, isError52, error52, isSuccess52 };
};
export default useFetchMonthlyPayment;
