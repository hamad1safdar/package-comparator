import { FC } from "react";
import { Col, Row } from "antd";

import "./styles.css";
import { TableProps } from "../../types/types";

const ComparisonTable: FC<TableProps> = ({ dataSource, dataDefinition }) => {
  if (!dataSource) return null;
  return (
    <div className="grid-table">
      {dataDefinition.map((item) => {
        return (
          <Row className="row" key={item.key}>
            <Col className="column header" span={4}>
              {item.label}
            </Col>
            <Col className={"column " + item.key} span={10}>
              {item.transform(dataSource[item.key]?.[0])}
            </Col>
            <Col className={"column " + item.key} span={10}>
              {item.transform(dataSource[item.key]?.[1])}
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default ComparisonTable;
