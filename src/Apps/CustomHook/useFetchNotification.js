import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NotificationList,
  ClearState44,
} from "../../Slice/Notification/NotificationListSlice";

function useFetchNotification() {
  const dispatch = useDispatch();
  const [seen, setSeen] = useState();
  const [UnSeenMsg, setUnSeen] = useState([]);

  var at = localStorage.getItem("AccessToken");

  const { isloading44, Resp44, isSuccess44 } = useSelector(
    (state) => state.notify
  );

  const { userInfo } = useSelector((state) => state.auth);

  const { isError46, isSuccess46 } = useSelector((state) => state.readmsg);

  var global = {
    CompanyCode: userInfo?.details?.CompanyCode,
    UUid: userInfo?.details?.UUid,
    UserID: userInfo?.details?.UserID,
    senderName: userInfo?.details?.UserName,
  };

  useEffect(() => {
    if (at !== undefined) {
      dispatch(NotificationList(global));
    }
  }, [isError46, isSuccess46]);

  useEffect(() => {
    if (isSuccess44 && !isloading44 && at !== undefined) {
      var a = Resp44.filter((i) => i.Seen === null);
      setUnSeen(a);
      var b = Resp44.filter((i) => i.Seen === 1);

      setSeen(b);
      dispatch(ClearState44());
    } else {
      return;
    }
  }, [isSuccess44, isSuccess46]);

  return { UnSeenMsg, seen };
}

export default useFetchNotification;
