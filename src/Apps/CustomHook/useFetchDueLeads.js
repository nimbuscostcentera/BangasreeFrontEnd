import React, { useEffect, useState, useMemo } from "react";
import { DueLeadfunc } from "../../Slice/Dashboard/DueLeadSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchDueLeads(obj = {}, dep = [], uniquekey) {
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

  let DueleadList = useMemo(() => {
    if (isSuccess74 && !isloading74 && at !== undefined) {
      return Resp74;
    } else {
      return [];
    }
  }, [isSuccess74]);

  var count = DueleadList?.length;
  return { count, DueleadList, isError74, error74, isSuccess74, isloading74 };
}

export default useFetchDueLeads;
