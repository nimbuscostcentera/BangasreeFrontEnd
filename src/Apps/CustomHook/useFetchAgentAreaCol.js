import  { useEffect, useState } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import {
  AgentAreaCollfunc,
  ClearState73,
} from "../../Slice/Dashboard/AgentAreaCollSlice";
function useFetchAgentAreaColl() {
  const dispatch = useDispatch();
  const [AreaAgentData,setAreaAgentData] = useState([]);
  const { global } = UseFetchLogger();
  const { isloading73, Resp73,  isSuccess73 } = useSelector(
    (state) => state.AgentAreaCol
  );
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(AgentAreaCollfunc(global));
    }
  }, []);
  let transArray = [];
  Resp73?.map((item) => {
    let arr = Object.keys(item);
    transArray = [...arr, ...transArray];
  });
  let myset = new Set(transArray);
  let midarray = [...myset];
  let nameArray = midarray.filter((item) => item !== "AreaName");

  useEffect(() => {
    if (isSuccess73) {
      let Bardata = [];
      Resp73?.map((item) => {
        var amount = (item?.totalCollection / 1000 || 0).toFixed(2);
        Bardata.push({
          AreaName: item?.AreaName,
          totalCollection: amount,
        });
      });
      setAreaAgentData(Bardata);
      dispatch(ClearState73());
    }
    else {
      return;
    }
   
  }, [isSuccess73]);

  return { AreaAgentData, nameArray, isloading73, isSuccess73 };
}

export default useFetchAgentAreaColl;
