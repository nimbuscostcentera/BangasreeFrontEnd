import React,{ useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
  FormHelperText,
} from "@mui/material";
import { Box } from "@mui/system";

import NumberOnly from "../../Apps/GlobalFunctions/NumberOnly";
import PinCodeValidation from "../../Apps/GlobalFunctions/PinCodeValidation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AreaRegForm({
  openform,
  setOpenform,
  onSubmitForm,
  handleClose,
  mystate,
  setState,
}) {
  const [input, setInput] = useState({
    PinCode: true,
  });
  const onChangeHandler = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    setState({ ...mystate, [key]: value });
  };
  return (
    <React.Fragment>
      <Dialog
        open={openform}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Register New Area</DialogTitle>
        <DialogContent>
          <TextField
            required
            value={mystate?.AreaName||""}
            name="AreaName"
            label="Area Name"
            variant="outlined"
            size="small"
            sx={{ my: 2 }}
            onChange={onChangeHandler}
          />
          <br />
          <TextField
            required
            value={mystate?.District||""}
            name="District"
            label="District"
            variant="outlined"
            size="small"
            sx={{ my: 2 }}
            onChange={onChangeHandler}
          />
          <br />
          <TextField
            required
            value={mystate?.state||""}
            name="state"
            label="state"
            variant="outlined"
            size="small"
            sx={{ my: 2 }}
            onChange={onChangeHandler}
          />
          <br />
          <TextField
            required
            name="country"
            label="country Name"
            variant="outlined"
            size="small"
            value={mystate?.country}
            InputLabelProps={{ shrink: true }}
            sx={{ my: 2 }}
            onChange={onChangeHandler}
          />
          <br />
          <TextField
            required
            name="PinCode"
            label="PinCode"
            variant="outlined"
            size="small"
            inputProps={{ maxLength: 6 }}
            value={mystate?.PinCode||""}
            error={!input?.PinCode}
            type="text"
            onChange={(e) => {
              if (e.target.value !== "") {
                var res = NumberOnly(e.target.value);
                var res2 = PinCodeValidation(e.target.value);
                var final = res && res2;

                setInput({ ...input, ["PinCode"]: final });
              } else if (e.target.value == "") {
                setInput({ ...input, ["PinCode"]: true });
              }
              onChangeHandler(e);
            }}
            InputLabelProps={{ shrink: true }}
            sx={{ my: 2 }}
          />
          {!input?.PinCode ? (
            <FormHelperText
              error
              sx={{
                visibility: input?.PinCode ? "hidden" : "initial",
                m: 0,
                p: 0,
              }}
            >
              PinCode must contain 6 numbers only <br /> and the first digit
              should between 1-9.
            </FormHelperText>
          ) : null}
        </DialogContent>
        <DialogActions>
          {console.log( mystate?.AreaName &&
              mystate?.PinCode &&
              mystate?.District &&
              mystate?.state &&
              mystate?.country )}
          <Button
            color="success"
            onClick={onSubmitForm}
            variant="outlined"
            disabled={
              mystate?.AreaName &&
              mystate?.PinCode &&
              mystate?.District &&
              mystate?.state &&
              mystate?.country &&
              input?.PinCode
                ? false
                : true
            }
          >
            Submit
          </Button>
          <Button
            onClick={() => {
              setState({
                AreaName: "",
                District: "",
                state: "",
                country: "",
                PinCode: "",
              }),
                handleClose();
            }}
            color="error"
            variant="outlined"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
