import { useEffect,  useState } from "react";
import { ClearState22, AgentById } from "../../Slice/Agent/AgentByIdSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchAgentByID(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  const [AgentByIdDetail, setAgentByIdDetail] = useState([]);
  const { isloading22, AgentByIdDetails, isSuccess22 } =
    useSelector((state) => state.AgentById);
  //api call
  useEffect(() => {
    if (at !== undefined && Object.keys(obj).length !== 0)
    {
      dispatch(AgentById({ ...global, ...obj }));
    } 
  },dep);

  //load in var
  useEffect(() => {
    if (isSuccess22 && !isloading22 && at !== undefined) {
      setAgentByIdDetail(AgentByIdDetails);
      dispatch(ClearState22());
    } else {
      return;
    }
   
  }, [isSuccess22,...dep]);

  return { AgentByIdDetail };
}

export default useFetchAgentByID;
