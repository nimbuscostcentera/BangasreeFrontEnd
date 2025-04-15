import { useEffect, useState } from "react";
import {
  AgentCodeList,
  ClearState1,
} from "../../Slice/Agent/AgentCodeListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useDispatch, useSelector } from "react-redux";

function useFetchAcode(obj = {}, dep = [], uniquekey = undefined) {
  const dispatch = useDispatch();
  const [AgentCode, setAgentCode] = useState([]);
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  useEffect(() => {
    if (at !== undefined && !uniquekey) {
      dispatch(AgentCodeList({ ...global }))
        .unwrap()
        .then((res) => {
          if (Array.isArray(res)) {
            setAgentCode(res);
          }
        });
    } else if (
      at !== undefined &&
      uniquekey !== "" &&
      uniquekey !== null &&
      uniquekey !== undefined &&
      obj[uniquekey] !== "" &&
      obj[uniquekey] !== null &&
      obj[uniquekey] !== undefined
    ) {
      dispatch(AgentCodeList({ ...global, ...obj }))
        .unwrap()
        .then((res) => {
          if (Array.isArray(res)) {
            setAgentCode(res);
          }
        });
    }
    dispatch(ClearState1());
  }, dep);

  const { isloading1, isSuccess1, isError1 } = useSelector(
    (state) => state.AgentCodeList
  );

  return { AgentCode, isloading1, isSuccess1, isError1 };
}

export default useFetchAcode;
