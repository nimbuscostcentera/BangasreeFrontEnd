import React, { useEffect, useState } from "react";
import { SchemeList } from "../../Slice/Scheme/SchemeListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useDispatch, useSelector } from "react-redux";

function useFetchScheme(obj = {}, dep = [], uniquekey) {
  const [Scheme, setScheme] = useState([]);
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");

  //Scheme List
  useEffect(() => {
    if (
      at !== undefined &&
      Object.keys(obj).length !== 0 &&
      uniquekey == undefined
    ) {
      dispatch(SchemeList({ ...global, ...obj }));
    } else if (
      at !== undefined &&
      Object.keys(obj).length == 0 &&
      uniquekey == undefined
    ) {
      dispatch(SchemeList(global));
    } else if (
      at !== undefined &&
      Object.keys(obj).length !== 0 &&
      obj[uniquekey] !== undefined
    ) {
      dispatch(SchemeList({ ...global, ...obj }));
    }
  }, [...dep]);
  //Scheme List for Table
  const { isloading18, Schemes, isError18, error18, isSuccess18 } = useSelector(
    (state) => state.SchemeList
  );
  //schemeList response save to hook
  useEffect(() => {
    if (isSuccess18 && !isloading18 &&  at !== undefined) {
      setScheme(Schemes);
    }
  }, [isSuccess18, ...dep]);

  return { Scheme, isloading18, isError18, error18, isSuccess18 };
}

export default useFetchScheme;
