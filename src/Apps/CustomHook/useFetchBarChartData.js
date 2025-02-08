import React, { useEffect, useState, useMemo } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import { BarChartsfunc, ClearState69 } from "../../Slice/Dashboard/BarChart";
import { color } from "@mui/system";
function useFetchBarChartData(obj = {},dep=[]) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading69, Resp69, isError69, error69, isSuccess69 } = useSelector(
    (state) => state.Bar
  );
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(BarChartsfunc({...global,...obj}));
    }
  }, dep);
    let transArray = [];
    Resp69?.map((item) => {
        let arr = Object.keys(item);
        transArray = [...arr, ...transArray];
    });
    let myset = new Set(transArray);
    let midarray = [...myset];
    let nameArray = midarray.filter((item)=>item!=="AgentName");
  let bardata = useMemo(() => {
    if (Resp69 && Resp69?.length !== 0) {
      let Bardata = [];
      Resp69?.map((item) => {
        Bardata.push({
          ...item,
          color1: "blue",
          color2: "green",
          color3: "yellow",
          color4: "red",
          color5: "violet",
        });
      });
      return Bardata;
    }
  }, [isSuccess69,...dep]);

  return { bardata, nameArray, isloading69 };
}

export default useFetchBarChartData;
