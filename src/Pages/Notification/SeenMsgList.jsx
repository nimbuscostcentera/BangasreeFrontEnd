import { Box } from "@mui/system";
import SubList from "./SubList";
import useFetchNotification from "../../Apps/CustomHook/useFetchNotification";
import PropTypes from "prop-types";
function SeenMsgList({setNobj, setToggle ,nobj }) {
  const { seen=[] } = useFetchNotification();
  return (
    <Box
      sx={{
        color: "black",
        height: "75vh",
        overflow: "hidden",
        overflowY: "scroll",
        border: "1px solid #ccc",
      }}
    >
      {seen.length !== 0 || seen.length !== undefined ? (
        <SubList
          setToggle={setToggle}
          setNobj={setNobj}
          MsgArray={seen || []}
          nobj={nobj}
        />
      ) : null}
    </Box>
  );
}
SeenMsgList.propTypes = {
  setNobj: PropTypes.func,
  setToggle: PropTypes.func,
  nobj: PropTypes.object,
};

export default SeenMsgList;
