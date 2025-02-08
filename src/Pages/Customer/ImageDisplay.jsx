import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {confirmPhoto,retakePhoto} from "../../Slice/ScannerSlicer";
import { Box,Button,  } from "@mui/material";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
function ImageDisplay({ cameraKey }) {
  const dispatch = useDispatch();
  const ScannerObject= useSelector((state) => state.Scanner[cameraKey]);
const { global } = UseFetchLogger();
  const handleConfirmPhoto = () => {
    dispatch(confirmPhoto({ cameraKey }));
  };

  const handleRetakePhoto = () => {
    dispatch(retakePhoto({ cameraKey }));
  };

  return (
    <>
      {ScannerObject.isImageTaken ? (
        <>
          <img src={ScannerObject.imageData} height="500px" width="500px" />
          <Box
            sx={{
              padding: "10px",
              width: "480px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {!ScannerObject.isConfirmed ? (
              <>
                <Button
                  color="success"
                  variant="contained"
                  onClick={handleConfirmPhoto}
                >
                  Confirm
                </Button>
                <Button color="error" variant="contained" onClick={handleRetakePhoto}>
                  Retake
                </Button>
              </>
            ) : (
              ""
            )}
          </Box>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default ImageDisplay;
