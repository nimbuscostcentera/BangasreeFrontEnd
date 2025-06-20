import  { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { Box } from "@mui/system";
import {
  Alert,
  AlertTitle,
  Stack,
  IconButton,
  TextField,
  Divider,
  Tooltip,
} from "@mui/material";

import ReusableDataTable from "../../Components/Global/ReusableTable";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import AreaRegForm from "./AreaRegForm";
import EditAreaForm from "./EditAreaForm";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import EditBranchForm from "./EditBranchForm";

import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import EditLocationOutlinedIcon from "@mui/icons-material/EditLocationOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAreaList } from "../../Slice/Area/AreaListSlice";
import {
  BranchCreatefunc,
  ClearState36,
} from "../../Slice/Area/BranchCreateSlice";
import {
  BranchStatusfunc,
  ClearState38,
} from "../../Slice/Area/BranchStatusSlice";
import { AreaCreatefunc, ClearState37 } from "../../Slice/Area/AreaCreateSlice";
import { AreaStatusfunc, ClearState39 } from "../../Slice/Area/AreaStatusSlice";
import { BranchList } from "../../Slice/Area/BranchListSlice";
import { BranchEdit, ClearState43 } from "../../Slice/Area/BranchEditSlice";
import { AreaEdit, ClearState42 } from "../../Slice/Area/AreaEditSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";


export default function BranchAreaManagement() {
  //area column
  const col = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    { field: "AreaName", headerName: "Area Name", width: 180, hideable: false },
    { field: "Pincode", headerName: "PinCode", width: 120 },
    { field: "District", headerName: "District", width: 180 },
    { field: "State", headerName: "State", width: 160 },
    { field: "country", headerName: "Country", width: 140 },
    {
      field: "Status",
      hideable: false,
      headerName: "Area Status",
      width: 140,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.Status == 1
              ? "Active"
              : item?.row?.Status == 0
              ? "Inactive"
              : item?.row?.Status == 3
              ? "Pending"
              : null}
          </>
        );
      },
    },
  ];
  //branch column
  const columns = [
    {
      field: "BranchName",
      headerName: "Branch Name",
      width: 180,
      hideable: false,
    },
    {
      field: "BranchCode",
      headerName: "Branch Code",
      width: 150,
      hideable: false,
    },
    {
      field: "BranchStatus",
      headerName: "Branch Status",
      width: 150,
      hideable: false,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.BranchStatus == 1
              ? "Active"
              : item?.row?.BranchStatus == 0
              ? "Inactive"
              : null}
          </>
        );
      },
    },
  ];

  const statusData = [
    { Status: 1, value: "Active" },
    { Status: 0, value: "InActive" },
  ];

  //hooks
  const [params, setParams] = useState({
    alert1: false,
    warning1: "",
    alert2: false,
    warning2: "",
  });
  const [view, setView] = useState({
    branchView: true,
    areaView: true,
  });
  const [branch, setbranch] = useState({
    BranchName: null,
    BranchCode: null,
  });
  const [EditBranchData, setEditBranchData] = useState({
    BranchName: null,
    BranchCode: null,
  });
  const [tableData, setTableData] = useState([]);
  const [area, setArea] = useState([]);
  const [saveAreaFormData, setsaveAreaFormData] = useState({
    AreaName: null,
    District: null,
    state: "West Bengal",
    country: "India",
    PinCode: null,
  });
  const [editAreaFormData, setEditAreaFormData] = useState({
    AreaName: null,
    District: null,
    state: "West Bengal",
    country: "India",
    PinCode: null,
  });
  const [ids, setIds] = useState([]);
  const [aids, setAids] = useState([]);

  const [Filters1, setFilters1] = useState({ Status: "" });
  const [Filters2, setFilters2] = useState({ Status: "" });
  const [openDialog, setOpenDialog] = useState({
    openForm: false,
    openForm1: false,
    openForm2: false,
  });
  const [selectedObj, setselectedObj] = useState({});
  const dispatch = useDispatch();

  //Logger detail
  const { global} = UseFetchLogger();

  // AreaList
  const { isloading5} = useSelector(
    (state) => state.AreaList
  );
  //Area create
  const { isloading37, Resp37, error37, isError37, isSuccess37 } = useSelector(
    (state) => state.AreaCreate
  );
  //AreaStatus
  const { isloading39, Resp39, error39, isError39, isSuccess39 } = useSelector(
    (state) => state.AreaStatus
  );
  //area edit
  const { isloading42, Resp42, error42, isError42, isSuccess42 } = useSelector(
    (state) => state.EditArea
  );

  // BranchList
  const { isloading35, Resp35, isError35, isSuccess35 } = useSelector(
    (state) => state.branch
  );
  //branch create branchCreate
  const { isloading36, Resp36, error36, isError36, isSuccess36 } = useSelector(
    (state) => state.branchCreate
  );
  // BranchStatus
  const { isloading38, Resp38, error38, isError38, isSuccess38 } = useSelector(
    (state) => state.branchStatus
  );
  //branch edit
  const { isloading43, Resp43, error43, isError43, isSuccess43 } = useSelector(
    (state) => state.EditBranch
  );

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Branch,Area")[0];

  // branchList Api Call
  useEffect(() => {
    dispatch(BranchList({ ...global, ...Filters1 }));
  }, [Filters1, isSuccess36, isSuccess38, isSuccess43, view?.branchView]);

  //Branch List
  useEffect(() => {
    if (isSuccess35 && !isError35) {
      setTableData(Resp35);
    }
  }, [
    Filters1,
    isSuccess36,
    isSuccess38,
    isSuccess43,
    isSuccess35,
    view?.branchView,
  ]);

  //branch creation
  useEffect(() => {
    if (!isloading36 && isSuccess36) {
      toast.success(Resp36, { positions: toast.POSITION.TOP_RIGHT });
      setbranch({
        BranchName: null,
        BranchCode: null,
      });
      setView({ ...view, branchView: true });
    }
    if (!isloading36 && isError36) {
      toast.error(error36, { positions: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState36());
  }, [isError36, isSuccess36]);

  //branch Status change
  useEffect(() => {
    if (!isloading38 && isSuccess38) {
      toast.success(Resp38, { positions: toast.POSITION.TOP_RIGHT });
    }
    if (!isloading38 && isError38) {
      toast.error(error38, { positions: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState38());
  }, [isSuccess38, isError38]);

  //branch edit msg
  useEffect(() => {
    if (isSuccess43 && !isError43) {
      toast.success(Resp43, { position: toast.POSITION.TOP_RIGHT });
      setOpenDialog({ ...openDialog, openForm1: false });
      setIds([]);
    }
    if (!isloading43 && isError43) {
      toast.error(error43, { position: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState43());
  }, [isError43, isSuccess43]);

  // AreaList Api Call
  useEffect(() => {
    dispatch(getAreaList({ ...global, ...Filters2 }))
      .then((res) => {
        if (res.payload) {
          setArea(res.payload);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isSuccess39, isSuccess42, isSuccess37, Filters2, view?.areaView]);

  //area create
  useEffect(() => {
    if (!isloading37 && isSuccess37) {
      toast.success(Resp37, { positions: toast.POSITION.TOP_RIGHT });
    }
    if (!isloading37 && isError37) {
      toast.error(error37, { positions: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState37());
  }, [isError37, isSuccess37, isloading37]);

  //area Status update
  useEffect(() => {
    if (!isloading39 && isSuccess39) {
      toast.success(Resp39, { positions: toast.POSITION.TOP_RIGHT });
    }
    if (!isloading39 && isError39) {
      toast.error(error39, { positions: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState39());
  }, [isError39, isSuccess39, isloading39]);

  //area edit List
  useEffect(() => {
    if (isSuccess42 && !isError42) {
      toast.success(Resp42, { position: toast.POSITION.TOP_RIGHT });
    }
    if (!isloading42 && isError42) {
      toast.error(error42, { position: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState42());
  }, [isError42, isSuccess42]);
  //branch alert off
  useEffect(() => {
    if (ids && ids.length < 2) {
      setParams({ ...params, alert1: false, warning1: "" });
    }
  }, [ids]);
  //area alert off
  useEffect(() => {
    if (aids && aids.length < 2) {
      setParams({ ...params, alert2: false, warning2: "" });
    }
  }, [aids]);
  //toggle button for branch
  const BranchToggler = () => {
    setView({ ...view, branchView: !view?.branchView });
    setEditBranchData({ ...selectedObj });
  };
  //toggle button for area
  const AreaToggler = () => {
    setView({ ...view, areaView: !view?.areaView });
    let obj = Object.keys(selectedObj).reduce((acc, key) => {
      if (key == "State") {
        acc["state"] = selectedObj[key];
      }
      if (key == "Pincode") {
        acc["PinCode"] = selectedObj[key];
      } else {
        acc[key] = selectedObj[key];
      }
      return acc;
    }, {});
    setEditAreaFormData(obj);
  };
  //Branch Object filter
  const BranchObjectFilter = () => {
    var a=null,
      sobj = [];

    if (ids.length > 1) {
      setParams({
        ...params,
        alert1: true,
        warning1: "Select only one row to edit Branch.",
      });
    } else {
      a = ids[0];
      sobj = tableData.filter((item) => {
        return item?.BranchId === a;
      });
      var b = sobj[0];
      setselectedObj(b);
      setEditBranchData(b);
      setOpenDialog({ ...openDialog, openForm1: true });
    }
  };

  const AreaObjectFilter = () => {
    var a=null,
      sobj = [];
    if (aids.length > 1) {
      setParams({
        ...params,
        alert2: true,
        warning2: "Select only one row to edit Area",
      });
    } else {
       a = aids[0];
      sobj = area.filter((item) => {
        return item?.AreaID === a;
      });
      var b = sobj[0];

      let final = Object.keys(b).reduce((acc, key) => {
        console.log(key, b[key]);
        if (key == "State") {
          acc["state"] = b[key];
        } else if (key == "Pincode") {
          acc["PinCode"] = b[key];
        } else {
          acc[key] = b[key];
        }
        return acc;
      }, {});
      console.log(final);
      setselectedObj(final);
      setEditAreaFormData(final);
      setOpenDialog({ ...openDialog, openForm2: true });
    }
  };

  //input hadler for edit branch
  const ManageEditBranch = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    setEditBranchData({ ...EditBranchData, [key]: value });
  };

  //Branch  edit submit
  function OnEditBranch(e) {
    e.preventDefault();
    const finalObj = Object.keys(EditBranchData).reduce((acc, key) => {
      if (
        EditBranchData[key] !== "" &&
        EditBranchData[key] !== null &&
        EditBranchData[key] !== undefined
      ) {
        acc[key] = EditBranchData[key];
      }
      return acc;
    }, {});
    dispatch(BranchEdit({ ...global, ...finalObj, BranchId: ids[0] }));
  }

  //Branch status control
  const ApprovedBranchStatusHandler = () => {
    const UserData = { Status: 1, SelectedID: ids };
    dispatch(BranchStatusfunc({ ...global, ...UserData }));
    setIds([]);
  };
  //Branch status control
  const RejectBranchStatusHandler = () => {
    const UserData = { Status: 0, SelectedID: ids };

    dispatch(BranchStatusfunc({ ...global, ...UserData }));
    setIds([]);
  };
  //Branch Create input manage
  function BranchInputHandler(e) {
    var value = e.target.value;
    var key = e.target.name;
    setbranch({ ...branch, [key]: value });
  }
  //Branch create submit
  function BranchCreationHandler(e) {
    e.preventDefault();
    var finalObj = { ...branch, ...global };
    dispatch(BranchCreatefunc(finalObj));
  }

  //area status
  const ApprovedAreaStatusHandler = () => {
    // var aids = AreaIdCalculation();

    const UserData = { Status: 1, AreaID: aids };
    dispatch(AreaStatusfunc({ ...global, ...UserData }));
    setAids([]);
  };
  //Area approval
  const RejectAreaStatusHandler = () => {
    // var aids = AreaIdCalculation();

    const UserData = { Status: 0, AreaID: aids };
    dispatch(AreaStatusfunc({ ...global, ...UserData }));
    setAids([]);
  };
  //Area creation
  function SubmitAreaReg(e) {
    e.preventDefault();
    dispatch(AreaCreatefunc({ ...saveAreaFormData, ...global }));
    handleClose();
  }
  //input manage of area edit form
  const InputHandlerEditArea = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    setEditAreaFormData({ ...editAreaFormData, [key]: value });
  };
  //Area Edit submit
  function OnEditArea(e) {
    e.preventDefault();
    const obj = Object.keys(editAreaFormData).reduce((acc, key) => {
      if (
        editAreaFormData[key] !== "" &&
        editAreaFormData[key] !== null &&
        editAreaFormData[key] !== undefined
      ) {
        acc[key] = editAreaFormData[key];
      }
      return acc;
    }, {});
    var finalObj = { ...obj, AreaID: aids[0], ...global };
    dispatch(AreaEdit({ ...global, ...finalObj }));
    setOpenDialog({ ...openDialog, openForm2: false });
  }

  //close popover
  function handleClose() {
    setOpenDialog({ ...openDialog, openForm: false });
    setAids([]);
  }
  function handleClose1() {
    setOpenDialog({ ...openDialog, openForm1: false });
    setIds([]);
  }
  function handleClose2() {
    setOpenDialog({ ...openDialog, openForm2: false });
    setAids([]);
  }

  return (
    <Grid container ml={3} mt={2} maxWidth={"xl"}>
      <ToastContainer autoClose={5000} />
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
        {" "}
        <Box mr={3} mt={1}>
          <ReusableBreadcrumbs
            props={[
              {
                title: "Home",
                link: global.Utype == 1 ? "/executive" : "/agent",
                icon: "home",
              },
              {
                title: "Manage Branch Area",
                link: "#",
                icon: "manage_accounts",
              },
            ]}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} mt={1}>
        <Divider />
      </Grid>
      {params?.alert1 ? (
        <Grid item md={12} sm={12} xs={12} lg={12}>
          {" "}
          <Box display={"flex"} justifyContent={"space-between"}>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                severity="error"
                onClose={() => {
                  setParams({
                    ...params,
                    alert1: false,
                    warning1: "",
                  });
                }}
              >
                <AlertTitle>Warning</AlertTitle>
                {params?.warning1}
              </Alert>
            </Stack>
          </Box>
        </Grid>
      ) : null}
      {myPermission?.Create == 1 ? (
        <Grid item sm={12} xs={12} md={12} lg={12} mt={1}>
          <Box
            display={"flex"}
            justifyContent={"flex-stat"}
            flexWrap={"wrap"}
            component={"form"}
            onSubmit={BranchCreationHandler}
            onChange={BranchInputHandler}
          >
            <TextField
              required
              name="BranchName"
              label="Branch Name"
              variant="outlined"
              size="small"
              value={branch?.BranchName || ""}
              sx={{ mr: 2, mt: 1, mb: 2 }}
            />
            <TextField
              required
              name="BranchCode"
              label="Branch Code"
              variant="outlined"
              value={branch?.BranchCode || ""}
              size="small"
              sx={{ mr: 2, mt: 1 }}
            />

            <Tooltip title="Add Branch">
              <span>
                <IconButton
                  size="large"
                  aria-label="AddBoxIcon"
                  type="submit"
                  onClick={BranchCreationHandler}
                  disabled={
                    branch?.BranchCode && branch?.BranchName ? false : true
                  }
                >
                  <AddBoxOutlinedIcon fontSize="large" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Reset">
              <span>
                <IconButton
                  size="large"
                  aria-label="AddBoxIcon"
                  type="reset"
                  onClick={() => {
                    setbranch({
                      BranchName: null,
                      BranchCode: null,
                    });
                  }}
                >
                  <RestartAltIcon fontSize="large" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Grid>
      ) : null}

      <Grid
        item
        sm={12}
        xs={12}
        md={12}
        lg={12}
        display={"flex"}
        justifyContent={"flex-start"}
        flexWrap={"wrap"}
        alignItems={"center"}
      >
        <Box mt={1} minWidth={"150px"} mr={3}>
          <ReusableDropDown4
            label={"Branch Status"}
            data={statusData || []}
            ObjectKey={["value"]}
            uniquekey={"Status"}
            Field={Filters1["Status"]}
            deselectvalue={true}
            onChange={(e) => {
              setFilters1({ Status: e.target.value });
            }}
          />
        </Box>

        <IconOnOffButton
          h1={myPermission?.Edit == 1 ? "Edit Branch" : null}
          icon1={
            myPermission?.Edit == 1 ? (
              <EditLocationAltIcon fontSize="medium" />
            ) : null
          }
          Tooltip1={myPermission?.Edit == 1 ? "Edit Branch Details" : null}
          funcTrigger1={myPermission?.Edit == 1 ? BranchObjectFilter : null}
          textcolor1={ids && ids.length == 0 ? "grey" : "black"}
          disable1={ids && ids.length == 0 ? true : false}
          h2={"Filter Out"}
          icon2={<FilterAltOffIcon fontSize="medium" />}
          Tooltip2={"Filter Out"}
          funcTrigger2={() => {
            setIds([]);
            setFilters1({ Status: "" });
          }}
        />

        {myPermission?.Edit == 1 ? (
          <EditBranchForm
            EditableData={EditBranchData}
            onSubmitForm={OnEditBranch}
            handleClose={handleClose1}
            openform={openDialog?.openForm1}
            InputHandlerEditBranch={ManageEditBranch}
            Branchtogglefunc={BranchToggler}
            view={view?.branchView}
          />
        ) : null}
        {myPermission?.Edit == 1 ? (
          <IconOnOffButton
            h1={"Active"}
            h2={"Inactive"}
            textcolor1={ids && ids.length == 0 ? "grey" : "#1b5e20"}
            textcolor2={ids && ids.length == 0 ? "grey" : "#c62828"}
            icon1={
              <CheckCircleOutlineOutlinedIcon
                fontSize="medium"
                color={ids && ids.length == 0 ? "disabled" : "success"}
              />
            }
            icon2={
              <CancelOutlinedIcon
                fontSize="medium"
                color={ids && ids.length == 0 ? "disabled" : "error"}
              />
            }
            Tooltip1={"Active Branch"}
            Tooltip2={"Inactive Branch"}
            disable1={ids.length == 0 ? true : false}
            disable2={ids.length == 0 ? true : false}
            funcTrigger1={ApprovedBranchStatusHandler}
            funcTrigger2={RejectBranchStatusHandler}
          />
        ) : null}
      </Grid>

      <Grid item sm={12} xs={12} md={12} mt={2}>
        <ReusableDataTable
          uniqueid={"BranchId"}
          columns={columns}
          rows={tableData}
          state={ids}
          selectState={(arr) => { setIds(arr) }}
          isloading={isloading35}
          height={350}
        />
      </Grid>
      {params?.alert2 ? (
        <Grid item md={12} sm={12} xs={12} lg={12} mt={5}>
          {" "}
          <Box display={"flex"} justifyContent={"space-between"}>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                severity="error"
                onClose={() => {
                  setParams({ ...params, alert2: false, warning2: "" });
                }}
              >
                <AlertTitle>Warning</AlertTitle>
                {params?.warning2}
              </Alert>
            </Stack>
          </Box>
        </Grid>
      ) : null}
      <Grid
        item
        sm={12}
        xs={12}
        md={12}
        mt={2}
        display={"flex"}
        justifyContent={"flex-start"}
        flexWrap={"wrap"}
        alignItems={"center"}
      >
        <Box mr={2} minWidth={"150px"}>
          <ReusableDropDown4
            label={"Area Status"}
            data={statusData || []}
            ObjectKey={["value"]}
            uniquekey={"Status"}
            Field={Filters2["Status"]}
            onChange={(e) => {
              setFilters2({ Status: e.target.value });
            }}
            deselectvalue={true}
          />
        </Box>
        <IconOnOffButton
          h1={myPermission?.Create == 1 ? "Add Area" : null}
          icon1={
            myPermission?.Create == 1 ? (
              <AddCircleOutlineIcon fontSize="medium" />
            ) : null
          }
          Tooltip1={myPermission?.Create == 1 ? "Add Area" : null}
          funcTrigger1={
            myPermission?.Create == 1
              ? () => {
                  setsaveAreaFormData({
                    AreaName: null,
                    District: null,
                    state: "West Beangal",
                    country: "India",
                    PinCode: null,
                  });
                  setOpenDialog({ ...openDialog, openForm: true });
                }
              : null
          }
          h2={myPermission?.Edit == 1 ? "Edit Area" : null}
          textcolor2={aids && aids.length == 0 ? "grey" : "black"}
          icon2={
            myPermission?.Edit == 1 ? (
              <EditLocationOutlinedIcon fontSize="medium" />
            ) : null
          }
          Tooltip2={myPermission?.Edit == 1 ? "Edit Area" : null}
          funcTrigger2={
            myPermission?.Create == 1
              ? () => {
                  AreaObjectFilter();
                  setOpenDialog({ ...openDialog, openForm2: true });
                }
              : null
          }
          disable2={aids && aids.length == 0 ? true : false}
        />
        {myPermission?.Edit == 1 ? (
          <AreaRegForm
            openform={openDialog?.openForm}
            onSubmitForm={SubmitAreaReg}
            handleClose={handleClose}
            setState={setsaveAreaFormData}
            mystate={saveAreaFormData}
          />
        ) : null}
        {myPermission?.Edit == 1 ? (
          <EditAreaForm
            EditableData={editAreaFormData}
            onSubmitForm={OnEditArea}
            handleClose={handleClose2}
            openform={openDialog?.openForm2}
            AreaTogglefunc={AreaToggler}
            onChangeHandler={InputHandlerEditArea}
            view={view?.areaView}
          />
        ) : null}
        {myPermission?.Edit == 1 ? (
          <IconOnOffButton
            h1={"Active"}
            h2={"Inactive"}
            textcolor1={aids && aids.length == 0 ? "grey" : "#1b5e20"}
            textcolor2={aids && aids.length == 0 ? "grey" : "#c62828"}
            icon1={
              <CheckCircleOutlineOutlinedIcon
                fontSize="medium"
                color={aids && aids.length == 0 ? "disabled" : "success"}
              />
            }
            icon2={
              <CancelOutlinedIcon
                fontSize="medium"
                color={aids && aids.length == 0 ? "disabled" : "error"}
              />
            }
            Tooltip1={"Active Area"}
            Tooltip2={"Inactive Area"}
            disable1={aids.length == 0 ? true : false}
            disable2={aids.length == 0 ? true : false}
            funcTrigger1={ApprovedAreaStatusHandler}
            funcTrigger2={RejectAreaStatusHandler}
          />
        ) : null}

        <IconOnOffButton
          h1={"Filter Out"}
          Tooltip1={"Filter Out"}
          icon1={<FilterAltOffIcon fontSize="medium" />}
          funcTrigger1={() => {
            setAids([]);
            setFilters2({ Status: "" });
          }}
        />
      </Grid>
      <Grid item sm={12} xs={12} md={12} mt={2}>
        <ReusableDataTable
          uniqueid={"AreaID"}
          columns={col}
          rows={area}
          state={aids}
          selectState={(arr) => { setAids(arr) }}
          isloading={isloading5}
          height={450}
        />
      </Grid>
    </Grid>
  );
}
