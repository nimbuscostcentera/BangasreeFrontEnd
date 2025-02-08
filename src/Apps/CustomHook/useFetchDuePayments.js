import React, { useEffect, useState, useMemo } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import { DuePaymentsfunc, ClearState66 } from "../../Slice/Dashboard/DuePaymentsSlice";
function useFetchDuePayments(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading66, Resp66, isError66, error66, isSuccess66 } = useSelector(
    (state) => state.DuePay
  );
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(DuePaymentsfunc({ ...global, Status: 1 }));
    }
  }, [...dep]);

  let DuePayments = useMemo(() => {
    if (isSuccess66 && !isloading66) {
      return Resp66;
    }
  }, [isSuccess66, ...dep]);

  return { DuePayments };
}

export default useFetchDuePayments;
