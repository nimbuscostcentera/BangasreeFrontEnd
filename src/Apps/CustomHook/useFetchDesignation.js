import { useEffect, useState} from "react";
import {
  ClearState54,
  DesListFunc,
} from "../../Slice/BackofficeUser/DesignationListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchDesignation(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading54, Resp54, isError54, error54, isSuccess54 } = useSelector(
    (state) => state.DesiList
  );
  var at = localStorage.getItem("AccessToken");
const [des,setDes]=useState([]);
  useEffect(() => {
    if (at !== undefined) {
      dispatch(DesListFunc({ ...global, Status: 1, ...obj }));
    }
  }, [...dep]);

  useEffect(() => {
    if (isSuccess54 && !isloading54 && at !== undefined) {
      setDes(Resp54);
      dispatch(ClearState54());
    } else {
      return;
    }
  }, [isloading54,isSuccess54, ...dep]);

  return { isError54, des, error54, isSuccess54, isloading54 };
}

export default useFetchDesignation;
