import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { Col, Row, Select } from "antd";

const DemoColumn = (props) => {
  const { title, subTitle, data, isGroup } = props;
  //console.log("Data prop in DemoColumn:", data);

  // Check if the data prop is undefined or not an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    // Return only title and subTitle when data is not available
    return (
      <div>
        <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
          <p style={{ fontSize: 24 }}>{title} </p>
          <p style={{ fontSize: 16 }}> {subTitle}</p>
        </div>
        <div>No data available for the chart.</div>
      </div>
    );
  }

  const config = {
    data: data,
    isGroup: isGroup,
    xField: "date", // x-axis: 'name' for OverStay and 'date' for VisitingPakistan
    yField: "value", // y-axis: 'value' for both
    seriesField: "name", // series field: 'name' for OverStay (key) and 'name' for VisitingPakistan (year)
    color: ["#4083DE", "#59CB89", "#5535AA", "#DDD95D", "#8060D6"],
    barStyle: {
      fill: "l(0) 0:#3e5bdb 1:#dd3121",
    },
    marginRatio: 0.1,
  };

  return (
    <>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          background: "white",
          padding: "20px 0px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: 10,
        }}
      >
        <Col span={22}>
          <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
            <p style={{ fontSize: 24 }}>{title} </p>
            <p style={{ fontSize: 16 }}> {subTitle}</p>
          </div>
          <Column {...config} />
        </Col>
      </Row>
    </>
  );
};

export default DemoColumn;
