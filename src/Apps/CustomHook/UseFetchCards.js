import  { useEffect,useState } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import { CardsDataFetchFunc, ClearState63 } from "../../Slice/Dashboard/CardsSlice";

function useFetchCards(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  const { isloading63, Resp63, isSuccess63 } =
    useSelector((state) => state.DashboardCards);

  const [CardData, setCardData] = useState([]);
  
  useEffect(() => {
    if (at !== undefined) {
      if (Object.keys(obj).length !== 0) {
        dispatch(CardsDataFetchFunc({ ...global, ...obj }));
      } else {
        dispatch(CardsDataFetchFunc(global));
      }
    }
  }, [...dep]);

  useEffect(() => {
    if (isSuccess63 && !isloading63 && at !== undefined) {
      setCardData(Resp63);
      dispatch(ClearState63());
    }
    else {
      return;
    }
  }, [isloading63,isSuccess63, ...dep]);

 
  return { CardData };
}

export default useFetchCards;
