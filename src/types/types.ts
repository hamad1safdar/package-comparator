import { ReactNode } from "react";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface NPMSugesstionsObject {
  package: Package;
  flags: Flags;
  score: Score;
  searchScore: number;
  highlight: string;
}

export interface Package {
  name: string;
  version: string;
}

export interface Flags {
  deprecated: string;
}

export interface Score {
  final: number;
  detail: Detail;
}

export interface Detail {
  quality: number;
  popularity: number;
}

export type SearchboxHookParams = Array<NPMSugesstionsObject> | undefined;

export interface SearchboxProps {
  onCompareClick?: (selected: Array<string>) => void;
}

export interface TableDataDefinition {
  key: string;
  label: string;
  transform: (data: any) => string | ReactNode | Array<ReactNode>;
}

export interface TableDataSource {
  [x: string]: Array<number | string | object>;
}

export interface TableProps {
  dataSource: TableDataSource | null;
  dataDefinition: Array<TableDataDefinition>;
}

export interface ChartsData {
  date: string;
  count: number;
  category: string;
}

export interface RecommendationResult {
  timesBetter: number;
  name: string;
  stars: number;
  downloads: number;
  health: number;
  description: string;
  links: { [x: string]: string } | null;
}

export interface PersonObject {
  username: string;
  email: string;
}

export interface DownloadsStat {
  from: string;
  to: string;
  count: number;
}

export interface ParsedResponse {
  name: string;
  version: string;
  description: string;
  publisher: PersonObject | {};
  maintainers: Array<PersonObject>;
  links: { [x: string]: string };
  license: string;
  downloadsStats: Array<DownloadsStat>;
  starsCount: number;
  carefulness: number;
  tests: number;
  health: number;
  downloadsCount: number;
  communityInterest: number;
}
