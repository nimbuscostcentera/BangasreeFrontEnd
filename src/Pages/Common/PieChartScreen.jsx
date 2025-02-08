import { Box } from "@mui/material";
import Header from "../../Components/Global/Header";
import PieChart from "../../Components/Global/PieChart";
const PieChartScreen = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default PieChartScreen;
