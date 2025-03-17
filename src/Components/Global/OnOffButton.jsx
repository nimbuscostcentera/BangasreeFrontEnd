import { Button, Box } from "@mui/material";
import PropTypes from "prop-types";

OnOffButton.propTypes = {
  yes: PropTypes.string,
  no: PropTypes.string,
  type1: PropTypes.string,
  type2: PropTypes.string,
  functrigger1: PropTypes.func,
  functrigger2: PropTypes.func,
  theme1: PropTypes.string,
  theme2: PropTypes.string,
  disabled1: PropTypes.bool,
  disabled2: PropTypes.bool,
};
export default function OnOffButton({
  yes,
  no,
  type1,
  type2,
  functrigger1,
  functrigger2,
  theme1,
  theme2,
  disabled1,
  disabled2,
}) {
  return (
    <Box sx={{ mt: 1, display: "flex", justifyContent: "space-around" }}>
      {yes ? (
        <>
          <Box mx={1}>
            <Button
              color={theme1}
              variant="contained"
              type={type1}
              disabled={disabled1}
              onClick={functrigger1}
            >
              {yes}
            </Button>
          </Box>
        </>
      ) : null}
      {no ? (
        <>
          {" "}
          <Box mx={1}>
            <Button
              color={theme2}
              variant="contained"
              type={type2}
              disabled={disabled2}
              onClick={functrigger2}
            >
              {no}
            </Button>
          </Box>
        </>
      ) : null}
    </Box>
  );
}
