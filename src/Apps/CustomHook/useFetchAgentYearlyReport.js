import React, { useEffect, useState, useMemo } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import {
  AgentPerformancefunc,
  ClearState72,
} from "../../Slice/Dashboard/AgentPerformanceSlice";

function useFetchAgentYearlyReport(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading72, Resp72, isError72, error72, isSuccess72 } = useSelector(
    (state) => state.AP
  );
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(AgentPerformancefunc({ ...global, ...obj }));
    }
  }, [...dep]);
  let data = useMemo(() => {
    if (isSuccess72 && Resp72) {
      let Linedata = [];
      Resp72?.map((item) => {
        if (item?.id == "001") {
          Linedata.push({ ...item, color: "blue" });
        } else if (item?.id == "002") {
          Linedata.push({ ...item, color: "red" });
        } else if (item?.id == "003") {
          Linedata.push({ ...item, color: "green" });
        } else {
          Linedata.push({ ...item, color: "grey" });
        }
      });
      return Linedata;
    } else {
      return [];
    }
  }, [Resp72, ...dep]);
  //console.log(data);
  return { data };
}

export default useFetchAgentYearlyReport;
