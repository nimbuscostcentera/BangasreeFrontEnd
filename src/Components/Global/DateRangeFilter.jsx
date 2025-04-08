import {Input } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import PropTypes from "prop-types";
DateRangFilter.propTypes = {
  setState: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  name1: PropTypes.string.isRequired,
  name2: PropTypes.string.isRequired,
};
export default function DateRangFilter({ setState, state, name1, name2 }) {
  var date = new Date();
  var datestring = date.toISOString();
  var dateInput = datestring.split("T");
  var MaxDate = dateInput[0];

  function InputHandler(e) {
    var key = e.target.name;
    var value = e.target.value;
    var Value = new Date(value);
    var final = Value.toISOString();
    var finalval = final.split("T");
    setState({ ...state, [key]: finalval[0] });
  }
  return (
    <Grid
      container
      sx={{
        display: "flex",
        width: "fit-content",
        borderRadius: 1,
        my:0.8
      }}
    >
      <Grid item sx={{ color: "#787878", mr:1}}>
        <label>
          From
          <br />
          <Input
            value={state[name1]|""}
            name={name1}
            type="date"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 1,
              border: "1px solid #D0D0D0",
              paddingX: 1.5,
              paddingY: 0.5,
            }}
            inputProps={{ max: state[name2]?state[name2]:MaxDate }}
            onChange={InputHandler}
          />
        </label>
      </Grid>
      <Grid
        item
        sx={{
          color: "#787878",
          mr: 1,
        }}
      >
        <label>
          To
          <br />
          <Input
            name={name2}
            value={state[name2]||""}
            type="date"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 1,
              border: "1px solid #D0D0D0",
              paddingX: 1.5,
              paddingY: 0.5,
            }}
            inputProps={{ min: state[name1], max: MaxDate }}
            onChange={InputHandler}
            disabled={state[name1] ? false : true}
          />
        </label>
      </Grid>
    </Grid>
  );
}
