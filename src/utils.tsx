import { TableDataSource, TableDataDefinition } from "./types/types";

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
