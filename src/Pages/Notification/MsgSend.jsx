import { useEffect, useState } from "react";
import { Box} from "@mui/system";
import Grid from "@mui/system/Unstable_Grid/Grid";
import {
  Button,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  SendNotification,
  ClearState45,
} from "../../Slice/Notification/SendNotificationSlice";
import {
  UserListfunc,
} from "../../Slice/BackofficeUser/UserListSlice";
import MultipleSelection from "../../Components/Global/MultipleSelection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";
function MsgSend() {
  const dispatch = useDispatch();
  const [FormObj, setFormObj] = useState({});
  const [userid, setUserID] = useState([]);
  const [BranchId, setBranchId] = useState([]);
  const [Utype, setUtype] = useState([]);
  const [UserId, setUserId] = useState([]);

  //auth
  const { userInfo ,global} = UseFetchLogger();
const{branch}=useFetchBranch({Status:1},[],"")
  //global params
  var notiobj = {
    ...global,
    senderid: userInfo?.details?.UserID,
    senderName: userInfo?.details?.UserName,
  };

  //User List
  const { isloading47, Resp47,  isError47, isSuccess47 } = useSelector(
    (state) => state.UserList
  );

  //user list api call
  useEffect(() => {
    if (Utype?.length != 0) {
      var obj = { BranchId: BranchId, Utype: Utype };
      if (userInfo?.details?.Utype == 2) {
        obj.AgentCode = userInfo?.details?.AgentCode;
      }

      dispatch(UserListfunc({ ...notiobj, ...obj, Status: 1 }));
    }
  }, [ Utype,BranchId]);

  //userlist fetch
  useEffect(() => {
    if (isSuccess47 && !isloading47 && Utype?.length !== 0) {
      setUserID(Resp47);
    }
  }, [isSuccess47, isloading47, isError47, Utype,BranchId]);

  //Notification Send List
  const { isloading45, Resp45, error45, isError45, isSuccess45 } = useSelector(
    (state) => state.sendmsg
  );

  useEffect(() => {
    if (isSuccess45 && !isloading45) {
      toast.success(Resp45, { position: toast.POSITION.TOP_RIGHT });
    }
    if (isError45 && !isloading45) {
      toast.error(error45, { position: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState45());
    document.getElementById("notificationform").reset();
  }, [isSuccess45, isloading45, isError45]);

  const OnSubmitHandler = (e) => {
    e.preventDefault();
    let val = [];
    if (global?.Utype !== 3)
    {
      val = UserId;
    }
    else {
      val = [6801];
  }
    var finalObj = {
      ...FormObj,
      ...notiobj,
      rid: val,
    };
    dispatch(SendNotification(finalObj));
  };

  const OnChangeHandler = (e) => {
    var val = e.target.value;
    var key = e.target.name;
    setFormObj({ ...FormObj, [key]: val });
  };

  return (
    <Box
      id="notificationform"
      component={"form"}
      onSubmit={OnSubmitHandler}
      onChange={OnChangeHandler}
    >
      <ToastContainer autoClose={8000} />
      <Grid container color={"#000000"} sx={{ pt: 2}}>
        {global?.Utype !== 3 ? (
       
          <Grid item md={12} lg={12} sm={12} xs={12} 
            sx={{
              color: "black",
              display: "flex",
              justifyContent: "center",
              alignItems:"center",
           
              flexWrap:"wrap"
          }}>
              <MultipleSelection
                label={"Branch"}
                data={branch || []}
                ObjectKey={["BranchName"]}
                uniquekey={"BranchId"}
                ddwidth={"10rem"}
                setState={setBranchId}
                state={BranchId}
                deselectvalue={true}
                setfield2={setUserID}
                setfield3={setUtype}
              />
           
              <MultipleSelection
                label={"User Type"}
                data={[
                  { value: "SuperUser/Backoffice User", Utype: 1 },
                  { value: "agent", Utype: 2 },
                  { value: "Customer", Utype: 3 },
                ]}
                disabled={
                  global?.Utype !== 3
                    ? BranchId && BranchId?.length === 0
                    : false
                }
                ObjectKey={["value"]}
                uniquekey={"Utype"}
                ddwidth={"10rem"}
                setState={setUtype}
                state={Utype}
                deselectvalue={true}
                setfield3={setUtype}
              />
           
              <MultipleSelection
                label={"Users"}
                data={userid || []}
                disabled={Utype && Utype?.length === 0}
                ObjectKey={["UserName"]}
                uniquekey={"UserID"}
                ddwidth={"10rem"}
                setState={setUserId}
                state={UserId}
                deselectvalue={true}
              />
            </Grid>
       
        ) : null}

        {global?.Utype == 3 ? (
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            lg={12}
            mx={2}
            display={"flex"}
            justifyContent={"fleax-start"}
          >
            <Paper
              sx={{
                elevation: 5,
                textAlign: "center",
                px: 1,
                height: "2rem",
                mt: 1.5,
              }}
            >
              To....
            </Paper>
            <OutlinedInput
              size="small"
              required
              value={userInfo?.details?.SuperUserID==79 ?"Admin":null}
              name="ReceiverName"
              fullWidth
              sx={{ backgroundColor: "#ffffff" }}
            />
          </Grid>
        ) : null}
        <Grid
          item
          md={11}
          sm={11}
          xs={12}
          mx={2}
          display={"flex"}
          justifyContent={"fleax-start"}
        >
          <Paper
            sx={{
              elevation: 5,
              textAlign: "center",
              px: 1,
              height: "2rem",
              mt: 1.5,
            }}
          >
            from....
          </Paper>
          <OutlinedInput
            size="small"
            fullWidth
            value={
              userInfo?.details?.Utype == 3
                ? userInfo?.details?.CustomerName
                : userInfo?.details?.Name
            }
            multiline={true}
            required
            name="FromUserName"

            sx={{ m: 1, backgroundColor: "#ffffff" }}
          />
        </Grid>
        <Grid
          item
          md={11}
          sm={11}
          xs={12}
          mx={2}
          display={"flex"}
          justifyContent={"fleax-start"}
        >
          <Paper
            sx={{
              elevation: 5,
              textAlign: "center",
              px: 1,
              height: "2rem",
              mt: 1.5,
            }}
          >
            Subject
          </Paper>
          <OutlinedInput
            size="small"
            fullWidth
            multiline={true}
            required
            name="Subject"
          
            sx={{ m: 1, backgroundColor: "#ffffff" }}
          />
        </Grid>
        <Grid item md={11} sm={11} xs={12} mx={2} mt={3}>
          <TextField
            label="Write Massege here"
            multiline
            fullWidth
            rows={8}
            name="Message"
            sx={{ backgroundColor: "#ffffff" }}
          />
        </Grid>
        <Grid
          item
          md={11}
          mt={3}
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={OnSubmitHandler}
            type="submit"
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MsgSend;
