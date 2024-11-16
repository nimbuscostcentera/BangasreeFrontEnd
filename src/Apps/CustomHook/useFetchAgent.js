import React, { useEffect, useMemo, useState} from "react";
import { ClearState2, AgentList } from "../../Slice/Agent/AgentListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchAgent(obj = {}, dep = [], uniqueKey) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  const { isloading2, AgentListData, isError2, error2, isSuccess2 } =
    useSelector((state) => state.AgentList);
  useEffect(() => {
    if ( at !== undefined) {
      if (Object.keys(obj).length !== 0) {
        dispatch(AgentList({ ...global, ...obj }));
      } else {
        dispatch(AgentList(global));
      }
    }
  }, [...dep]);

  let agentList=useMemo(() => {
    if (isSuccess2 && !isloading2 && at !== undefined) {
      return AgentListData;
    }
    else {
      return [];
    }
  }, [isSuccess2]);

  var agentcount = agentList?.length;
  return { agentcount, agentList, isError2, error2, isSuccess2, isloading2 };
}

export default useFetchAgent;
