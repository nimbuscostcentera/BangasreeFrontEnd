import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Tooltip, Box, Typography } from "@mui/material";
import { Title } from "@mui/icons-material";
import StyledBox from "../styledComponent/StyledBox";

export default function ReusableDialogue({
  icon,
  button,
  type,
  color,
  disabledId,
  title,
  reason,
  b1,
  b2,
  h1,
  handleClickOpen,
  handleClose,
  TooltipMsg,
  open,
  state,
  TextFieldName,
  setState,
  OnSubmit,
  textcolor,
}) {
  return (
    <StyledBox mt={1}>
      {icon ? (
        <>
          <Typography sx={{ color: textcolor }}>{h1}</Typography>
          <Tooltip title={TooltipMsg}>
            <span>
              <IconButton
                variant="outlined"
                onClick={handleClickOpen}
                disabled={disabledId}
              >
                {icon}
              </IconButton>
            </span>
          </Tooltip>
        </>
      ) : null}
      {button ? (
        <>
          <Tooltip title={TooltipMsg}>
            <span>
              <Button
                type={type}
                color={color}
                variant="contained"
                onClick={handleClickOpen}
              >
                {title}
              </Button>
            </span>
          </Tooltip>
        </>
      ) : null}
      <Dialog open={open} onClose={handleClose} maxWidth={"xl"}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{reason}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            type="text"
            multiline
            fullWidth
            variant="standard"
            name={TextFieldName}
            onChange={(e) => {
              setState({ [TextFieldName]: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={OnSubmit} color="success">
            {" "}
            {b1}
          </Button>
          <Button onClick={handleClose} type={b1} color="error">
            {b2}
          </Button>
        </DialogActions>
      </Dialog>
    </StyledBox>
  );
}
