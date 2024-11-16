import { Box} from "@mui/material";

const ProgressCircle = ({ progress = "0.75", size = "50" }) => {
  const angle = progress * 360;
  return (
    <Box
      sx={{
        background: `radial-gradient(#e7e5e4 55%, transparent 56%),conic-gradient(transparent 0deg ${angle}deg,
         #6366f1 ${angle}deg 360deg),#10b981`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        color:"#000000"
      }}
    />
  );
};

export default ProgressCircle;
