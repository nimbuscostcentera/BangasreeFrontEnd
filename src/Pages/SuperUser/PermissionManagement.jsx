import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  Divider,
  Box,
  Grid,
} from "@mui/material";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SaveIcon from "@mui/icons-material/Save";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import {
  ClearState47,
  UserListfunc,
} from "../../Slice/BackofficeUser/UserListSlice";
import {
  PermissionList,
  ClearState14,
} from "../../Slice/Page/PagePermissionSlice";
import {
  PermissionAdd,
  ClearState15,
} from "../../Slice/Page/PermissionAddSlice";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";

const test = (item) => {
  return (
    <>
      {item.row.usertype === 1 ? (
        <Typography>superuser</Typography>
      ) : item.row.usertype === 2 ? (
        <Typography>agent</Typography>
      ) : (
        <Typography>customer</Typography>
      )}
    </>
  );
};

function PermissionManagement() {
  const dispatch = useDispatch();
  const [UserID, setUserID] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filter, setfilter] = useState({
    Utype: null,
    BranchId: null,
    UUid: null,
  });
  const { userInfo, global } = UseFetchLogger();

  //userList
  const { isloading47, Resp47, error47, isError47, isSuccess47 } = useSelector(
    (state) => state.UserList
  );
  const { branch } = useFetchBranch({ Status: 1 }, [], "");
  //user list api call
  useEffect(() => {
    if (filter?.Utype?.length != 0) {
      var obj = { BranchId: filter?.BranchId, Utype: filter?.Utype, Status: 1 };
      dispatch(UserListfunc({ ...global, ...obj }));
    }
  }, [filter?.Utype, filter?.BranchId]);

  //userlist fetch
  useEffect(() => {
    if (isSuccess47 && filter?.Utype?.length !== 0 && filter?.BranchId) {
      setUserID(Resp47);
    } else {
      setUserID([]);
      dispatch(ClearState47());
    }
  }, [isSuccess47, filter?.Utype, filter?.BranchId]);

  //permissions
  const { isloading14, PermissionData, error14, isError14, isSuccess14 } =
    useSelector((state) => state.Permission);

  const { isloading15, msg15, error15, isError15, isSuccess15 } = useSelector(
    (state) => state.PermissionAdd
  );
  //permission show
  useEffect(() => {
    if (
      isSuccess14 &&
      !isloading14 &&
      filter?.UUid &&
      filter?.Utype?.length !== 0 &&
      filter?.BranchId
    ) {
      setTableData(PermissionData);
    } else {
      setTableData([]);
      dispatch(ClearState14());
    }
  }, [isSuccess14, isloading14, isError14]);

  //Permission add response
  useEffect(() => {
    if (!isloading15 && isSuccess15) {
      toast.success(`${msg15}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState15());
    }
    if (!isloading15 && isError15) {
      toast.error(`${error15}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState15());
    }
  }, [isError15, isSuccess15]);

  const handleEditCellChange = (e, index, type) => {
    let oldData = JSON.parse(JSON.stringify(tableData));
    oldData[index][type] = e.target.checked ? 1 : 0;
    setTableData(oldData);
    // setEditedData();
  };

  const handleSubmitData = () => {
    var obj1 = { data: tableData };
    var obj = { ...filter, ...obj1 };
    var finalObj = { ...obj, ...obj1, ...global };

    dispatch(PermissionAdd(finalObj));
  };
  const usertype = [
    { Utype: 1, Value: "SuperUser" },
    { Utype: 2, Value: "Agent" },
    { Utype: 3, Value: "Customer" },
  ];
  const column = ["Page Name", "View", "Create", "Edit", "Delete"];

  const filterOnHandler = () => {
    if (filter?.BranchId && filter?.Utype && filter?.UUid) {
      dispatch(PermissionList({ ...filter, ...global }));
    }
  };
  const filterOffHandler = () => {
    setTableData([]);
  };

  const FilterOut = () => {
    setfilter({ Utype: null, BranchId: null, UUid: null });
    setTableData([]);
  };
  return (
    <Grid container ml={2} mt={3} columnGap={1} maxWidth={"xl"}>
      <ToastContainer autoClose={8000} />
      <Grid
        item
        md={12}
        lg={12}
        sm={12}
        xs={12}
        display={"flex"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <ReusableBreadcrumbs
          props={[
            {
              title: "Home",
              link: global.Utype == 1 ? "/executive" : "/agent",
              icon: "home",
            },
            {
              title: "Manage Permission",
              link: "#",
              icon: "manage_accounts",
            },
          ]}
        />
      </Grid>
      <Grid xs={12} sm={12} md={12} lg={12} my={1}>
        <Divider />
      </Grid>

      <Grid
        item
        xl={2}
        md={3.5}
        lg={1.5}
        sm={3.5}
        xs={11}
        mt={1}
        display={"flex"}
        justifyContent={"flex-start"}
        flexWrap={"wrap"}
        alignItems={"center"}
      >
        <ReusableDropDown3
          label={"BranchId"}
          data={branch}
          ObjectKey={["BranchCode", "BranchName"]}
          uniquekey={"BranchId"}
          handleChange={(e) => {
            let value = e.target.value;
            if (filter?.BranchId !== null && filter?.BranchId !== undefined) {
              setfilter({
                ...filter,
                UUid: null,
                Utype: null,
                BranchId: value,
              });
              setTableData([]);
            } else {
              setfilter({ ...filter, BranchId: value });
              setTableData([]);
            }
          }}
          setState={setfilter}
          state={filter}
        />
      </Grid>
      <Grid
        item
        xl={2}
        md={3.5}
        lg={1.5}
        sm={3.5}
        xs={11}
        mt={1}
        display={"flex"}
        justifyContent={"flex-start"}
        flexWrap={"wrap"}
        alignItems={"center"}
      >
        <ReusableDropDown3
          label={"UserType"}
          data={usertype || []}
          ObjectKey={["Value"]}
          uniquekey={"Utype"}
          ddwidth={"10rem"}
          setState={setfilter}
          state={filter}
          handleChange={(e) => {
            let value = e.target.value;
            if (filter?.Utype !== null && filter?.Utype !== undefined) {
              setfilter({
                ...filter,
                UUid: null,
                Utype: value,
              });
              setTableData([]);
            } else {
              setfilter({ ...filter, Utype: value });
              setTableData([]);
            }
          }}
        />
      </Grid>
      <Grid
        item
        xl={3}
        md={4}
        lg={3}
        sm={4}
        xs={11}
        mt={1}
        mr={2}
        display={"flex"}
        justifyContent={"flex-start"}
        flexWrap={"wrap"}
        alignItems={"center"}
      >
        <ReusableDropDown3
          label={"User"}
          data={UserID}
          ObjectKey={["UserName", "PhoneNumber"]}
          uniquekey={"UUid"}
          setState={setfilter}
          state={filter}
          handleChange={(e) => {
            let value = e.target.value;
            if (filter?.UUid !== null && filter?.UUid !== undefined) {
              setfilter({
                ...filter,
                UUid: value,
              });
              setTableData([]);
            } else {
              setfilter({ ...filter, UUid: value });
              setTableData([]);
            }
          }}
        />
      </Grid>
      <Grid
        item
        xl={4}
        lg={5.3}
        md={12}
        sm={12}
        xs={11}
        display={"flex"}
        justifyContent={{
          lg: "flex-start",
          md: "center",
          sm: "center",
          xs: "center",
          xl: "flex-start",
        }}
        flexWrap={"wrap"}
        alignItems={"center"}
      >
        <IconOnOffButton
          h1={"View"}
          h2={"Hide"}
          icon1={<RemoveRedEyeIcon fontSize="medium" />}
          icon2={<VisibilityOffIcon fontSize="medium" />}
          Tooltip1={"View"}
          Tooltip2={"Hide"}
          funcTrigger1={filterOnHandler}
          funcTrigger2={filterOffHandler}
        />
        <IconOnOffButton
          h1={"Save"}
          icon1={<SaveIcon fontSize="medium" />}
          Tooltip1={"Edit Permission"}
          funcTrigger1={handleSubmitData}
          disable1={tableData?.length !== 0 ? false : true}
          h2={"Filter Out"}
          icon2={<FilterAltOffIcon fontSize="medium" />}
          funcTrigger2={FilterOut}
          disable2={false}
        />
      </Grid>
      <Grid item xl={12} lg={12} md={12} sm={12} xs={12} mt={2}>
        <Box
          sx={{
            height: "65vh",
            overflowY: "scroll",
            position: "relative",
            border: "1px solid #b6b6b8",
          }}
        >
          <Table aria-label="a dense table" size="small">
            <TableHead
              sx={{
                backgroundColor: "#1775ce",
                // position: "fixed",
                // zIndex: 2,
                width: "auto",
              }}
            >
              <TableRow>
                {column.map((item, index) => {
                  return (
                    <TableCell
                      key={index}
                      sx={{ fontSize: 16, color: "#ffffff", fontWeight: 500 }}
                    >
                      {item}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>{" "}
            <TableBody sx={{ zIndex: 1 }}>
              {tableData &&
                tableData.map((item, index) => {
                  //  "CompanyCode","usertype","PageName","ViewPage","Create","Edit","Delete",
                  return (
                    // <StyledTableRow align="left" key={index}>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "#000000",
                        }}
                      >
                        {item.PageName}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={item.ViewPage}
                          onChange={(e) =>
                            handleEditCellChange(e, index, "ViewPage")
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={item.Create}
                          onChange={(e) =>
                            handleEditCellChange(e, index, "Create")
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={item.Edit}
                          onChange={(e) =>
                            handleEditCellChange(e, index, "Edit")
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={item.Delete}
                          onChange={(e) =>
                            handleEditCellChange(e, index, "Delete")
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {!tableData ? (
                <>
                  <TableRow>
                    <TableCell
                      sx={{ textAlign: "center", height: "200px" }}
                      colSpan={"100%"}
                    >
                      No data Found
                    </TableCell>
                  </TableRow>
                </>
              ) : null}
            </TableBody>
          </Table>
        </Box>
      </Grid>
    </Grid>
  );
}

export default PermissionManagement;
