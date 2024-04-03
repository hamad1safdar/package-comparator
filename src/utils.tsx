import {
  TableDataSource,
  TableDataDefinition,
  ChartsData,
  ParsedResponse,
} from "./types/types";

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

export const parseDataForChart = (data: {
  [x: string]: any;
}): Array<ChartsData> | null => {
  if (!data) return null;
  const [p1Downloads, p2Downloads] = Object.keys(data).map((key) =>
    extractDownloads(key, data)
  );
  const result = [...p1Downloads, ...p2Downloads].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });
  return result;
};

const extractDownloads = (key: string, data: { [x: string]: any }) => {
  return (
    data[key]["collected"]["npm"]["downloads"] as Array<{
      from: string;
      to: string;
      count: number;
    }>
  ).map((item) => {
    return {
      date: item.from.split("T")[0],
      count: item.count,
      category: key,
    };
  });
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

export const parseNPMSResponse = (data: {
  [x: string]: any;
}): Array<ParsedResponse> => {
  return Object.keys(data).map((packageKey) => {
    const metadata = data[packageKey]["collected"]["metadata"];
    const npm = data[packageKey]["collected"]["npm"];
    const github = data[packageKey]["collected"]["github"];
    const evaluation = data[packageKey]["evaluation"];
    return {
      name: metadata.name,
      version: metadata.version,
      description: metadata?.description || "N/A",
      publisher: metadata?.publisher || {},
      maintainers: metadata?.maintainers || [],
      links: metadata?.links || {},
      license: metadata?.license || "N/A",
      downloadsStats: npm?.downloads || [],
      starsCount: github?.starsCount || 0,
      carefulness: evaluation["quality"]?.["carefulness"] ?? 0,
      tests: evaluation["quality"]?.["tests"] ?? 0,
      health: evaluation["quality"]?.["health"] ?? 0,
      downloadsCount: evaluation["popularity"]?.["downloadsCount"] ?? 0,
      communityInterest: evaluation["popularity"]?.["communityInterest"] ?? 0,
    };
  });
};
