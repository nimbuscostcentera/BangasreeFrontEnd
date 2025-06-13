import { useEffect, useState } from "react";
import {
  ClearStateSchemeHistory,
  getAllSchemeHistory,
} from "../../Slice/Scheme/SchemeHistorySlice";
import UseFetchLogger from "./UseFetchLogger";
import { useDispatch, useSelector } from "react-redux";

function useFetchSchemeHistory(obj = {}, dep = [], uniquekey) {
  const [SchemeHist, setSchemeHist] = useState([]);
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
      dispatch(getAllSchemeHistory({ ...global, ...obj }));
    } else if (
      at !== undefined &&
      Object.keys(obj).length == 0 &&
      uniquekey == undefined
    ) {
      dispatch(getAllSchemeHistory(global));
    } else if (
      at !== undefined &&
      Object.keys(obj).length !== 0 &&
      obj[uniquekey] !== undefined
    ) {
      dispatch(getAllSchemeHistory({ ...global, ...obj }));
    }
  }, dep);
  //Scheme List for Table
  const {
    isSHLoading,
    SchemeHistoryList,
    SchemeHistoryErrorMsg,
    isSchemeHistoryError,
    isSchemeHistorySuccess,
  } = useSelector((state) => state.schemeHist);
  //schemeList response save to hook
  useEffect(() => {
    if (isSchemeHistorySuccess && !isSHLoading && at !== undefined) {
      setSchemeHist(SchemeHistoryList);
      dispatch(ClearStateSchemeHistory());
    } else {
      return;
    }
  }, [isSHLoading,isSchemeHistorySuccess, ...dep]);

  return {
    SchemeHist,
    isSHLoading,
    isSchemeHistoryError,
    SchemeHistoryErrorMsg,
    isSchemeHistorySuccess
  };
}

export default useFetchSchemeHistory;
