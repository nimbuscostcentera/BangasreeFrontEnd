import {useState } from "react";
import UnSeenMsgList from "./UnSeenMsgList";
import SeenMsgList from "./SeenMsgList";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
function MsgList() {
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ mt: 2, border: "1px solid #cfcfcf" }}>
      <TabContext value={value}>
        <Box
          sx={{
             borderBottom: "3px solid #CBCBCB",
            display: "flex",
            bgcolor: "whitesmoke",
            justifyContent: "space-between",
          }}
        >
          <TabList
            aria-label="Profile View"
            onChange={handleChange}
            variant="fullWidth"
          >
            <Tab label="Seen" value="1" sx={{ width: "48vh" }} />
            <Tab label="Unseen" value="2" sx={{ width: "48vh" }} />
          </TabList>
        </Box>
        <TabPanel value="1">
          <SeenMsgList />
        </TabPanel>
        <TabPanel value="2">
          <UnSeenMsgList />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default MsgList;
