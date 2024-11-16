import React, { useEffect,useMemo } from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import { CardsDataFetchFunc, ClearState63 } from "../../Slice/Dashboard/CardsSlice";

function useFetchCards(obj = {}, dep = [], uniqueKey) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  const { isloading63, Resp63, isError63, error63, isSuccess63 } =
    useSelector((state) => state.DashboardCards);

  useEffect(() => {
    if (at !== undefined) {
      if (Object.keys(obj).length !== 0) {
        dispatch(CardsDataFetchFunc({ ...global, ...obj }));
      } else {
        dispatch(CardsDataFetchFunc(global));
      }
    }
  }, [...dep]);

    let CardData = useMemo(() => {if (isSuccess63) {
      return Resp63;
    }}, [isSuccess63]);

 
  return { CardData };
}

export default useFetchCards;
