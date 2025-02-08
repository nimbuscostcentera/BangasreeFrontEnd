import React, { useEffect, useState } from "react";
import {
  PermissionList,
  ClearState14,
} from "../../Slice/Page/PagePermissionSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";

function useFetchCheckPerm(PageName) {
  const [myPermission, setPer] = useState({});
  const [perm, setPerm] = useState([]);
  const { global } = UseFetchLogger();
  const { isloading14, PermissionData, isError14, isSuccess14, error14 } =
    useSelector((state) => state.Permission);
  const dispatch = useDispatch();

  useEffect(() => {
    setPerm(PermissionData);
  }, [isSuccess14]);
  let parray = [];
  let Perdata = localStorage.getItem("loggerPermission");
  if (Perdata) {
    parray = JSON.parse(Perdata);
  }

  //permission show
  useEffect(() => {
    if (
      isSuccess14 &&
      !isloading14 &&
      PermissionData.length !== 0 &&
      parray.length != 0
    ) {
      var p = "";
      if (PageName === "Manage Backoffice") {
        p =  parray && parray.filter((i) => i?.PageName === "Manage Backoffice");
      } else if (PageName === "Manage Agent") {
        p =  parray && parray.filter((i) => i?.PageName === "Manage Agent");
      } else if (PageName === "Manage Customer") {
        p =  parray && parray.filter((i) => i?.PageName === "Manage Customer");
      } else if (PageName === "Manage Permission") {
        p =  parray && parray.filter((i) => i?.PageName === "Manage Permission");
      } else if (PageName === "Manage Schemes") {
        p =  parray && parray.filter((i) => i?.PageName === "Manage Schemes");
      } else if (PageName === "Manage Subscriptions") {
        p =  parray && parray.filter((i) => i?.PageName === "Manage Subscriptions");
      } else if (PageName === "Manage Collections") {
        p =  parray && parray.filter((i) => i?.PageName === "Manage Collections");
      } else if (PageName === "Manage Leads") {
        p =  parray && parray.filter((i) => i?.PageName === "Manage Leads");
      } else if (PageName === "Manage Branch,Area") {
        p =  parray && parray.filter((i) => i?.PageName === "Manage Branch,Area");
      } else if (PageName === "Notification") {
        p =  parray && parray.filter((i) => i?.PageName === "Notification");
      }
      if (p?.length !== 0) {
        setPer(p[0]);
      }
    }
   
  }, [PageName, parray, isSuccess14]);

  return { myPermission };
}

export default useFetchCheckPerm;
