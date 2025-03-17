import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Stack,
  AlertTitle,
  Alert,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/system/Unstable_Grid";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import PassBookCreate from "./PassBookCreate";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  AvailPassBookList,
} from "../../Slice/PassBook/AvailPassBookSlice";
import {
  PBGenFunc,
  ClearState52,
} from "../../Slice/PassBook/PassBookGenerateSlice";
import {
  BranchTransferPass,
  ClearState59,
} from "../../Slice/PassBook/BranchTransferSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";

const CustomTheme = createTheme({
  breakpoints: {
    keys: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
    values: {
      xxs: 100,
      xs: 200,
      sm: 400,
      mid: 550,
      md: 875,
      lg: 1055,
      xl: 1110,
      xxl: 1210,
      xxxl: 1345,
      Big: 1500,
    },
  },
});

function ManagePassBook() {
  const dispatch = useDispatch();
  const [pb, setpb] = useState([]); //total passbook not assign
  const [alert, setalert] = useState(false);
  const [warning, setwarning] = useState("");
  const [passid1, setpassid1] = useState([]); //selected passbook from 2nd table
  const [pb2, setpb2] = useState([]); //no of passbook in 2nd table
  const [passid, setpassid] = useState([]); //selected passbook from stock
  const [passNo, setPassNo] = useState({ NoOfBooks: 0, BranchId: null }); //passbook generate
  const [openForm, setOpenForm] = useState(false);
  const [Filter1, setFilter1] = useState({ BranchId: null });
  const [Filter2, setFilter2] = useState({ BranchId: null });

  //close popover
  function handleClose() {
    setPassNo({ NoOfBooks: 0, BranchId: null });
    setOpenForm(false);
  }
  //auth detail
  const { global } = UseFetchLogger();

  // //Passbook stock
  // const { isloading43, isSuccess43, isError43, error43, Resp43 } = useSelector(
  //   (state) => state.pbStock
  // );
  // //Passbook not assigned to any customer or agent
  // const { isloading55, isSuccess55, isError55, error55, Resp55 } = useSelector(
  //   (state) => state.PBList
  // );

  //Passbook Generate
  const { isloading52, isSuccess52, isError52, error52, Resp52 } = useSelector(
    (state) => state.PBGen
  );

  //passbook transfer to another branch
  const { isloading59, isSuccess59, isError59, error59, Resp59 } = useSelector(
    (state) => state.branchTransferPB
  );

  //PassBook stock in branch
  useEffect(() => {
    if (
      Filter1?.BranchId !== undefined &&
      Filter1?.BranchId !== "" &&
      Filter1?.BranchId !== null
    ) {
      dispatch(AvailPassBookList({ ...global, BranchId: Filter1?.BranchId })).unwrap()
        .then(async (res) => {
          setpb(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isSuccess52, Filter1?.BranchId, isSuccess59]);

  const { branch } = useFetchBranch({ Status: 1 }, [], "");

  //branch 2
  let branch2 = useMemo(() => {
    let a = [];
    if (Filter1.BranchId !== "" && Filter1.BranchId !== null) {
      a = branch.filter((i) => i?.BranchId !== Filter1?.BranchId);
    }
    return a;
  }, [Filter1?.BranchId]);

  //PB gen toaster
  useEffect(() => {
    if (isSuccess52 && !isloading52) {
      toast.success(Resp52, { position: toast.POSITION.TOP_RIGHT });
    }
    if (isError52 && !isloading52) {
      toast.error(error52, { position: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState52());
  }, [isloading52, isSuccess52, isError52]);

  //PB branch transfer toaster
  useEffect(() => {
    if (isSuccess59 && !isloading59) {
      toast.success(Resp59, { position: toast.POSITION.TOP_RIGHT });
      setpb([]);
      setpb2([]);
      setFilter2({ BranchId: "" });
    }
    if (isError59 && !isloading59) {
      toast.error(error59, { position: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState59());
  }, [isloading59, isSuccess59, isError59]);

  var column = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    {
      field: "PassBookId",
      headerName: "PassBookID",
      width: 150,
      editable: true,
      type: "textinput",
      hideable: false,
    },
    {
      field: "PassBookNo",
      headerName: "PassBookNo",
      width: 230,
      editable: true,
      type: "textinput",
      hideable: false,
    },
  ];

  const OnPassBookGenerate = (e) => {
    e.preventDefault();
    dispatch(PBGenFunc({ ...passNo, ...global }));
    handleClose();
  };
  //console.log(pb2, pb, "pb2");
  const PassBookBranchTransfer = (e) => {
    e.preventDefault();

    if (
      Filter2.BranchId !== undefined &&
      Filter2?.BranchId !== "" &&
      Filter2?.BranchId !== null
    ) {
      if (passid?.length !== 0) {
        let Sorting = [...pb2, ...passid];
        Sorting.sort((a, b) => a?.PassBookId - b?.PassBookId);
        setpb2(Sorting);
        let array = [];
        passid?.map((i) => {
          array.push(i?.PassBookId);
        });
        let passbooktrans = [];
        pb.map((item) => {
          if (array.includes(item?.PassBookId) == false) {
            //console.log(array.includes(item?.PassBookId));
            passbooktrans.push(item);
          }
        });
        passbooktrans.sort((a, b) => a?.PassBookId - b?.PassBookId);
        //console.log(passbooktrans);
        setpb(passbooktrans);
        setpassid([]);
      } else {
        setalert(true);
        setwarning(
          "Select the Passbooks you want to transfer from first table."
        );
      }
    } else {
      setwarning(
        "First enter the Branch from dropdown at the right side of the page then transfer Passbook."
      );
      setalert(true);
    }
  };

  const PassBookBranchReturn = (e) => {
    e.preventDefault();
    if (pb2?.length == 0) {
      setalert(true);
      setwarning("There is no passbook in second table");
    } else {
      if (passid1?.length == 0) {
        setalert(true);
        setwarning("Select Passbooks you do not want to assign");
      } else {
        let minArray = [...pb2];
        let newArr = [];
        let negArray = [];
        passid1.map((item) => {
          negArray.push(item?.PassBookId);
        });
        minArray.map((item) => {
          if (negArray.includes(item?.PassBookId) == false) {
            newArr.push(item);
          }
        });
        newArr.sort((a, b) => a?.PassBookId - b?.PassBookId);
        setpb2(newArr);
        let sortArray = [...pb, ...passid1];
        sortArray.sort((a, b) => a?.PassBookId - b?.PassBookId);
        setpb(sortArray);
        setpassid1([]);
      }
    }
  };

  const AssignPassBookToNewBranch = (e) => {
    e.preventDefault();
    if (pb2?.length == 0) {
      setwarning(
        "First select branch from first dropdown from where you want to transfer Passbook.Thereafter, Select passbooks from first table. Then select branch from second dropdown. Then click the -> arrow button to transfer passbook to that branch."
      );
      setalert(true);
    } else {
      if (
        Filter2.BranchId !== undefined &&
        Filter2?.BranchId !== "" &&
        Filter2?.BranchId !== null
      ) {
        dispatch(
          BranchTransferPass({
            ...global,
            data: pb2,
            BranchId: Filter2?.BranchId,
          })
        );
      } else {
        setwarning(
          "Select the Branch from second dropdown at the right side of the page then transfer Passbook by selecting passbooks and click on -> button."
        );
        setalert(true);
      }
    }
  };

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Passbook")[0];

  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid container mt={2} ml={2}>
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
                  title: "Manage PassBook",
                  link: "#",
                  icon: "note_add",
                },
              ]}
            />{" "}
          </Box>
          {myPermission?.Create == 1 ? (
            <>
              <IconOnOffButton
                h1={"Create PassBook"}
                icon1={<AddCircleOutlineIcon fontSize="medium" />}
                Tooltip1={"Create PassBook"}
                funcTrigger1={() => {
                  setPassNo({ ...passNo, NoOfBooks: 0 });
                  setOpenForm(true);
                }}
              />
              <PassBookCreate
                openform={openForm}
                setOpenform={setOpenForm}
                OnPassBookGenerate={OnPassBookGenerate}
                handleClose={handleClose}
                branch={branch}
                FieldBranch={passNo?.BranchId}
                FieldPassNo={passNo?.NoOfBooks}
                onChangeNoOfBooks={(e) => {
                  console.log(e.target.value);

                  setPassNo({ ...passNo, NoOfBooks: e.target.value });
                }}
                onChangeBranch={(e) => {
                  console.log(e.target.value);
                  setPassNo({ ...passNo, BranchId: e.target.value });
                }}
                uniquekey={"NoOfBooks"}
                bool={
                  passNo?.BranchId !== "" &&
                  passNo?.BranchId !== undefined &&
                  passNo?.NoOfBooks !== "" &&
                  passNo?.NoOfBooks !== undefined
                    ? false
                    : true
                }
              />
            </>
          ) : null}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} my={0} py={0}>
          <Divider />
        </Grid>
        {alert ? (
          <Grid item sm={12} xs={12} md={12} lg={12}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert
                  severity="error"
                  onClose={() => {
                    setalert(false);
                  }}
                >
                  <AlertTitle>Warning</AlertTitle>
                  {warning}
                </Alert>
              </Stack>
            </Box>
          </Grid>
        ) : null}
        <Grid
          item
          lg={11}
          md={11.5}
          sm={12}
          xs={12}
          xl={4.5}
          textAlign={"center"}
          color={"#000000"}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          my={1}
          mx={1}
          height={"60vh"}
        >
          <br />
          <Box sx={{ height: "50vh", width: "70vw" }}>
            <Box sx={{ maxWidth: "280px", mx: "auto", my: 1 }}>
              <ReusableDropDown4
                setState={setFilter1}
                state={Filter1}
                label={"Branch"}
                data={branch}
                id={"arial_branch"}
                disabled={false}
                ObjectKey={["BranchCode", "BranchName"]}
                Field={Filter1?.BranchId}
                uniquekey={"BranchId"}
                deselectvalue={false}
                onChange={(e) => {
                  let key = e.target.name;
                  let value = e.target.value;
                  setFilter1({ ...Filter1, [key]: value });
                }}
              />
            </Box>
            <Typography sx={{ textAlign: "center" }} variant="h6">
              PassBook in Stock : {pb && pb.length}
            </Typography>
            <DataGrid
              selectRow
              getRowId={(rows) => {
                if (!rows) {
                  return -1;
                } else {
                  return rows["PassBookId"];
                }
              }}
              density="compact"
              hideFooterPagination
              hideFooter
              columns={column}
              rows={pb}
              checkboxSelection
              onRowSelectionModelChange={(id) => {
                const SelectedIDs = new Set(id);
                const selecteddata = pb.filter((row) =>
                  SelectedIDs.has(row?.PassBookId)
                );
                const IDarr = Array.from(selecteddata);
                setpassid(IDarr);
              }}
              sx={{
                mx: 1,
                mt: 1,
              }}
            />
          </Box>
        </Grid>
        {myPermission?.Edit == 1 ? (
          <>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={2.5}
              textAlign={"center"}
              color={"#000000"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
              <Box sx={{ my: 1 }}>
                <IconButton onClick={PassBookBranchReturn}>
                  <ArrowBackIcon fontSize="large" />
                </IconButton>
                <IconButton onClick={PassBookBranchTransfer}>
                  <ArrowForwardIcon fontSize="large" />
                </IconButton>
              </Box>
            </Grid>
            <Grid
              item
              md={11.5}
              lg={11}
              xl={4.5}
              sm={12}
              my={2}
              textAlign={"center"}
              color={"#000000"}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
              height={"60vh"}
            >
              <Box sx={{ height: "50vh", width: "70vh" }}>
                <Box sx={{ maxWidth: "250px", mx: "auto", mb: 1 }}>
                  <ReusableDropDown4
                    setState={setFilter2}
                    state={Filter2}
                    label={"Branch"}
                    data={branch2}
                    id={"arial_branch2"}
                    disabled={false}
                    ObjectKey={["BranchCode", "BranchName"]}
                    Field={Filter2?.BranchId}
                    uniquekey={"BranchId"}
                    deselectvalue={false}
                    onChange={(e) => {
                      let key = e.target.name;
                      let value = e.target.value;
                      if (
                        Filter1?.BranchId !== null &&
                        Filter1?.BranchId !== undefined &&
                        Filter1?.BranchId !== ""
                      ) {
                        setFilter2({ ...Filter2, [key]: value });
                      }
                    }}
                    onClick={() => {
                      console.log(Filter1);
                      if (
                        Filter1?.BranchId === null ||
                        Filter1?.BranchId === undefined ||
                        Filter1?.BranchId === ""
                      ) {
                        console.log("hello");
                        setwarning(
                          "First set the branch from where you want to transfer a passbook from first Dropdown."
                        );
                        setalert(true);
                      }
                    }}
                  />
                </Box>
                <Typography sx={{ textAlign: "center", mb: 1 }} variant="h6">
                  PassBook No. after Branch Change :{pb2 && pb2.length}
                </Typography>
                <DataGrid
                  getRowId={(rows) => {
                    if (!rows) {
                      return -1;
                    } else {
                      return rows["PassBookId"];
                    }
                  }}
                  pageSizeOptions={[15, 20]}
                  columns={column}
                  rows={pb2}
                  density="compact"
                  hideFooterPagination
                  hideFooter
                  checkboxSelection
                  sx={{ mx: 1 }}
                  onRowSelectionModelChange={(id) => {
                    const SelectedIDs = new Set(id);
                    const selecteddata = pb2.filter((row) =>
                      SelectedIDs.has(row?.PassBookId)
                    );
                    const IDarr = Array.from(selecteddata);
                    setpassid1(IDarr);
                  }}
                />
              </Box>
            </Grid>
            <Grid
              item
              sm={12}
              md={12}
              lg={12}
              xs={12}
              xl={12}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              mt={4}
              ml={1.5}
            >
              <Button
                variant="contained"
                color="success"
                onClick={AssignPassBookToNewBranch}
              >
                Assign
              </Button>
            </Grid>
          </>
        ) : null}
      </Grid>
    </ThemeProvider>
  );
}
export default ManagePassBook;
