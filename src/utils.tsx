import {
  TableDataSource,
  TableDataDefinition,
  ChartsData,
} from "./types/types";

export const CONSTANTS = {
  NPMS_BASE_URL: "",
  GITHUB_BASE_URL: "",
};

export const getTableData = (
  result: Array<{ [x: string]: any }>
): TableDataSource | null => {
  const newResult = (result as Array<{ [x: string]: any }>).reduce<{
    [x: string]: any;
  }>((prev, curr) => {
    Object.keys(curr).forEach((key) => {
      if (Array.isArray(prev[key])) {
        prev[key] = [...prev[key], curr[key]];
      } else {
        prev[key] = [curr[key]];
      }
    });
    return prev;
  }, {});

  return Object.keys(newResult).length ? newResult : null;
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
  const [p1Key, p2Key] = Object.keys(data);

  return {
    [p1Key]: {
      starsCount: data[p1Key]["collected"]["github"]?.["starsCount"] || "N/A",
      carefullness: data[p1Key]["evaluation"]["quality"]["carefulness"],
      tests: data[p1Key]["evaluation"]["quality"]["tests"],
      health: data[p1Key]["evaluation"]["quality"]["health"],
      communityInterest:
        data[p1Key]["evaluation"]["popularity"]["communityInterest"],
      downloads: data[p1Key]["evaluation"]["popularity"]["downloadsCount"],
      description: data[p1Key]["collected"]["metadata"]["description"],
      links: data[p1Key]["collected"]["metadata"]["links"],
    },
    [p2Key]: {
      starsCount: data[p2Key]["collected"]["github"]?.["starsCount"] || "N/A",
      carefullness: data[p2Key]["evaluation"]["quality"]["carefulness"],
      tests: data[p2Key]["evaluation"]["quality"]["tests"],
      health: data[p2Key]["evaluation"]["quality"]["health"],
      communityInterest:
        data[p2Key]["evaluation"]["popularity"]["communityInterest"],
      downloads: data[p2Key]["evaluation"]["popularity"]["downloadsCount"],
      description: data[p2Key]["collected"]["metadata"]["description"],
      links: data[p2Key]["collected"]["metadata"]["links"],
    },
  };
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
