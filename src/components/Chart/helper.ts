import {
  ChartsData,
  DownloadsStat,
  NPMSParsedResponse,
} from "../../types/types";

export const transformDataForCharts = (
  data: NPMSParsedResponse
): Array<ChartsData> | null => {
  if (!data) return null;
  const [p1Downloads, p2Downloads] = data.map((packageItem) =>
    transformDownloadData(packageItem.downloadsStats, packageItem.name)
  );

  //sorting, on the basisi of dates, is required to avoid to plotting non-crossing, independent lines on the chart
  return [...p1Downloads, ...p2Downloads].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });
};

const transformDownloadData = (
  downloadsStats: Array<DownloadsStat>,
  name: string
) =>
  downloadsStats.map((download) => ({
    date: download.from.split("T")[0],
    count: download.count,
    category: name,
  }));
