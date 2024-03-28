import { useCallback, useMemo } from "react";
import { useMutation } from "react-query";
import { Spin } from "antd";

import SearchBox from "./components/Searchbox/index";
import ComparisonTable from "./components/ComparisonTable";
import DownloadsChart from "./components/Chart";
import Recommendation from "./components/Recommendation";

import { DATA_KEYS, getDownloadsData, getStats, getTableData } from "./utils";

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
  const { mutate, data, isLoading } = useMutation({
    mutationFn: fetchSelectedPackages,
  });

  const handleClick = useCallback(
    (selectedArr: Array<string>) => {
      mutate(selectedArr);
    },
    [mutate]
  );

  const tableData = useMemo(() => getTableData(data), [data]);
  const downloadsData = useMemo(() => getDownloadsData(data), [data]);
  const statsData = useMemo(() => getStats(data), [data]);

  return (
    <div className="page">
      <h2>NPM Package Comparator</h2>
      <SearchBox onCompareClick={handleClick} />
      {isLoading ? (
        <Spin spinning={isLoading} fullscreen />
      ) : (
        <>
          <ComparisonTable dataSource={tableData} dataDefinition={DATA_KEYS} />
          <DownloadsChart data={downloadsData} />
          <Recommendation data={statsData} />
        </>
      )}
    </div>
  );
}

export default App;
