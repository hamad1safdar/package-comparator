import { FC, useMemo } from "react";

import { calculateMarks } from "../../utils";

import "./styles.css";

const Recommendation: FC<{ data: { [x: string]: any } | null }> = ({
  data,
}) => {
  if (!data) return null;

  const result = useMemo(() => {
    const keys = Object.keys(data);

    const rating = keys.reduce((prev, currKey) => {
      prev[currKey] = calculateMarks(
        data[currKey].communityInterest,
        data[currKey].downloads,
        data[currKey].tests,
        data[currKey].carefullness
      );
      return prev;
    }, {} as { [x: string]: number });

    let final;

    const [p1, p2] = keys;
    if (rating[p1] > rating[p2]) {
      final = { recommended: p1, notRecommended: p2 };
    } else if (rating[p1] < rating[p2]) {
      final = { recommended: p2, notRecommended: p1 };
    } else {
      return {};
    }

    return {
      timesBetter: rating[final.recommended] / rating[final.notRecommended],
      name: final.recommended,
      stars: data[final.recommended].starsCount,
      downloads: Math.floor(data[final.recommended].downloads),
      health: data[final.recommended].health,
      description: data[final.recommended].description,
    };
  }, [data]);

  return (
    <div className="recommendation horizontal-center">
      <div className="recommendation-heading">
        {result.name} is {result.timesBetter?.toFixed(2)} times better.
      </div>
      <div className="recommendation-box">
        <div className="text-section">
          <div>
            <strong>Recommended:</strong> {result.name}
          </div>
          <div>{result.description}</div>
        </div>
        <div className="stats-section"></div>
      </div>
    </div>
  );
};

export default Recommendation;
