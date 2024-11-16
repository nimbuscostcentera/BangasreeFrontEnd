import { Box } from "@mui/material";
import Header from "../../Components/Global/Header";
import LineChart from "../../Components/Global/LineChart";

const LineChartScreen = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default LineChartScreen;
