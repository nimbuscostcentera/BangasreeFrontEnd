import  { useEffect, useState } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import {
  PaymentHistoryFunc,
  ClearStatePayHistory,
} from "../../Slice/PaymentDetails/PaymentHistorySlice";
function useFetchPieChartData(obj = {}, dep = []) {
  const dispatch = useDispatch();
    const { global } = UseFetchLogger();
    const [sum, setSum] = useState(0);
    const [payHistList,setPayHistList]=useState([]);
  const { isPayHistoryLoading, PaymentHistoryList, isPayHistorySucc } =
    useSelector((state) => state.payHist);
  var at = localStorage.getItem("AccessToken");

  useEffect(() => {
    if (at !== undefined) {
      dispatch(PaymentHistoryFunc({ ...global, ...obj }));
    }
  }, dep);
    
  useEffect(() => {
    if (isPayHistorySucc && !isPayHistoryLoading) {
      let data = PaymentHistoryList?.map((item) => {
          setSum((prev)=>prev + item?.amount);
          item.TotalPaid = (sum / 1000 || 0).toFixed(2);
          return item
      });
      setPayHistList(data);
      dispatch(ClearStatePayHistory());
    } else {
      return ;
      }
  
  }, [isPayHistorySucc, ...dep]);

  return { payHistList };
}

export default useFetchPieChartData;
