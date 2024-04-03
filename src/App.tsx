import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Spin } from "antd";

import SearchBox from "./components/Searchbox/index";
import ComparisonTable from "./components/ComparisonTable";
import DownloadsChart from "./components/Chart";
import Recommendation from "./components/Recommendation";

import {
  DATA_KEYS,
  parseDataForChart,
  getTableData,
  parseNPMSResponse,
} from "./utils";

const fetchSelectedPackages = async (data: Array<string>) => {
  const response = await fetch("https://api.npms.io/v2/package/mget", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Unable to fetch libs record from npm!");
  }
  return response.json();
};

function App() {
  const [selected, setSelected] = useState<Array<string>>([]);
  const { isLoading, data } = useQuery(
    ["info/selected", selected],
    () => fetchSelectedPackages(selected),
    {
      enabled: selected.length === 2,
    }
  );

  const handleClick = useCallback((selectedArr: Array<string>) => {
    setSelected(selectedArr);
  }, []);

  const tableData = useMemo(() => getTableData(data), [data]);
  const chartData = useMemo(() => parseDataForChart(data), [data]);

  return (
    <div className="page">
      <h2>NPM Package Comparator</h2>
      <SearchBox onCompareClick={handleClick} />
      {isLoading ? (
        <Spin spinning={isLoading} fullscreen />
      ) : (
        data && (
          <>
            <ComparisonTable
              dataSource={tableData}
              dataDefinition={DATA_KEYS}
            />
            <DownloadsChart data={chartData} />
            <Recommendation data={parseNPMSResponse(data)} />
          </>
        )
      )}
    </div>
  );
}

export default App;
