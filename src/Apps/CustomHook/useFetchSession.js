import { useEffect, useState } from "react";
import {
  ClearState71,
  SessionListfunc,
} from "../../Slice/Dashboard/SessionListSlice";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
function useFetchSession() {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading71, Resp71, isError71, error71, isSuccess71 } = useSelector(
    (state) => state.session
  );
  var at = localStorage.getItem("AccessToken");
const [session, setSession] = useState([]);
  useEffect(() => {
    if (at !== undefined) {
      dispatch(SessionListfunc({ ...global }));
    }
  }, []);

  useEffect(() => {
    if (isSuccess71 && !isloading71) {
      setSession(Resp71);
      dispatch(ClearState71());
    } else {
      return;
    }
  }, [isSuccess71, isloading71]);

  return { isError71, session, error71, isSuccess71, isloading71 };
}

export default useFetchSession;
