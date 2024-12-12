import React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField, IconButton, Typography, Divider } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function AddPurityform({
  open,
  onSubmitForm,
  handleClose,
  PrtData,
  InputHandler,
}) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          handleClose();
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Add Purity</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            required
            value={PrtData?.PURITY || ""}
            InputLabelProps={{ shrink: true }}
            name="PURITY"
            label="PURITY"
            id="PURITY"
            variant="outlined"
            size="small"
            sx={{ my: 2 }}
            onChange={InputHandler}
          />
          <br />
          <TextField
            required
            value={PrtData?.DESCRIPTION || ""}
            name="DESCRIPTION"
            label="DESCRIPTION"
            id="DESCRIPTION"
            variant="outlined"
            size="small"
            type="text"
            InputLabelProps={{ shrink: true }}
            sx={{ my: 2 }}
            onChange={InputHandler}
          />
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              color="success"
              onClick={(e) => {
                onSubmitForm(e);
                handleClose();
              }}
              variant="outlined"
              disabled={
                PrtData?.PURITY !== "" && PrtData?.DESCRIPTION !== ""
                  ? false
                  : true
              }
            >
              Submit
            </Button>
          </DialogActions>{" "}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default AddPurityform;
