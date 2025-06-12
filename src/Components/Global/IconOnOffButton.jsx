import { IconButton, Tooltip, Typography} from "@mui/material";
import StyledBox from "../styledComponent/StyledBox";
import PropTypes from "prop-types";
IconOnOffButton.propTypes = {
  icon1: PropTypes.object,
  icon2: PropTypes.object,
  Tooltip1: PropTypes.string,
  Tooltip2: PropTypes.string,
  h1: PropTypes.node,
  h2: PropTypes.node,
  disable1: PropTypes.bool,
  disable2: PropTypes.bool,
  funcTrigger1: PropTypes.func,
  funcTrigger2: PropTypes.func,
  textcolor1: PropTypes.string,
  textcolor2: PropTypes.string,
  mt: PropTypes.number,
  mb: PropTypes.number,
};
export default function IconOnOffButton({
  icon1,
  icon2,
  Tooltip1,
  Tooltip2,
  h1,
  h2,
  disable1,
  disable2,
  funcTrigger1,
  funcTrigger2,
  textcolor1,
  textcolor2,mt,mb
}) {
  return (
    <StyledBox mr={1} mt={mt || 0} mb={0 || mb}>
      {icon1 ? (
        <StyledBox>
          <Typography color={textcolor1}>{h1}</Typography>
          <Tooltip title={Tooltip1}>
            <span>
              <IconButton onClick={funcTrigger1} disabled={disable1}>
                {icon1}
              </IconButton>
            </span>
          </Tooltip>
        </StyledBox>
      ) : null}
      {icon2 ? (
        <StyledBox>
          <Typography color={textcolor2}>{h2}</Typography>
          <Tooltip title={Tooltip2}>
            <span>
              <IconButton onClick={funcTrigger2} disabled={disable2}>
                {icon2}
              </IconButton>
            </span>
          </Tooltip>
        </StyledBox>
      ) : null}
    </StyledBox>
  );
}
