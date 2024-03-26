import { useQuery } from "react-query";

import { NPMSugesstionsObject } from "../../types/types";

const useData = (debouncedQueryValue: string) => {
  return useQuery(
    ["suggestions", debouncedQueryValue],
    async (): Promise<Array<NPMSugesstionsObject>> => {
      if (!debouncedQueryValue) return [];
      const response = await fetch(
        "https://api.npms.io/v2/search/suggestions?q=" + debouncedQueryValue
      );
      if (!response.ok) {
        throw new Error("Unable to fetch suggestions!");
      } else return response.json();
    }
  );
};

export default useData;
