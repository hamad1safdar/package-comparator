import { FC, useMemo } from "react";

import { calculateMarks } from "../../utils";

import "./styles.css";
import { useQuery } from "react-query";
import { Spin, Tag } from "antd";

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
      final = { recommended: p1, notRecommended: p2 };
    }

    return {
      timesBetter: rating[final.recommended] / rating[final.notRecommended],
      name: final.recommended,
      stars: data[final.recommended].starsCount,
      downloads: Math.floor(data[final.recommended].downloads),
      health: Math.floor(data[final.recommended].health * 100),
      description: data[final.recommended].description,
      links: data[final.recommended].links,
    };
  }, [data]);

  const { isLoading, data: languages } = useQuery(
    ["git/languages", result?.links?.repository],
    async () => {
      const repoLink = result?.links?.repository;
      if (!repoLink) return null;
      const [_o, _t, _f, owner, repo] = repoLink.split("/");
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/languages`
      );
      if (!response.ok) {
        throw new Error("Unable to fetch data from Github!");
      }
      return response.json();
    }
  );

  return (
    <div className="recommendation horizontal-center">
      <div className="recommendation-heading fw-600">
        {result.name} is {result.timesBetter?.toFixed(2)} times better.
      </div>
      <div className="recommendation-box">
        <div className="text-section">
          <span className="label color-black">Recommended: </span>
          <span className="result fw-600">{result.name}</span>
          <div>{result.description}</div>
          {result.links?.homepage && (
            <>
              Visit this{" "}
              <a target="_blank" href={result.links.homepage}>
                link
              </a>{" "}
              for more details.
            </>
          )}
        </div>
        <div className="stats-section">
          {[
            { label: "Downloads", value: result.downloads + "+" },
            { label: "Stars", value: result.stars },
            { label: "Health", value: result.health + "%" },
          ].map((item) => (
            <div className="stats-box" key={item.label}>
              <div className="stats-heading color-black">{item.label}</div>
              <div className="stats-value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      {isLoading ? (
        <Spin spinning={isLoading} />
      ) : (
        <div className="language-section">
          <span className="color-black">Languagues </span>
          {Object.keys(languages).map((language) => (
            <Tag color="cyan" key={language}>
              {language}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendation;
