import { Spin } from "antd";
import { useQuery } from "react-query";
import { useCallback, useState } from "react";

import DownloadsChart from "./components/Chart";
import SearchBox from "./components/Searchbox/index";
import Recommendation from "./components/Recommendation";
import ComparisonTable from "./components/ComparisonTable";

import { parseNPMSResponse } from "./utils";
import { TableDataDefinition } from "./types/types";

export const DATA_KEYS: Array<TableDataDefinition> = [
  {
    key: "name",
    label: "Package Name",
    transform: (data: string) => data || "N/A",
  },
  {
    key: "version",
    label: "Version",
    transform: (data: string) => data || "N/A",
  },
  {
    key: "keywords",
    label: "Keywords",
    transform: (data: Array<string>) => {
      if (!data) return "N/A";
      if (data?.length > 10) {
        return data.slice(0, 10).join(", ");
      } else return data.join(", ");
    },
  },
  {
    key: "links",
    label: "Repository",
    transform: (data: { [x: string]: string }) => {
      return Object.keys(data).map((key) => {
        if (key === "npm") return null;
        return (
          <a target="_blank" key={key} href={data[key]}>
            {key}
          </a>
        );
      });
    },
  },
  {
    key: "license",
    label: "License",
    transform: (data: string) => data || "N/A",
  },
  {
    key: "publisher",
    label: "Authors/Publishers",
    transform: (data: { username: string; email: string }) => data.email,
  },
  {
    key: "maintainers",
    label: "Maintainers",
    transform: (data: Array<{ username: string; email: string }>) =>
      data[0].email,
  },
];

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
              dataSource={parseNPMSResponse(data)}
              dataDefinition={DATA_KEYS}
            />
            <DownloadsChart data={parseNPMSResponse(data)} />
            <Recommendation data={parseNPMSResponse(data)} />
          </>
        )
      )}
    </div>
  );
}

export default App;
