import { useEffect, useState } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import { BarChartsfunc, ClearState69 } from "../../Slice/Dashboard/BarChart";
function useFetchBarChartData(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading69, Resp69, isSuccess69 } = useSelector(
    (state) => state.Bar
  );
  var at = localStorage.getItem("AccessToken");

  const [bardata, setBardata] = useState([]);
  const [nameArray, setNameArray] = useState([]);
  useEffect(() => {
    if (at !== undefined) {
      dispatch(BarChartsfunc({ ...global, ...obj }));
    }
  }, dep);

  useEffect(() => {
    if (isSuccess69 && !isloading69 && at !== undefined) {
      let transArray = [];
      Resp69?.map((item) => {
        let arr = Object.keys(item);
        transArray = [...arr, ...transArray];
      });
      let myset = new Set(transArray);
      let midarray = [...myset];
      let nArray = midarray.filter((item) => item !== "AgentName");
      setNameArray(nArray);
      let bdata = [];
      Resp69?.map((item) => {
        bdata.push({
          ...item,
          color1: "blue",
          color2: "green",
          color3: "yellow",
          color4: "red",
          color5: "violet",
        });
      });
      setBardata(bdata); //Bardata;
      dispatch(ClearState69());
    }
    else
    {
      return;
      }
  
  }, [isloading69, isSuccess69]);

  return { bardata, nameArray, isloading69 };
}

export default useFetchBarChartData;
