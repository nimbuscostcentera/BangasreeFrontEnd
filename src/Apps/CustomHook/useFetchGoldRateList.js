import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RateVsPurityFunc,
  ClearState79,
} from "../../Slice/PurityVsRate/RateVsPuritySlice";
import UseFetchLogger from "./UseFetchLogger";
const useFetchGoldRateList = (obj = {},dep=[]) => {
  const [rateList, setRateList] = useState(false);
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  //purity List for Table
  const { isloading79, Resp79, isError79, error79, isSuccess79 } = useSelector(
    (state) => state.ratelist
  );
  //Purity List
  useEffect(() => {
    if (at !== undefined) {
      dispatch(RateVsPurityFunc({ ...global, ...obj }));
    }
  },dep);

  useEffect(() => {
    if (Resp79?.length!==0) {
      setRateList(Resp79);
    }
    dispatch(ClearState79());
  }, [dep]);

  return { isloading79, rateList, isError79, error79, isSuccess79 };
};
export default useFetchGoldRateList;
