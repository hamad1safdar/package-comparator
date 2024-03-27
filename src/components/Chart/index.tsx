import { FC } from "react";
import { Line } from "@ant-design/charts";

import { ChartsData } from "../../types/types";

const DownloadsChart: FC<{ data: Array<ChartsData> | null }> = ({ data }) => {
  if (!data) return null;

  const config = {
    data,
    xField: "date",
    yField: "count",
    colorField: "category",
  };

  return (
    <>
      <h3>Downloads</h3>
      <Line style={{ width: "100%" }} {...config} />
    </>
  );
};

export default DownloadsChart;
