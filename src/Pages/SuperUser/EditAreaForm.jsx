import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";
import {
  TextField,
  IconButton,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NumberOnly from "../../Apps/GlobalFunctions/NumberOnly";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditAreaForm({
  openform,
  onSubmitForm,
  handleClose,
  EditableData,
  onChangeHandler,
  AreaTogglefunc,
  view,
}) {
  const [input, setInput] = useState({
    PinCode: true,
  });
  return (
    <React.Fragment>
      <Dialog
        open={openform}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          AreaTogglefunc();
          handleClose();
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          Edit Area
          {!view ? (
            <Box sx={{ display: "flex" }}>
              <Typography mt={0.8}>View</Typography>
              <IconButton onClick={AreaTogglefunc}>
                <VisibilityIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex" }}>
              <Typography mt={1}>Edit</Typography>
              <IconButton onClick={AreaTogglefunc}>
                <EditIcon />
              </IconButton>
            </Box>
          )}
        </DialogTitle>

        <DialogContent>
          <TextField
            required
            value={EditableData?.AreaName || ""}
            InputLabelProps={{ shrink: true }}
            name="AreaName"
            label="Area Name"
            id="arial_AreaName"
            variant="outlined"
            type="text"
            size="small"
            sx={{ my: 2 }}
            onChange={onChangeHandler}
            disabled={view}
          />
          <br />{" "}
          <TextField
            required
            value={EditableData?.District || ""}
            InputLabelProps={{ shrink: true }}
            name="District"
            label="District"
            id="District"
            variant="outlined"
            size="small"
            sx={{ my: 2 }}
            onChange={onChangeHandler}
            disabled={view}
          />
          <br />
          <TextField
            required
            value={EditableData?.state || ""}
            InputLabelProps={{ shrink: true }}
            name="state"
            label="state"
            id="state"
            variant="outlined"
            size="small"
            sx={{ my: 2 }}
            onChange={onChangeHandler}
            disabled={view}
          />
          <br />
          <TextField
            required
            value={EditableData?.country || ""}
            InputLabelProps={{ shrink: true }}
            name="country"
            id="country"
            label="Country Name"
            variant="outlined"
            size="small"
            sx={{ my: 2 }}
            onChange={onChangeHandler}
            disabled={view}
          />
          <br />
          <TextField
            required
            value={EditableData?.PinCode|| ""}
            InputLabelProps={{ shrink: true }}
            InputProps={{ maxLength: 6 }}
            error={!input?.PinCode}
            onChange={(e) => {
              if (e.target.value !== "") {
                var res = NumberOnly(e.target.value);

                setInput({ ...input, ["PinCode"]: res });
              } else if (e.target.value == "") {
                setInput({ ...input, ["PinCode"]: true });
              }
              onChangeHandler(e);
            }}
            name="PinCode"
            label="PinCode"
            id="PinCode"
            variant="outlined"
            size="small"
            inputProps={{ maxLength: 6 }}
            type="text"
            sx={{ color: "black", my: 1 }}
            disabled={view}
          />
          <br />{" "}
          {!input?.PinCode? (
            <FormHelperText
              error
              sx={{
                visibility: input?.PinCode? "hidden" : "initial",
                m: 0,
                p: 0,
              }}
            >
              PinCodemust contain numbers Only.
            </FormHelperText>
          ) : null}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            id="EditArea"
            color="success"
            disabled={
              input?.PinCode== true &&
              !view &&
              EditableData?.AreaName !== "" &&
              EditableData?.state !== "" &&
              EditableData?.PinCode!== "" &&
              EditableData?.District !== "" &&
              EditableData?.country !== ""
                ? false
                : true
            }
            onClick={(e) => {
              onSubmitForm(e);
              AreaTogglefunc();
            }}
            variant="outlined"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
