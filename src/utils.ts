import { NPMSParsedResponse } from "./types/types";

export const parseNPMSResponse = (data: {
  [x: string]: any;
}): NPMSParsedResponse => {
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
