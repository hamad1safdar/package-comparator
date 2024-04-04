import { FC } from "react";
import { Col, Row } from "antd";

import { PackageInfo, TableProps } from "../../types/types";

import "./styles.css";

/**
 * Previously, a helper function was being used to transform data and following was the shape of it
 * {
 *  name: ['name1', 'name2'],
 *  version: ['version1', 'version2'],
 *  description: ['description1', 'description2']
 *  .
 *  .
 *  and so on
 * }
 *
 * Currently, there is no transformation involved except for the global transformation function.
 * And now, following is the shape of data source:
 * [
 *   {name: 'name1', version: 'version1', description: 'description1'.....},
 *   {name: 'name2', version: 'version2', description: 'description2'.....}
 * ]
 */

const ComparisonTable: FC<TableProps> = ({ dataSource, dataDefinition }) => {
  if (!dataSource) return null;
  return (
    <div className="grid-table">
      {dataDefinition.map((item) => {
        const key = item.key as keyof PackageInfo;
        return (
          <Row className="row" key={item.key}>
            <Col className="column header" md={6} sm={4} lg={8} xl={4}>
              {item.label}
            </Col>
            <Col
              className={"column " + item.key}
              xs={12}
              sm={12}
              md={9}
              lg={8}
              xl={10}
            >
              {item.transform(dataSource[0]?.[key])}
            </Col>
            <Col
              className={"column " + item.key}
              xs={12}
              sm={12}
              md={9}
              lg={8}
              xl={10}
            >
              {item.transform(dataSource[1]?.[key])}
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default ComparisonTable;
