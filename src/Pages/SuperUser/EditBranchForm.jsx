import React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Box } from "@mui/system";
import {
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditBranchForm({
  view,
  openform,
  onSubmitForm,
  handleClose,
  EditableData,
  InputHandlerEditBranch,
  Branchtogglefunc
}) {
  return (
    <React.Fragment>
      <Dialog
        open={openform}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          Branchtogglefunc();
          handleClose();
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {" "}
          Edit Branch
          {!view ? (
            <Box sx={{ display: "flex" }}>
              <Typography mt={0.8}>View</Typography>
              <IconButton
                onClick={ Branchtogglefunc}
              >
                <VisibilityIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex" }}>
              <Typography mt={1}>Edit</Typography>
              <IconButton
                onClick={ Branchtogglefunc}
              >
                <EditIcon />
              </IconButton>
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            required
            value={EditableData?.BranchName || ""}
            disabled={view}
            InputLabelProps={{ shrink: true }}
            name="BranchName"
            label="Branch Name"
            id="BranchName"
            variant="outlined"
            size="small"
            sx={{ my: 2 }}
            onChange={InputHandlerEditBranch}
          />
          <br />{" "}
          <TextField
            required
            disabled={view}
            value={EditableData?.BranchCode || ""}
            name="BranchCode"
            label="BranchCode"
            id="BranchCode"
            variant="outlined"
            size="small"
            type="text"
            InputLabelProps={{ shrink: true }}
            sx={{ my: 2 }}
            onChange={InputHandlerEditBranch}
          />
        </DialogContent>
        <DialogActions sx={{justifyContent:"center"}}>
          <Button
            color="success"
            onClick={(e) => {
              Branchtogglefunc();
              onSubmitForm(e);
            }}
            variant="outlined"
            disabled={
              !view &&
              (EditableData?.BranchCode!=="" && EditableData?.BranchName!=="")
                ? false
                : true
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
