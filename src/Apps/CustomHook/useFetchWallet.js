import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  WalletBalanceFunc,
  ClearState53,
} from "../../Slice/PaymentDetails/WalletBalanceSlice";
import UseFetchLogger from "./UseFetchLogger";
const useFetchWallet = (obj) => {
  const [wallBal, setWallBal] = useState(false);
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  //Collection List for Table
  const { isloading53, Resp53, isError53, error53, isSuccess53 } = useSelector(
    (state) => state.Wb
  );

  //Collection List
  useEffect(() => {
    if (at !== undefined) {
      dispatch(WalletBalanceFunc({ ...global, ...obj }));
    }
  }, []);

  useEffect(() => {
    if (isSuccess53 && !isloading53 && at !== undefined) {
      setWallBal(Resp53[0]);
    }
  }, [isSuccess53]);

  return { isloading53, wallBal, isError53, error53, isSuccess53 };
};
export default useFetchWallet;
