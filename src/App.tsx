import { useCallback, useMemo } from "react";
import { useMutation } from "react-query";

import SearchBox from "./components/Searchbox/index";
import ComparisonTable from "./components/ComparisonTable";

import { DATA_KEYS, getTableData } from "./utils";

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
  const { mutate, data } = useMutation({
    mutationFn: fetchSelectedPackages,
  });

  const result = useMemo(() => {
    if (data) {
      return Object.keys(data).map((key) => {
        const {
          name,
          version,
          description,
          keywords,
          links,
          publisher,
          maintainers,
          license,
        } = data[key].collected.metadata;
        return {
          name,
          version,
          description,
          keywords,
          links,
          publisher,
          maintainers,
          license,
        };
      });
    } else return [];
  }, [data]);

  const handleClick = useCallback(
    (selectedArr: Array<string>) => {
      mutate(selectedArr);
    },
    [mutate]
  );

  return (
    <div className="page">
      <h2>NPM Package Comparator</h2>
      <SearchBox onCompareClick={handleClick} />
      <ComparisonTable
        dataSource={getTableData(result)}
        dataDefinition={DATA_KEYS}
      />
    </div>
  );
}

export default App;
