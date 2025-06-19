import { useEffect, useState } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import { BranchList, ClearState35 } from "../../Slice/Area/BranchListSlice";

function useFetchBranch(obj={},dep=[],uniquekey) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading35, Resp35,  isSuccess35 } = useSelector(
    (state) => state.branch
  );
  var at = localStorage.getItem("AccessToken");

const [branch,setBranch]=useState([]);

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
  },dep);
  
 useEffect(() => {
   if (isSuccess35 && !isloading35 && at !== undefined) {
     setBranch(Resp35);
   }
   else {
     return
   }
 }, [Resp35, ...dep]);

  useEffect(() => {
    if(isSuccess35  && Resp35?.length == branch?.length){
      dispatch(ClearState35());
    }
  },[isSuccess35,branch,Resp35]);
  
  return { branch, isloading35 ,isSuccess35};
}

export default useFetchBranch;
