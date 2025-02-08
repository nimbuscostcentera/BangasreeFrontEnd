import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Box } from "@mui/system";
import { Input, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import MaxLengthofID from "../../Apps/GlobalFunctions/MaxLengthofID";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PassBookCreate({
  openform,
  FieldPassNo,
  onChangeBranch,
  onChangeNoOfBooks,
  bool,
  OnPassBookGenerate,
  handleClose,
  FieldBranch,
  branch,
}) {
  return (
    <React.Fragment>
      <Dialog
        open={openform}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Insert PassBook Number</DialogTitle>
        <DialogContent>
          <TextField
            required
            name="NoOfBooks"
            label="NoOfBooks"
            variant="outlined"
            size="small"
            type="number"
            value={FieldPassNo || ""}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 3 }}
            sx={{ my: 2 }}
            onChange={onChangeNoOfBooks}
          />
        </DialogContent>
        <DialogContent>
          <ReusableDropDown4
            label={"BranchId"}
            data={branch || []}
            ObjectKey={["BranchCode", "BranchName"]}
            uniquekey={"BranchId"}
            ddwidth={"10rem"}
            Field={FieldBranch || ""}
            onChange={onChangeBranch}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            onClick={OnPassBookGenerate}
            variant="outlined"
            disabled={bool}
          >
            Submit
          </Button>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
