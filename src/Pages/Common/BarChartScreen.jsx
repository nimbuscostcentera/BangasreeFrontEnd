import { Box } from "@mui/material";
import Header from "../../Components/Global/Header";
import BarChart from "../../Components/Global/BarChart";

const BarChartScreen = () => {
  return (
    <Box m="20px" >
      <Header title="Bar Chart" subtitle="Simple Bar Chart" />
      <Box height="85vh">
        <BarChart />
      </Box>
    </Box>
  );
};

export default BarChartScreen;
