import React, { useEffect, useState ,useMemo} from "react";
import {
  AgentCodeList,
  ClearState1,
} from "../../Slice/Agent/AgentCodeListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useDispatch, useSelector } from "react-redux";

function useFetchAcode(obj = {}, dep = [], uniquekey=undefined) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
var at = localStorage.getItem("AccessToken");


  useEffect(() => {
   // console.log(uniquekey, obj, dep, "up");
     if (
       at !== undefined && !uniquekey
     ) {
       dispatch(AgentCodeList({ ...global }));
     }
     else if (
       at !== undefined &&
       uniquekey !== "" &&
       uniquekey !== null &&
       uniquekey !== undefined &&
       obj[uniquekey] !== "" &&
       obj[uniquekey] !== null &&
       obj[uniquekey] !== undefined
     ) {
       dispatch(AgentCodeList({ ...global, ...obj }));
     }
  }, dep);

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
