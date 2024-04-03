import { FC, useMemo } from "react";
import { useQuery } from "react-query";
import { Spin, Tag } from "antd";

import { ParsedResponse } from "../../types/types";
import { prepareResult } from "./helper";

import "./styles.css";

const Recommendation: FC<{ data: Array<ParsedResponse> }> = ({ data }) => {
  if (!data) return null;

  const result = useMemo(() => prepareResult(data), [data]);

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
            <Tag className="lang-tag" color="cyan" key={language}>
              {language}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendation;
