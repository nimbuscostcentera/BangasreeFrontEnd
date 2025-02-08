import React, { useEffect, useMemo, useState } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import { BranchList, ClearState35 } from "../../Slice/Area/BranchListSlice";

function useFetchBranch(obj={},dep=[],uniquekey) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading35, Resp35, isError35, error35, isSuccess35 } = useSelector(
    (state) => state.branch
  );
  var at = localStorage.getItem("AccessToken");
  useEffect(() => {
      if (
        at !== undefined &&
        Object.keys(obj).length !== 0 &&
        uniquekey !== undefined
      ) {
        dispatch(BranchList({ ...global, ...obj }));
      }
     else if (
        at !== undefined &&
        Object.keys(obj).length == 0 &&
        uniquekey == undefined 
      ) {
        dispatch(BranchList(global));
      }
  }, [...dep]);
  
 let branch = useMemo(() => {
   if (Resp35 && Resp35?.length !== 0) {
     return Resp35;
   }
 }, [Resp35, ...dep]);

  return { branch};
}

export default useFetchBranch;
