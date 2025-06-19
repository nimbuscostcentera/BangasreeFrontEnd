import { useEffect, useState } from "react";
import {
  AgentCodeList,
  ClearState1,
} from "../../Slice/Agent/AgentCodeListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useDispatch, useSelector } from "react-redux";

function useFetchAcode(obj = {}, dep = []) {
  const dispatch = useDispatch();

  const [AgentCode, setAgentCode] = useState([]);
  const { isloading1, isSuccess1, isError1, Resp1 } = useSelector(
    (state) => state.AgentCodeList
  );
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(AgentCodeList({ ...global, ...obj }));
    }
  }, dep);

  useEffect(() => {
  if(isSuccess1 && !isloading1 && at !== undefined){
    setAgentCode(Resp1);
  }
  }, [isSuccess1, isloading1]);
  
  useEffect(() => {
    if(isSuccess1 && AgentCode?.length == AgentCodeList?.length){
      dispatch(ClearState1());
    }
  },[AgentCode?.length,Resp1?.length, isSuccess1]);

  return { AgentCode, isloading1, isSuccess1, isError1 };
}

export default useFetchAcode;
