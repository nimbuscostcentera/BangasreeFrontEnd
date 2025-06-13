import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPuritylist,
  ClearState77,
} from "../../Slice/PurityVsRate/PurityListSlice";
import UseFetchLogger from "./UseFetchLogger";
const useFetchPuritylist = (obj = {},dep=[]) => {
  const [plist, setplist] = useState(false);
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  //purity List for Table
  const { isloading77, Resp77, isError77, error77, isSuccess77 } = useSelector(
    (state) => state.puritylist
  );

  //Purity List
  useEffect(() => {
    if (at !== undefined) {
      dispatch(getPuritylist({ ...global, ...obj }));
    }
  },dep);

  useEffect(() => {
    if (isSuccess77 && !isloading77 && at !== undefined) {
      setplist(Resp77);
      dispatch(ClearState77());
    } else {
      return;
    }
  }, [isSuccess77, isloading77,...dep]);

  return { isloading77, plist, isError77, error77, isSuccess77 };
};
export default useFetchPuritylist;
