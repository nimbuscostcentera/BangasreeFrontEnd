import React, { useEffect, useState ,useMemo} from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import { ClearState5, getAreaList } from "../../Slice/Area/AreaListSlice";

function useFetchArea(obj = {},dep=[]) {
const dispatch = useDispatch();
const { global } = UseFetchLogger();
const { isloading5, areaList, isError5, error5, isSuccess5 } = useSelector(
  (state) => state.AreaList
  );
  var at = localStorage.getItem("AccessToken");
useEffect(() => {
  if ( at && Object.keys(obj).length !== 0) {
    dispatch(getAreaList({ ...global, ...obj }));
  }
  else if (at)
  {
     dispatch(getAreaList(global));
    }
}, []);
  
  let AreaList = useMemo(() => {
  if (isSuccess5 && !isloading5 && at !== undefined) {
    return areaList;
  }
}, [isSuccess5]);

return { AreaList, isError5, error5, isSuccess5, isloading5 };
}

export default useFetchArea