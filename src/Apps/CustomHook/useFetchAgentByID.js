import React, { useEffect, useMemo, useState } from "react";
import { ClearState22, AgentById } from "../../Slice/Agent/AgentByIdSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchAgentByID(obj = {}, dep = [], uniqueKey) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  const { isloading22, AgentByIdDetails, isError22, error22, isSuccess22 } =
    useSelector((state) => state.AgentById);
  useEffect(() => {
    if (at !== undefined && Object.keys(obj).length !== 0)
    {
      dispatch(AgentById({ ...global, ...obj }));
    } 
  }, [...dep]);
  let AgentByIdDetail = useMemo(() => {
    if (AgentByIdDetails && Object.keys(AgentByIdDetails)?.length !== 0) {
      return AgentByIdDetails;
    } else {
      return null;
    }
  }, [AgentByIdDetails]);

  return { AgentByIdDetail };
}

export default useFetchAgentByID;
