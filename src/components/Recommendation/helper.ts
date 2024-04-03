import { RecommendationResult, NPMSParsedResponse } from "../../types/types";

const calculateMarks = (
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

export const prepareResult = (
  data: NPMSParsedResponse
): RecommendationResult => {
  const rating = data.reduce((prev, currStats) => {
    const { communityInterest, downloadsCount, tests, carefulness } = currStats;
    prev[currStats.name] = calculateMarks(
      communityInterest,
      downloadsCount,
      tests,
      carefulness
    );
    return prev;
  }, {} as { [x: string]: number });

  const [p1, p2] = data.map((packageItem) => packageItem.name);

  let final: { recommended: string; notRecommended: string };

  if (rating[p1] > rating[p2]) {
    final = { recommended: p1, notRecommended: p2 };
  } else if (rating[p1] < rating[p2]) {
    final = { recommended: p2, notRecommended: p1 };
  } else {
    final = { recommended: p1, notRecommended: p2 };
  }

  const recommendedPackage = data.find(
    (packageItem) => packageItem.name === final.recommended
  );

  //recommendedPackage will never be undefined. Therefor, error can be ignored.
  //adding a check to suppress TS warning
  if (!recommendedPackage) throw new Error("Error");

  return {
    timesBetter: rating[final.recommended] / rating[final.notRecommended],
    name: final.recommended,
    stars: recommendedPackage.starsCount,
    downloads: Math.floor(recommendedPackage.downloadsCount),
    health: Math.floor(recommendedPackage.health * 100),
    description: recommendedPackage.description,
    links: recommendedPackage.links,
  };
};
