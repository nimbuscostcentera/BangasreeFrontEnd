import {  Input } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import PropTypes from "prop-types";
DateRangFilter2.propTypes = {
  state1: PropTypes.string,
  state2: PropTypes.string,
  name1: PropTypes.string,
  name2: PropTypes.string,
  MaxDate1: PropTypes.string,
  MaxDate2: PropTypes.string,
  InputHandler: PropTypes.func,
};
function DateRangFilter2({
  state1,
  state2,
  name1,
  name2,
  MaxDate1,
  MaxDate2,
  InputHandler,
}) {
  //console.log(state1,state2,MaxDate1, MaxDate2);
  return (
    <Grid
      container
      sx={{
        display: "flex",
        width: "fit-content",
        justifyContent: "center",
        borderRadius: 1,
      }}
    >
      <Grid item sx={{ color: "#787878", mr: 1 }}>
        <label>
          From
          <br />
          <Input
            value={state1||""}
            name={name1}
            type="date"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 1,
              border: "1px solid #D0D0D0",
              paddingX: 1.5,
            }}
            inputProps={{ max: state2 || MaxDate1 }}
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
            value={state2||""}
            type="date"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 1,
              border: "1px solid #D0D0D0",
              paddingX: 1.5,
            }}
            inputProps={{ min: state1, max: MaxDate2 }}
            onChange={InputHandler}
            disabled={
              state1 !== "" && state1 !== undefined && state1 !== null
                ? false
                : true
            }
          />
        </label>
      </Grid>
    </Grid>
  );
}
export default DateRangFilter2;