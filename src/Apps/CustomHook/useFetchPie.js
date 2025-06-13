import { useEffect, useState } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import {
  PieChartsfunc,
  ClearState68,
} from "../../Slice/Dashboard/PieChartSlice";
function useFetchPieChartData(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const [data, setData] = useState([]);
  const { isloading68, Resp68, isSuccess68 } = useSelector(
    (state) => state.Pie
  );
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(PieChartsfunc({ ...global, ...obj }));
    }
  }, dep);

  useEffect(() => {
    if (isSuccess68 && !isloading68) {
      let piedata = [];
      Resp68?.map((item, index) => {
        if (index == 0) {
          piedata.push({ ...item, color: "red" });
        } else {
          piedata.push({ ...item, color: "green" });
        }
      });
      setData(piedata);
      dispatch(ClearState68());
    } else {
      return;
    }
  }, [isloading68, isSuccess68, ...dep]);

  return {data};
}

export default useFetchPieChartData;
