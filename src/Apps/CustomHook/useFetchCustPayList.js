import React, { useEffect, useState, useMemo } from "react";
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

  let pay = useMemo(() => {
    if (Resp29 !== undefined) {
      return Resp29 || [];
    }
  }, [Resp29, ...dep]);

  var sumColl = 0;
  pay.map((i) => {
    sumColl = sumColl + i?.totcolection;
  });
  return { isloading29, pay, sumColl, isError29, error29, isSuccess29 };
};
export default useFetchCustPayList;
