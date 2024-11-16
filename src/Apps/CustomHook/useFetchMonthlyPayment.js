import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MontlyPaymentFunc } from "../../Slice/PaymentDetails/MontlyPaymentSlice";
import UseFetchLogger from "./UseFetchLogger";
const useFetchMonthlyPayment = (obj) => {
  const [mpay, setmpay] = useState(false);
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
  }, []);

  useEffect(() => {
    if (isSuccess52 && !isloading52 && at !== undefined) {
      setmpay(Resp52);
    }
  }, [isSuccess52]);

  return { isloading52, mpay, isError52, error52, isSuccess52 };
};
export default useFetchMonthlyPayment;
