import { useEffect, useState} from "react";
import {
  ClearState6,
  CustomerList,
} from "../../Slice/Customer/CustomerListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchCustomer(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  var at = localStorage.getItem("AccessToken");
  const { isloading6, CustomerDetail, isError6, error6, isSuccess6 } =
    useSelector((state) => state.CustomerList);
  const [custList, setCustList] = useState([]);
  useEffect(() => {
    if (at !== undefined && Object.keys(obj).length !== 0) {
      dispatch(CustomerList({ ...global, ...obj }));
    } else if (at !== undefined) {
      dispatch(CustomerList(global));
    }
  }, [...dep]);

  useEffect(() => {
    if (isSuccess6 && !isloading6 && at !== undefined ) {
      setCustList(CustomerDetail);
    } else {
      return;
    }
  }, [isSuccess6, isloading6]);

  useEffect(() => {
    if (isSuccess6 && CustomerDetail?.length == custList?.length) {
      dispatch(ClearState6());
    }
  }, [isSuccess6, custList?.length, CustomerDetail?.length]);
  var count = custList?.length;
  return { count, custList, isError6, error6, isSuccess6, isloading6 };
}

export default useFetchCustomer;
