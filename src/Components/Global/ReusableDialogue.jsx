import {
  IconButton,
  Tooltip,
  Typography,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button,
} from "@mui/material";
import StyledBox from "../styledComponent/StyledBox";
import PropTypes from "prop-types";
ReusableDialogue.propTypes = {
  icon: PropTypes.node,
  button: PropTypes.bool,
  type: PropTypes.string,
  color: PropTypes.string,
  disabledId: PropTypes.bool,
  title: PropTypes.string,
  reason: PropTypes.string,
  b1: PropTypes.string,
  b2: PropTypes.string,
  h1: PropTypes.string,
  handleClickOpen: PropTypes.func,
  handleClose: PropTypes.func,
  TooltipMsg: PropTypes.string,
  open: PropTypes.bool,
  TextFieldName: PropTypes.string,
  setState: PropTypes.func,
  OnSubmit: PropTypes.func,
  textcolor: PropTypes.string,
};
export default function
  ReusableDialogue({
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
  TextFieldName,
  setState,
  OnSubmit,
  textcolor,
}) {
  return (
    <>
      <StyledBox>
        {icon ? (
          <div
            style={{
              height: "50px",
              width: "200px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <Typography sx={{ color: textcolor }}>{h1}</Typography>
            </div>
            <div>
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
            </div>
          </div>
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
      </StyledBox>
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
    </>
  );
}
