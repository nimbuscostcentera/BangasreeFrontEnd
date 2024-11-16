import React, { useEffect, useState ,useMemo} from "react";
import {
  AgentCodeList,
  ClearState1,
} from "../../Slice/Agent/AgentCodeListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useDispatch, useSelector } from "react-redux";

function useFetchAcode(obj = {}, dep = [], uniquekey) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
var at = localStorage.getItem("AccessToken");

  useEffect(() => {
     if (
      at !== undefined &&
       Object.keys(obj).length !== 0 &&
       uniquekey == undefined
     ) {
       dispatch(AgentCodeList({ ...global, ...obj }));
     } else if (
      at !== undefined &&
       Object.keys(obj).length == 0 &&
       uniquekey == undefined
     ) {
       dispatch(AgentCodeList(global));
     } else if (
      at !== undefined &&
       Object.keys(obj).length !== 0 &&
       obj[uniquekey] !== undefined
     ) {
       dispatch(AgentCodeList({ ...global, ...obj }));
     }
  }, [...dep]);

  const { isloading1, isSuccess1, isError1, error1, Resp1 } = useSelector(
    (state) => state.AgentCodeList
  );

  let AgentCode=useMemo(() => {
    if (isSuccess1 && !isloading1) {
      return Resp1;
    }
  }, [isSuccess1, ...dep]);
  
  return { AgentCode, isloading1, isSuccess1, isError1 };
}

export default useFetchAcode;
