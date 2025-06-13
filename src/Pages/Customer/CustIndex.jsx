import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { useDispatch} from "react-redux";

import { Typography ,Popover} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReusableDataTable from "../../Components/Global/ReusableTable";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import StatBox from "../../Components/Global/StatBox";
import Header from "../../Components/Global/Header";

import useFetchCards from "../../Apps/CustomHook/UseFetchCards";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchSupscription from "../../Apps/CustomHook/UseFetchSubscription";
import { ClearToaster } from "../../Slice/Auth/AuthSlice";

import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import black from "../../assets/black.jpg";

function CustIndex() {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, toasterBool } = UseFetchLogger();

  let obj = {};
  if (userInfo?.details?.Utype == 3) {
    obj.CustomerID = userInfo?.details?.CustomerID;
    obj.CustUUid = userInfo?.details?.UUid;
  }
  const { CardData } = useFetchCards(obj, []);
  const { duepaycust } = useFetchSupscription(obj,[]);
  let TotalAcc = null;
  TotalAcc = CardData?.TotalAcc;
  let TotalMaturedAcc = null;
  TotalMaturedAcc = CardData?.TotalMaturedAcc;
  let TotalPayedAmt = null;
  TotalPayedAmt = CardData?.TotalPayedAmt;
  let AgentName = CardData?.AgentName || null;

  const { sub ,isloading23} = useFetchSupscription({ CustomerID: userInfo?.details?.CustomerID },[]);

  const [scrid, setSCRID] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [Pop, setPop] = useState(null);

  const handlePopoverOpenMaturity = (event, params) => {
    setAnchorEl(event.currentTarget);
    setPop(params.row.MaturityComment);
  };
  const handlePopoverOpenBonus = (e, p) => {
    setAnchorEl(e.currentTarget);
    setPop(p.row.BonusComment);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPop(null);
  };

  const open = Boolean(anchorEl);

  const columns = [
    {
      field: `CustomerName`,
      headerName: "Customer Name",
      width: 170,
    },
    {
      field: `CustomerAccNo`,
      headerName: "Account Number",
      width: 170,
    },
    { field: `SchemeTitle`, headerName: "Scheme Title", width: 200 },
    { field: `AgentCode`, headerName: "Agent Code", width: 120 },
    {
      field: `PaybaleAmt`,
      headerName: "Payable Amount",
      width: 120,
    },

    {
      field: `totcolection`,
      headerName: "Collected Amt.",
      width: 130,
    },
    {
      field: `RedeemAmt`,
      headerName: "Redeem Amt.",
      width: 130,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.MaturityStatus === 2 ||
            item?.row?.MaturityStatus === 3 ? (
              <Typography>{item?.row?.RedeemAmt}</Typography>
            ) : null}
          </>
        );
      },
    },
    {
      field: `MaturityStatus`,
      headerName: "Maturity Status",
      width: 130,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.MaturityStatus === 1 ? (
              <Typography>Active</Typography>
            ) : item?.row?.MaturityStatus === 3 ? (
              <Typography>Matured</Typography>
            ) : item?.row?.MaturityStatus === 2 ? (
              <>
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(e) => {
                    handlePopoverOpenMaturity(e, item);
                  }}
                  onMouseLeave={handlePopoverClose}
                >
                  Premature
                </Typography>{" "}
              </>
            ) : item?.row?.MaturityStatus === 0 ? (
              <>
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(e) => {
                    handlePopoverOpenMaturity(e, item);
                  }}
                  onMouseLeave={handlePopoverClose}
                >
                  Inactive
                </Typography>{" "}
              </>
            ) : null}
          </>
        );
      },
    },
    {
      field: `BonusStatus`,
      headerName: "Bonus Status",
      width: 130,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.BonusStatus == 1 ? (
              <Typography>Active</Typography>
            ) : item?.row?.BonusStatus == 0 ? (
              <>
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(e) => {
                    handlePopoverOpenBonus(e, item);
                  }}
                  onMouseLeave={handlePopoverClose}
                >
                  InActive
                </Typography>
              </>
            ) : (
              <Typography>Processing</Typography>
            )}
          </>
        );
      },
    },
  ];

   useEffect(() => {
     if (toasterBool) {
       toast.success(`${userInfo?.response}`, {
         positions: toast.POSITION.TOP_RIGHT,
       });
     }
     dispatch(ClearToaster());
   }, [toasterBool]);
  
  return (
    <Grid container mt={3} ml={2} columnGap={2.5} rowGap={1}>
      <ToastContainer/>
      <Grid item md={12} xs={12} sm={12}>
        <Header
          title="Customer Dashboard"
          subtitle={`Welcome ${userInfo?.details?.CustomerName}`}
          editable={false}
        />
      </Grid>
      <Grid
        item
        lg={2.2}
        md={2.4}
        sm={5.5}
        xs={12}
        pt={2}
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${black})`,
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "cover",
          borderRadius: 3,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <StatBox
          subtitle={AgentName}
          title2={`Agent:${userInfo?.details?.AgentCode}`}
          stcolor={"#ffffff"}
          icon={<PersonIcon sx={{ color: "whitesmoke", fontSize: "35px" }} />}
        />
      </Grid>
      <Grid
        item
        lg={2.2}
        md={2.4}
        sm={5.5}
        xs={12}
        p={2}
        sx={{
          backgroundImage: `linear-gradient(135deg,#f54d05,#f59d05)`,
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "cover",
          borderRadius: 3,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <StatBox
          title={TotalAcc||0}
          subtitle="No. of A/C"
          stcolor={"#ffffff"}
          icon={<PersonIcon sx={{ color: "whitesmoke", fontSize: "35px" }} />}
        />
      </Grid>
      <Grid
        item
        lg={2.2}
        md={2.4}
        sm={5.5}
        xs={12}
        pt={2}
        sx={{
          backgroundImage: `linear-gradient(135deg,#d10088,#4300b0)`,
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "cover",
          borderRadius: 3,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <StatBox
          title={`₹${TotalPayedAmt||0}/-`}
          subtitle="Total Payed"
          stcolor={"#ffffff"}
          icon={<PersonIcon sx={{ color: "whitesmoke", fontSize: "35px"}} />}
        />
      </Grid>
      <Grid
        item
        lg={2.2}
        md={2.4}
        sm={5.5}
        xs={12}
        p={2}
        sx={{
          backgroundImage: `linear-gradient(135deg,#0062ff,#4300b0)`,
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "cover",
          borderRadius: 3,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <StatBox
          title={TotalMaturedAcc}
          subtitle="No. of Matured A/C"
          stcolor={"#ffffff"}
          icon={<PersonIcon sx={{ color: "whitesmoke", fontSize: "35px" }} />}
        />
      </Grid>
      <Grid
        item
        lg={2.2}
        md={2.4}
        sm={5.5}
        xs={12}
        p={2}
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${black})`,
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "cover",
          borderRadius: 3,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <StatBox
          title={duepaycust?.length}
          subtitle="Total Dues"
          stcolor={"#ffffff"}
          icon={<PersonIcon sx={{ color: "whitesmoke", fontSize: "35px" }} />}
        />
      </Grid>
      <Grid
        item
        sm={12}
        xs={12}
        md={12}
        lg={12}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <IconOnOffButton
          icon1={<HistoryIcon fontSize={"medium"} color={"#3b3b3b"} />}
          icon2={<CalendarMonthIcon fontSize={"medium"} color={"#3b3b3b"} />}
          Tooltip1={"Payment History"}
          Tooltip2={"Monthly Break Up"}
          h1={"Payment History"}
          h2={"Monthly Break Up"}
          disable1={scrid.length == 1 ? false : true}
          disable2={scrid.length == 1 ? false : true}
          funcTrigger1={() => {
            navigation("/customer/custpaymenthistory", {
              state: { SchemeRegId: scrid[0] },
            });
          }}
          funcTrigger2={() => {
            navigation("/customer/monthlypayment", {
              state: { SchemeRegId: scrid[0] },
            });
          }}
        />
      </Grid>
      <Grid item sm={12} xs={12} md={12} lg={12} display={"flex"}>
        <ReusableDataTable
          columns={columns}
          rows={sub||[]}
          setState={setSCRID}
          state={scrid}
          uniqueid={"SchemeRegId"}
          isloading={isloading23}
        />
        {Pop === null ? null : (
                  <>
                    <Popover
                      id="mouse-over-popover"
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      onClose={handlePopoverClose}
                      disableRestoreFocus
                    >
                      <Typography sx={{ p: 1 }}>{Pop}</Typography>
                    </Popover>
                  </>
                )}
      </Grid>
    </Grid>
  );
}

export default CustIndex;
