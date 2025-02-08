import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openCamera, takePhoto } from "../../Slice/ScannerSlicer";
import Camera from "react-html5-camera-photo";
import { Button } from "@mui/material";
function CameraComponent({ cameraKey }) {
  const dispatch = useDispatch();
  const ScannerObject= useSelector((state) => state.Scanner[cameraKey]);

  const handleOpenCamera = () => {
    dispatch(openCamera(cameraKey));
  };
  const handleTakePhoto = (imageData) => {
    dispatch(takePhoto({ cameraKey, imageData }));
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleOpenCamera} disabled={ScannerObject.isButtonDisable}>
        Upload Here
      </Button>
        {
          ScannerObject.isCameraOpen?<Camera onTakePhoto={(pic)=>{handleTakePhoto(pic)}}/>:""
        }
    </>
  );
}

export default CameraComponent;
