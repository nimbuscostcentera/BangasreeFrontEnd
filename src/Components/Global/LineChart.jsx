import { ResponsiveLine } from "@nivo/line";

const LineChart = ({ sdata, Xaxislegend, Yaxislegend }) => {
  return (
    <ResponsiveLine
      data={sdata}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: "#4b5563",
            },
          },
          legend: {
            text: {
              fill: "#4b5563",
            },
          },
          ticks: {
            line: {
              stroke: "#4b5563",
              strokeWidth: 1,
            },
            text: {
              fill: "#4b5563",
            },
          },
        },
        legends: {
          text: {
            fill: "#4b5563",
          },
        },
        tooltip: {
          container: {
            color: "#3b82f6",
          },
        },
      }}
      colors={{ scheme: "set1" }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.0f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: Xaxislegend, // added
        legendOffset: 36,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: Yaxislegend,
        legendOffset: -40,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={7}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="data.y"
      pointLabelYOffset={-14}
      areaOpacity={0}
      enableTouchCrosshair={true}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "grey",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
