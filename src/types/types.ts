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
  onCompareClick: () => void;
}
