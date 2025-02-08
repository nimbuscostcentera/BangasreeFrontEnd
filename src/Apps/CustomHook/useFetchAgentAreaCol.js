import React, { useEffect, useState, useMemo } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import {
  AgentAreaCollfunc,
  ClearState73,
} from "../../Slice/Dashboard/AgentAreaCollSlice";
function useFetchAgentAreaColl() {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading73, Resp73, isError73, error73, isSuccess73 } = useSelector(
    (state) => state.AgentAreaCol
  );
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(AgentAreaCollfunc(global));
    }
  }, []);
  let transArray = [];
  Resp73?.map((item) => {
    let arr = Object.keys(item);
    transArray = [...arr, ...transArray];
  });
  let myset = new Set(transArray);
  let midarray = [...myset];
  let nameArray = midarray.filter((item) => item !== "AreaName");
  let AreaAgentData = useMemo(() => {
    if (Resp73 && Resp73?.length !== 0) {
      let Bardata = [];
      Resp73?.map((item) => {
        var amount =(item?.totalCollection/1000||0).toFixed(2);
        Bardata.push({
          AreaName: item?.AreaName,
          totalCollection: amount,
        });
      });
      return Bardata;
    }
  }, [isSuccess73]);
console.log(AreaAgentData,"bar agent area");
  return { AreaAgentData, nameArray, isloading73 };
}

export default useFetchAgentAreaColl;
