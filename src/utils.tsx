import {
  TableDataSource,
  TableDataDefinition,
  ChartsData,
} from "./types/types";

export const CONSTANTS = {
  NPMS_BASE_URL: "",
  GITHUB_BASE_URL: "",
};

export const getTableData = (data: {
  [x: string]: any;
}): TableDataSource | null => {
  if (!data) return null;
  return Object.keys(data)
    .map((key) => {
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
    })
    .reduce((prev, curr) => {
      Object.keys(curr).forEach((key) => {
        const currKey = key as keyof typeof curr;
        if (Array.isArray(prev[key])) {
          prev[key] = [...prev[key], curr[currKey]];
        } else {
          prev[key] = [curr[currKey]];
        }
      });
      return prev;
    }, {} as { [x: string]: any });
};

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

export const getDownloadsData = (data: {
  [x: string]: any;
}): Array<ChartsData> | null => {
  if (!data) return null;

  const [p1Key, p2Key] = Object.keys(data);
  const p1Downloads = (
    data[p1Key]["collected"]["npm"]["downloads"] as Array<{
      from: string;
      to: string;
      count: number;
    }>
  ).map((item) => {
    return {
      date: item.from.split("T")[0],
      count: item.count,
      category: p1Key,
    };
  });

  const p2Downloads = (
    data[p2Key]["collected"]["npm"]["downloads"] as Array<{
      from: string;
      to: string;
      count: number;
    }>
  ).map((item) => {
    return {
      date: item.from.split("T")[0],
      count: item.count,
      category: p2Key,
    };
  });
  const result = [...p1Downloads, ...p2Downloads].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });
  return result;
};

export const getStats = (data: { [x: string]: any }) => {
  if (!data) return null;
  return Object.keys(data).reduce((prev, currKey) => {
    const collected = data[currKey]["collected"];
    const evaluation = data[currKey]["evaluation"];
    prev[currKey] = {
      starsCount: collected["github"]?.["starsCount"] || "N/A",
      carefullness: evaluation["quality"]?.["carefulness"] ?? 0,
      tests: evaluation["quality"]?.["tests"] ?? 0,
      health: evaluation["quality"]?.["health"] ?? "N/A",
      communityInterest: evaluation["popularity"]?.["communityInterest"] ?? 0,
      downloads: evaluation["popularity"]?.["downloadsCount"] ?? 0,
      description: collected["metadata"]?.["description"] || "N/A",
      links: collected["metadata"]["links"]?.["homepage"],
    };
    return prev;
  }, {} as { [x: string]: any });
};

export const calculateMarks = (
  communityInterest: number,
  downloads: number,
  tests: number,
  carefullness: number
) => {
  tests = (tests + carefullness) / 2;

  const weightCommunityInterest = 0.2;
  const weightDownloads = 0.5;
  const weightTests = 0.2;

  const maxCommunityInterest = 10;
  const maxDownloads = 1000;
  const maxTests = 100;

  const normalizedCommunityInterest = Math.min(
    communityInterest / maxCommunityInterest,
    1
  );
  const normalizedDownloads = Math.min(downloads / maxDownloads, 1);
  const normalizedTests = Math.min(tests + carefullness / maxTests, 1);

  const totalScore =
    normalizedCommunityInterest * weightCommunityInterest +
    normalizedDownloads * weightDownloads +
    normalizedTests * weightTests;

  const scaledScore = totalScore * 10;

  return scaledScore;
};
