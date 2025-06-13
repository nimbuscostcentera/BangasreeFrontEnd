import { useEffect, useState} from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import {
  LineChartsfunc,
  ClearState67,
} from "../../Slice/Dashboard/LineChartSlice";
function useFetchLineChartData(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const [data,setData] = useState([]);
  const { isloading67, Resp67, isSuccess67 } = useSelector((state)=> state.Line);
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at) {
      dispatch(LineChartsfunc({ ...global, ...obj }));
    }
  },dep);

  useEffect(() => {
    if (isSuccess67 && !isloading67 && at !== undefined) {
      let Linedata = [];
      Resp67?.map((item) => {
        if (item?.id == "001") {
          Linedata.push({ ...item, color: "blue" });
        } else if (item?.id == "002") {
          Linedata.push({ ...item, color: "red" });
        } else if (item?.id == "003") {
          Linedata.push({ ...item, color: "green" });
        } else {
          Linedata.push({ ...item, color: "grey" });
        }
      });
      setData(Linedata);
      dispatch(ClearState67());
    } else {
      return;
    }
  }, [isloading67,isSuccess67, ...dep]);
 
  
  return { data };
}

export default useFetchLineChartData;
