import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import { Typography, TextField, Divider, IconButton, Box } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

import {
  CreateDesFunc,
  ClearState62,
} from "../../Slice/BackofficeUser/CreateDesSlice";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchDesignation from "../../Apps/CustomHook/useFetchDesignation";

export default function ManageDesignation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [designation, setdesignation] = useState({ Designation: "" });

  //auth
  const { global } = UseFetchLogger();

  //designation add
  const { isloading62, Resp62, error62, isError62, isSuccess62 } = useSelector(
    (state) => state.createDes
  );

  //Response of Designation add
  useEffect(() => {
    if (isSuccess62 && !isloading62) {
      toast.success(Resp62, { position: toast.POSITION.TOP_RIGHT });
      setdesignation({ Designation: "" });
    }
    if (isError62 && !isloading62) {
      toast.error(error62, { position: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState62());
  }, [isError62, isSuccess62]);

  //designation List for Table
  const { des } = useFetchDesignation({}, [isSuccess62]);

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Designation")[0];

  //column
  const columns = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    { field: "Did", headerName: "DID", width: 120 },
    {
      field: "Designation",
      headerName: "Designation",
      width: 220,
      hideable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 180,
      hideable: false,
/*************  ✨ Codeium Command ⭐  *************/
/******  834ee630-d789-4105-ab26-9a801d29d9fc  *******/
      renderCell: (item) => {
        return (
          <>
            {item?.row?.Status ? (
              <span>Active</span>
            ) : (
              <span>InActive</span>
            )}
          </>
        );
      },
    },
  ];

  const InputChangeHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    setdesignation({ ...designation, [key]: value });
  };
  const SubmitHandler = (e) => {
    e.preventDefault();
    dispatch(CreateDesFunc({ ...global, ...designation }));
  };

  return (
    <Grid container ml={2} mt={3} columnGap={3}>
      <ToastContainer autoClose={8000} />
      <Grid
        item
        sm={11.5}
        xs={11}
        md={12}
        lg={12}
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
              title: "Manage Designation",
              link: "#",
              icon: "admin_panel_settings",
            },
          ]}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} mt={1}>
        <Divider />
      </Grid>
      {myPermission?.Create == 1 ? (
        <Grid item sm={12} xs={12} md={12} lg={12}>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              alignItems: "center",
            }}
            component={"form"}
            onSubmit={SubmitHandler}
            onChange={InputChangeHandler}
          >
            <TextField
              required
              value={designation?.Designation}
              name="Designation"
              label="Designation"
              variant="outlined"
              size="small"
              sx={{ mr: 2, mt: 1, width: 350 }}
            />
            <IconButton
              size="large"
              aria-label="AddBoxIcon"
              type="submit"
              sx={{
                mt: 1,
              }}
            >
              <AddBoxOutlinedIcon fontSize="large" />
            </IconButton>
          </Box>
        </Grid>
      ) : null}

      <Grid item sm={12} xs={12} md={12} lg={12} mt={2}>
        <DataGrid
          rows={des}
          columns={columns}
          getRowId={(item) => {
            return item?.Did;
          }}
          sx={{ height: 350, width: "100%" }}
          checkboxSelection
        />
      </Grid>
    </Grid>
  );
}
