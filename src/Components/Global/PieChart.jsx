import { ResponsivePie } from "@nivo/pie";
import useFetchPieChartData from "../../Apps/CustomHook/useFetchPie";
import { Box } from "@mui/system";

const PieChart = ({data}) => {
 
  return (
    <Box sx={{ height:320, width: 300 }}>
      <ResponsivePie
        data={data}
        sortByValue={true}
        margin={{ top: 60, right:70, bottom: 70, left: 10 }}
        startAngle={-179}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeInnerRadiusOffset={2}
        activeOuterRadiusOffset={10}
        borderWidth={2}
        borderColor={{
          from: "color",
          modifiers: [["darker", "0.3"]],
        }}
        arcLinkLabelsTextOffset={1}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsOffset={-10}
        arcLinkLabelsDiagonalLength={21}
        arcLinkLabelsStraightLength={14}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color", modifiers: [] }}
        arcLabelsRadiusOffset={0.55}
        colors={{ scheme: "dark2" }}
        arcLabelsSkipAngle={4}
        arcLabelsTextColor="black"
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "Active Account",
            },
            id: "lines",
          },
          {
            match: {
              id: "PreMatured Account",
            },
            id: "dots",
          },
          {
            match: {
              id: "Matured Account",
            },
            id: "lines",
          },
        ]}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 60,
            translateY: -100,
            itemsSpacing: 1,
            itemWidth:100,
            itemHeight: 19,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 13,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
};
export default PieChart;