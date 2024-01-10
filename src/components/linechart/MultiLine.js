import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/plots";
import { Col, Row } from "antd";

const DemoLine = ({ title, subTitle, data }) => {
  //console.log("Data prop in DemoColumn:", data);

  // Check if the data prop is undefined, empty object, or an empty array
  // if (!data || (typeof data === "object" && Object.keys(data).length === 0))
  if (data.length === null || data.length === 0) {
    //console.log("Data dis not availabe");
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

  // Visualization configuration
  const config = {
    data: data.flatMap((item) => item.data),
    xField: "monthYear",
    yField: "value",
    seriesField: "location",
    yAxis: {
      title: {
        text: "Value",
      },
    },
    xAxis: {
      title: {
        text: "Month/Year",
      },
    },
    tooltip: {
      shared: true,
      showCrosshairs: true,
    },
  };

  return (
    <>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: 10,
        }}
      >
        <Col span={22}>
          <p style={{ fontSize: 24 }}>{title}</p>
          <p style={{ paddingBottom: 30 }}>{subTitle}</p>
          <Line {...config} style={{ height: "55vh" }} />
        </Col>
      </Row>
    </>
  );
};

export default DemoLine;
