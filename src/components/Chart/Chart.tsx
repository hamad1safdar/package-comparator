import { FC } from "react";
import { Line } from "@ant-design/charts";

import { transformDataForCharts } from "./helper";
import { ParsedResponse } from "../../types/types";

import "./styles.css";

const DownloadsChart: FC<{ data: Array<ParsedResponse> | null }> = ({
  data,
}) => {
  if (!data) return null;

  const config = {
    data: transformDataForCharts(data),
    xField: "date",
    yField: "count",
    colorField: "category",
    style: {
      lineWidth: 3,
    },
  };

  return (
    <div className="charts-container">
      <h3>Downloads</h3>
      <Line containerStyle={{ width: "100%" }} className="line" {...config} />
    </div>
  );
};

export default DownloadsChart;
