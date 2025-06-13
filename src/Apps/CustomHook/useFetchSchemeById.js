import { useEffect, useState } from "react";
import {
  SchemeByCustId,
  ClearState27,
} from "../../Slice/Scheme/SchemebyCustIdSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useDispatch, useSelector } from "react-redux";

function useFetchSchemeById(obj = {}, dep = []) {
  const [SchemeData, setSchemeData] = useState([]);
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  //Scheme List
  useEffect(() => {
    if (at !== undefined) {
      dispatch(SchemeByCustId({ ...obj, ...global }));
    }
  }, [...dep]);
  //Scheme List for Table
  const { isloading27, Resp27, isError27, error27, isSuccess27 } = useSelector(
    (state) => state.SchemeListById
  );
  //schemeList response save to hook
  useEffect(() => {
    if (isSuccess27 && !isloading27) {
      setSchemeData(Resp27[0]);
      dispatch(ClearState27());
    } else {
      return;
    }
  }, [isloading27, isSuccess27, ...dep]);

  return { SchemeData, isloading27, isError27, error27, isSuccess27 };
}

export default useFetchSchemeById;
