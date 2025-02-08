import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Divider,
  IconButton,
  Box,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddBoxOutlined as AddBoxOutlinedIcon,
  RestartAlt as RestartAltIcon,
  Edit as EditIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import ReusableDataTable from "../../Components/Global/ReusableTable";

import {
  ClearState76,
  AddPurityFunc,
} from "../../Slice/PurityVsRate/AddPuritySlice";
import {
  ClearState78,
  addRateVsPurityFunc,
} from "../../Slice/PurityVsRate/AddRateVsPuritySlice";

import MockDataPurityRate from "../../dummy_data/MockDataPurityRate";
import usefetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchPuritylist from "../../Apps/CustomHook/useFetchPurityList";
import useFetchGoldRateList from "../../Apps/CustomHook/useFetchGoldRateList";
import AddPurityform from "./AddPurityform";
function PurityMetalRateManagement() {
  const currdt = moment();
  const [show, setShow] = useState(false);
  const [purity, setPurity] = useState({ PURITY: null, DESCRIPTION: null });
  const [RateVsPurityData, setRateVsPurityData] = useState({
    GOLD_RATE: null,
    ID_PURITY: -1,
    DESCRIPTION: null,
    date: currdt,
  });
  const { isloading76, isError76, isSuccess76, Resp76, error76 } = useSelector(
    (state) => state.InserPurity
  );
  const { isloading78, isError78, isSuccess78, Resp78, error78 } = useSelector(
    (state) => state.addpurityrate
  );
  const { global } = usefetchLogger();
  const { plist } = useFetchPuritylist({}, [isSuccess76]);
  const { rateList } = useFetchGoldRateList({}, [isSuccess78]);
  const dispatch = useDispatch();
  const HandleClose = () => {
    setShow(false);
  };
  const HandleOpen = () => {
    setShow(true);
  };
  //purity add
  const SavePurity = (e) => {
    e.preventDefault();
    console.log(purity);
    dispatch(AddPurityFunc({ ...global, ...purity }));
  };
  const PurityHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    setPurity({ ...purity, [key]: value });
  };
  //Metal rate set
  const RateVsPurityHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    if (key === "ID") {
      setRateVsPurityData({ ...RateVsPurityData, ["ID_PURITY"]: value });
    } else {
      setRateVsPurityData({ ...RateVsPurityData, [key]: value });
    }
  };
  const SubmitRateVsPurity = (e) => {
    e.preventDefault();
    console.log(RateVsPurityData);
    dispatch(addRateVsPurityFunc({ ...global, ...RateVsPurityData }));
  };
  //add purity response
  useEffect(() => {
    if (!isloading76 && isSuccess76) {
      toast.success(Resp76, { autoClose: 5000, position: "top-right" });
      setPurity({
        DESCRIPTION: null,
        PURITY: null,
      });
    }
    if (!isloading76 && isError76) {
      toast.error(error76, { autoClose: 5000, position: "top-right" });
    }
    dispatch(ClearState76());
  }, [isSuccess76, isloading76, isError76]);
  //response purity rate
  useEffect(() => {
    if (!isloading78 && isSuccess78) {
      toast.success(Resp78, { autoClose: 5000, position: "top-right" });
      setRateVsPurityData({
        date: null,
        DESCRIPTION: null,
        GOLD_RATE: null,
        ID_PURITY: -1,
      });
    }
    if (!isloading78 && isError78) {
      toast.error(error78, { autoClose: 5000, position: "top-right" });
    }
    dispatch(ClearState78());
  }, [isSuccess78, isloading78, isError78]);

  //column
  const Col = [
    {
      field: "ID",
      headerName: "ID",
      width: 80,
      editable: true,
      hideable: false,
    },
    {
      field: "PURITY",
      headerName: "Purity",
      width: 120,
      editable: true,
      type: "textinput",
      hideable: false,
    },
    {
      field: "GOLD_RATE",
      headerName: "Rate",
      width: 150,
      editable: true,
      type: "selection",
      hideable: false,
    },
    {
      field: "CURRDATE",
      headerName: "Date",
      width: 150,
      editable: true,
      type: "selection",
      hideable: false,
      renderCell: (item) => {
        return (
          <>
            {moment(item?.row?.CURRDATE).format("DD/MM/YYYY")}
          </>
        );
      },
    },
  ];
  return (
    <Grid
      container
      ml={2}
      mt={2}
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={{
        xl: "flex-start",
        lg: "flex-start",
        md: "flex-start",
        sm: "center",
        xs: "center",
      }}
      flexWrap={"wrap"}
    >
      <ToastContainer />

      <Grid
        item
        sm={12}
        xs={12}
        md={12}
        lg={12}
        display={"flex"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box mr={3} mt={1}>
          <ReusableBreadcrumbs
            props={[
              {
                title: "Home",
                link: global.Utype == 1 ? "/executive" : "/agent",
                icon: "change_circle",
              },
              {
                title: "Manage Gold Rate vs Purity",
                link: "#",
                icon: "note_add",
              },
            ]}
          />
        </Box>
        <Box
          sx={{
            mt: 1,
            color: "grey",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography>Add Purity</Typography>
          <IconButton onClick={HandleOpen}>
            <AddCircleOutlineIcon sx={{ color: "grey", fontSize: "25px" }} />
          </IconButton>
          <AddPurityform
            InputHandler={PurityHandler}
            PrtData={purity}
            handleClose={HandleClose}
            onSubmitForm={SavePurity}
            open={show}
          />
        </Box>
      </Grid>
      <Grid xs={12} xl={12}>
        <Divider />
      </Grid>
      {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <Grid container>
          <Grid item sm={12} xs={12} md={12} lg={12} xl={12} mt={0} mr={1}>
            <Typography
              sx={{
                color: "grey",
                fontSize: "17px",
                my: 1,
                mr: 2,
                textWrap: "nowrap",
                textAlign: "center",
              }}
            >
              {`Add Purity Here`}
            </Typography>
          </Grid>
          <Grid item sm={5} xs={12} md={5} lg={5} xl={5} mt={1.5} mx={2}>
            <TextField
              required
              name="PURITY"
              label="Purity"
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              sx={{ mr: 1 }}
              value={purity?.PURITY || ""}
              onChange={PurityHandler}
            />
          </Grid>
          <Grid item sm={5} xs={12} md={5} lg={5} xl={5} mt={1.5} mr={2} mx={2}>
            <TextField
              required
              name="DESCRIPTION"
              label="Description"
              variant="outlined"
              size="small"
              type="text"
              fullWidth
              value={purity?.DESCRIPTION || ""}
              onChange={PurityHandler}
            />
          </Grid>
          <Grid
            item
            sm={6}
            xs={6}
            md={6}
            lg={6}
            xl={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title="Add Purity">
              <span>
                <IconButton
                  size="large"
                  aria-label="AddBoxIcon"
                  type="submit"
                  onClick={SavePurity}
                  disabled={purity ? false : true}
                >
                  <AddBoxOutlinedIcon fontSize="large" />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
          <Grid
            item
            sm={6}
            xs={6}
            md={6}
            lg={6}
            xl={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title="Reset">
              <span>
                <IconButton
                  size="large"
                  aria-label="AddBoxIcon"
                  type="reset"
                  onClick={() => {
                    setPurity({ PURITY: null, DESCRIPTION: null });
                  }}
                >
                  <RestartAltIcon fontSize="large" />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid> */}

      <Grid item sm={12} xs={12} md={12} lg={12} xl={12} mx={1}>
        <Typography
          variant="h5"
          sx={{
            color: "grey",
            fontSize: "17px",
            my: 1,
            mx: 2,
            textWrap: "nowrap",
            textAlign: "start",
          }}
        >
          Set Metal Rate according to Purity
        </Typography>
      </Grid>

      <Grid item sm={5} xs={12} md={3.8} lg={3} xl={2.5} mx={3}>
        <TextField
          required
          name="GOLD_RATE"
          label="Rate/Gm"
          variant="outlined"
          size="small"
          fullWidth
          onChange={RateVsPurityHandler}
          value={RateVsPurityData?.GOLD_RATE || ""}
          sx={{
            my: 1.5,
            mr: 2,
          }}
        />
      </Grid>

      <Grid item sm={5} xs={12} md={3.8} lg={3} xl={2.5} mt={0.5} mr={2} mx={3}>
        <ReusableDropDown4
          Field={RateVsPurityData?.ID_PURITY}
          ObjectKey={["PURITY"]}
          data={plist || []}
          deselectvalue={false}
          disabled={false}
          id={"d1"}
          label={"Purity"}
          onChange={RateVsPurityHandler}
          uniquekey={"ID"}
          key={1}
        />
      </Grid>

      <Grid
        item
        sm={6}
        xs={6}
        md={1.5}
        lg={2}
        xl={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-10px",
        }}
      >
        <Tooltip title="Add Metal Rate">
          <span>
            <IconButton
              size="large"
              aria-label="AddBoxIcon"
              type="submit"
              onClick={SubmitRateVsPurity}
              disabled={purity ? false : true}
            >
              <EditIcon fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>
      </Grid>

      <Grid
        item
        sm={6}
        xs={6}
        md={1.5}
        lg={2}
        xl={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-10px",
        }}
      >
        <Tooltip title="Reset">
          <span>
            <IconButton
              size="large"
              aria-label="AddBoxIcon"
              type="reset"
              onClick={() => {
                setRateVsPurityData({ ID_PURITY: -1, Rate: null });
              }}
            >
              <RestartAltIcon fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>
      </Grid>

      <Grid item sm={12} xs={12} md={12} lg={12} ms={2}>
        <ReusableDataTable
          columns={Col}
          rows={rateList || []}
          isloading={false}
          setState={setRateVsPurityData}
          state={RateVsPurityData}
          uniqueid={"ID"}
          key={1}
          height={"60vh"}
          width="98%"
        />
      </Grid>
    </Grid>
  );
}

export default PurityMetalRateManagement;
