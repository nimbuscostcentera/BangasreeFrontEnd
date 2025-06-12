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
  const { isloading72, Resp72, isSuccess72 } = useSelector(
    (state) => state.AP
  );
  const [data, setData] = useState();
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(AgentPerformancefunc({ ...global, ...obj }));
    }
  }, [...dep]);

  useEffect(() => {
    if (isSuccess72 && !isloading72) {
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
      setData(Linedata);
    } else {
      return;
    }
    dispatch(ClearState72());
  }, [isSuccess72, ...dep]);

  return { data };
}

export default useFetchAgentYearlyReport;
