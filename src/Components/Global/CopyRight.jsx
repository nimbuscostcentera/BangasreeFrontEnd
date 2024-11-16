import { Typography } from "@mui/material";
import Link from "@mui/material/Link";
const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      Copyright©
      <Link color="primary" href="https://www.nimbussystems.co.in/">
        NimbusSystemPvtLtd
      </Link>
      {" " + new Date().getFullYear()}
    </Typography>
  );
};
export default Copyright;
