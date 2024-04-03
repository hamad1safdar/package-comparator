import {
  TableDataSource,
  TableDataDefinition,
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
