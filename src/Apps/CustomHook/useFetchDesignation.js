import React, { useEffect, useState ,useMemo} from "react";
import {
  ClearState54,
  DesListFunc,
} from "../../Slice/BackofficeUser/DesignationListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchDesignation(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading54, Resp54, isError54, error54, isSuccess54 } = useSelector(
    (state) => state.DesiList
  );
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(DesListFunc({ ...global, Status: 1 }));
    }
  }, [...dep]);

  let des = useMemo(() => {
    if (Resp54 && Resp54?.length !== 0) {
      return Resp54;
    }
    else {
      return [];
    }
  }, [Resp54, ...dep]);

  return { isError54, des, error54, isSuccess54, isloading54 };
}

export default useFetchDesignation;
