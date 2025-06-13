import { useEffect, useState} from "react";
import { ClearState2, AgentList } from "../../Slice/Agent/AgentListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchAgent(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const [agentList, setAgentList] = useState([]);
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

  useEffect(() => {
    if (isSuccess2 && !isloading2 && at !== undefined) {
      setAgentList(AgentListData);
      dispatch(ClearState2());
    }
    else {
      return;
    }
   
  }, [isSuccess2,...dep]);

  var agentcount = agentList?.length;
  return { agentcount, agentList, isError2, error2, isSuccess2, isloading2 };
}

export default useFetchAgent;
