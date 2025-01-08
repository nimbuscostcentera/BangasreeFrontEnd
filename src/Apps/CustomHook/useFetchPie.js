import React, { useEffect, useState, useMemo } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import {
  PieChartsfunc,
  ClearState68,
} from "../../Slice/Dashboard/PieChartSlice";
function useFetchPieChartData(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading68, Resp68, isError68, error68, isSuccess68 } = useSelector(
    (state) => state.Pie
  );
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(PieChartsfunc({ ...global, ...obj }));
    }
  }, dep);
  let data = useMemo(() => {
    if (Resp68 && Resp68?.length !== 0) {
      let piedata = [];
      Resp68.map((item, index) => {
        if (index == 0) {
          piedata.push({ ...item, color: "red" });
        } else {
          piedata.push({ ...item, color: "green" });
        }
      });
      return piedata;
    } else {
      return [];
    }
  }, [isSuccess68, ...dep]);

  return {data};
}

export default useFetchPieChartData;
