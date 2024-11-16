import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import { Box, margin } from "@mui/system";
import { useNavigate } from "react-router-dom";

export default function ReusableBreadcrumbs({props}) {
  const navigate = useNavigate();

  return (
    <Box role="presentation" sx={{ mt: 1.5}}>
      <Breadcrumbs aria-label="breadcrumb">
        {props.map((item,index) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Link
                underline="hover"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
                color="inherit"
                onClick={() => {
                  if (
                    item?.link !== "#" &&
                    item?.uniqueID !== undefined &&
                    item?.uniqueID !== null &&
                    item?.value !== undefined &&
                    item?.value !== null
                  ) {
                    navigate(`${item?.link}`, {
                      state: { [item?.uniqueID]: item?.value },
                    });
                  } else if (
                    item?.link !== "#" &&
                    item?.uniqueID == undefined &&
                    item?.uniqueID == null &&
                    item?.value == undefined &&
                    item?.value == null
                  ) {
                    navigate(`${item?.link}`);
                  } 
                }}
              >
                <Icon>{item?.icon}</Icon>
                <Typography
                  color="text.primary"
                >
                  {item?.title}
                </Typography>
              </Link>
            </Box>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
