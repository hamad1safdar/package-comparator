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

export interface Stats {
  [key: string]: {
    starsCount: number | string;
    carefullness: number;
    tests: number;
    health: number | string;
    communityInterest: number;
    downloads: number;
    description: string;
    links: { [x: string]: string } | null;
  };
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
