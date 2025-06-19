import { useEffect, useState} from "react";
import UseFetchLogger from "./UseFetchLogger";
import { useSelector, useDispatch } from "react-redux";
import { ClearState5, getAreaList } from "../../Slice/Area/AreaListSlice";

function useFetchArea(obj = {}, dep = []) {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { isloading5, areaList, isError5, error5, isSuccess5 } = useSelector(
    (state) => state.AreaList
  );
  var at = localStorage.getItem("AccessToken");

  const [AreaList, setAreaList] = useState([]);

  useEffect(() => {
    if (at && Object.keys(obj).length !== 0) {
      dispatch(getAreaList({ ...global, ...obj }));
    } else if (at) {
      dispatch(getAreaList(global));
    }
  }, dep);

  useEffect(() => {
    if (isSuccess5 && !isloading5 && at !== undefined) {
      setAreaList(areaList);
      
    } else {
      return;
    }
  }, [isSuccess5, ...dep]);
  
  useEffect(() => {
    if (isSuccess5 && AreaList?.length == areaList?.length) {
      dispatch(ClearState5());
    }
  }, [AreaList, isSuccess5, areaList]);

  return { AreaList, isError5, error5, isSuccess5, isloading5 };
}

export default useFetchArea;
