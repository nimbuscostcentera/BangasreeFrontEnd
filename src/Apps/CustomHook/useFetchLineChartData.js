import React, { useEffect, useState, useMemo } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import {
  LineChartsfunc,
  ClearState67,
} from "../../Slice/Dashboard/LineChartSlice";
function useFetchLineChartData(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  let { StartDate, EndDate } = obj;
  const { isloading67, Resp67, isError67, error67, isSuccess67 } = useSelector((state)=> state.Line);
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at && StartDate && EndDate) {
      dispatch(LineChartsfunc({ ...global, ...obj }));
    }
  }, [StartDate, EndDate]);

  let data = useMemo(() => {
    if (Resp67 && Resp67?.length !== 0) {
      let Linedata = [];
      Resp67?.map((item) => {
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
  }, [isSuccess67, StartDate, EndDate]);
 
  
  return { data };
}

export default useFetchLineChartData;
