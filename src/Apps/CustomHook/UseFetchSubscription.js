import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CollectionList,
  ClearState23,
} from "../../Slice/Collection/CollectionListSlice";
import UseFetchLogger from "./UseFetchLogger";
const useFetchSupscription = (obj = {}, dep = [], uniquekey = "") => {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const [sub, setSub] = useState([]);
  const [duepaycust, setDuepaycust] = useState([]);
  const [maturity, setMaturity] = useState(0);

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

 useEffect(() => {
    if (isSuccess23 && !isloading23 && at !== undefined && Array.isArray(Response)) {
      setSub(Response);
      let arr1=Response?.map((i) => {
        if (i?.red == 1) {
          let obj = { ...i };
          obj.dueAmt = i?.PaybaleAmt - i?.totcollected;
          return(obj);
        }
      });
      setDuepaycust(arr1);
      let count = 0;
      Response &&
        Response?.forEach((i) => {
          if (i.MaturityStatus == 3) {
            count = count + 1;
          }
        });
      setMaturity(count);
   }
    else {
      return;
   }
   dispatch(ClearState23());
  }, [isSuccess23, ...dep]);
  


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
