import { ResponsiveBar } from "@nivo/bar";
import { Box } from "@mui/system";
import Loader from "../Global/loader";
import { useTheme, useMediaQuery } from "@mui/material";
const BarChart = ({ data=[], nameArray=[], isload=true,XaxisName,YaxisName,index }) => {
  const theme = useTheme();
  const isMdToLg = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const tickRotation = isMdToLg ? 0 : 25;
  const tickWidth = isMdToLg ? 300 : 250;

  return (
    <Box height={tickWidth} color={"black"} px={2} py={2} m={0}>
      {isload ? (
        <Box mt={10} height="100%" width="100%">
          <Loader SpinnerColor="seagreen" />
        </Box>
      ) : (
        <ResponsiveBar
          data={data}
          keys={nameArray}
          indexBy={index}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.4}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "set3" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#eed312",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#38bcb2",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: tickRotation,
            legend: YaxisName,
            legendPosition: "middle",
            legendOffset: 40,
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend:XaxisName,
            legendPosition: "middle",
            legendOffset: -50,
            truncateTickAt: 0,
          }}
          enableGridX={true}
          enableTotals={true}
          totalsOffset={2}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", "3"]],
          }}
          legends={[]}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={(e) =>
            e.id + ": " + e.formattedValue + " in Area: " + e.indexValue
          }
        />
      )}
    </Box>
  );
};

export default BarChart;
