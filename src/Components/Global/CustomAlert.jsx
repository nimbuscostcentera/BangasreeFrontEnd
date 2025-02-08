import * as React from "react";
import { Alert,Stack,Snackbar,AlertTitle,Button,IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
export default function CustomAlert({ msg, alertSeverity, Copen, title, suggetion }) {
  const [open, setopen] = useState(Copen);
  const handleClose = () => {
    setopen(false);
  }
 const action = (
   <React.Fragment>
     <Button color="secondary" size="small" onClick={handleClose}>
       UNDO
     </Button>
     <IconButton
       size="small"
       aria-label="close"
       color="inherit"
       onClick={handleClose}
     >
       <CloseIcon fontSize="small" />
     </IconButton>
   </React.Fragment>
 );
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        action={action}
      >
        <Alert severity={alertSeverity}>
          <AlertTitle>{title}</AlertTitle>
          {msg}
          <div>
            <strong>{suggetion}</strong>
          </div>
        </Alert>
      </Snackbar>
    </Stack>
  );
}
