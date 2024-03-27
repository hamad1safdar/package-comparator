import { FC, useMemo } from "react";
import { calculateMarks } from "../../utils";

import "./styles.css";

const Recommendation: FC<{ data: { [x: string]: any } | null }> = ({
  data,
}) => {
  if (!data) return null;

  const result = useMemo(() => {
    const [p1, p2] = Object.keys(data);

    const p1Result = calculateMarks(
      data[p1].communityInterest,
      data[p1].downloads,
      data[p1].tests,
      data[p1].carefullness
    );
    const p2Result = calculateMarks(
      data[p2].communityInterest,
      data[p2].downloads,
      data[p2].tests,
      data[p2].carefullness
    );

    const marks = { [p1]: p1Result, [p2]: p2Result };

    console.log(marks);

    if (marks[p1] > marks[p2]) {
      return {
        timesBetter: marks[p1] / marks[p2],
        name: p1,
        stars: data[p1].starsCount,
        downloads: Math.floor(data[p1].downloads),
        health: data[p1].health,
        description: data[p1].description,
      };
    } else if (marks[p1] < marks[p2]) {
      return {
        timesBetter: marks[p2] / marks[p1],
        name: p2,
        stars: data[p2].starsCount,
        downloads: Math.floor(data[p2].downloads),
        health: data[p2].health,
        description: data[p2].description,
      };
    } else {
      return {};
    }
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
