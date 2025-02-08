import React, { useEffect, useState, useMemo } from "react";
import {
  ClearState6,
  CustomerList,
} from "../../Slice/Customer/CustomerListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchCustomer(obj = {}, dep = [], uniquekey) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  const { isloading6, CustomerDetail, isError6, error6, isSuccess6 } =
    useSelector((state) => state.CustomerList);

  useEffect(() => {
    if (at !== undefined && Object.keys(obj).length !== 0) {
      dispatch(CustomerList({ ...global, ...obj }));
    } else if (at !== undefined) {
      dispatch(CustomerList(global));
    }
  }, [...dep]);

  let custList = useMemo(() => {
    if (isSuccess6 && !isloading6 && at !== undefined) {
      return CustomerDetail;
    } else {
      return [];
    }
  }, [isSuccess6]);

  var count = custList?.length;
  return { count, custList, isError6, error6, isSuccess6, isloading6 };
}

export default useFetchCustomer;
