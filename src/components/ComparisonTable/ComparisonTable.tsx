import { FC } from "react";
import { Col, Row } from "antd";

import { PackageInfo, TableProps } from "../../types/types";

import "./styles.css";

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
