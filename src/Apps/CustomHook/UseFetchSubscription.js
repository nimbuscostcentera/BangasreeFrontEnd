import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CollectionList,
  ClearState23,
} from "../../Slice/Collection/CollectionListSlice";
import UseFetchLogger from "./UseFetchLogger";
const useFetchSupscription = (obj = {}, dep = [], uniquekey = "") => {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  let sub = [],
    duepaycust = [],
    maturity = 0;
  //Collection List for Table
  const { isloading23, Response, isError23, error23, isSuccess23 } =
    useSelector((state) => state.CollectionList);

  var at = localStorage.getItem("AccessToken");


  //Collection List
  useEffect(() => {
    if (at !== undefined) {
      dispatch(CollectionList({ ...global, ...obj }));
    }
  }, dep);

  sub = useMemo(() => {
    if (isSuccess23) {
      return Response;
    }
  }, [isSuccess23,...dep]);
  sub?.map((i) => {
    if (i?.red == 1) {
      let obj = { ...i };
      obj.dueAmt = i?.PaybaleAmt - i?.totcollected;
      duepaycust.push(obj);
    }
  });

  sub &&
    sub?.map((i) => {
      if (i.MaturityStatus == 3) {
        maturity = maturity + 1;
      }
    });

  return {
    sub,
    duepaycust,
    maturity,
    isloading23,
    isSuccess23,
    isError23,
    error23,
  };
};
export default useFetchSupscription;
