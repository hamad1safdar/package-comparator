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
  const rating = data.reduce((ratings, packageItem) => {
    const { communityInterest, downloadsCount, tests, carefulness } =
      packageItem;
    ratings[packageItem.name] = calculateMarks(
      communityInterest,
      downloadsCount,
      tests,
      carefulness
    );
    return ratings;
  }, {} as { [x: string]: number });

  //get keys for comparison purposes
  const [package1Key, package2Key] = data.map(
    (packageItem) => packageItem.name
  );

  let final: { recommended: string; notRecommended: string };

  if (rating[package1Key] > rating[package2Key]) {
    final = { recommended: package1Key, notRecommended: package2Key };
  } else if (rating[package1Key] < rating[package2Key]) {
    final = { recommended: package2Key, notRecommended: package1Key };
  } else {
    final = { recommended: package1Key, notRecommended: package2Key };
  }

  const recommendedPackage = data.find(
    (packageItem) => packageItem.name === final.recommended
  );

  //recommendedPackage will never be undefined. Therefore, error can be ignored.
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
