import React from "react";
import { Col, Row } from "antd";
import { Pie } from "@ant-design/plots";

const PieChart3D = (props) => {
  const data = props.data;

  const colorPalette = {
    Deck: "#FF9800", // Orange - For the ship's deck and exterior
    Sea: "#1976D2", // Royal Blue - For the open sea and water
    Lifeboat: "#FF5722", // Deep Orange - For lifeboats and safety equipment
    Anchor: "#795548", // Brown - For ship anchors and chains
    Mast: "#FFEB3B", // Yellow - For the ship's mast and rigging
    Flag: "#D32F2F", // Red - For ship flags and signals
    Navigation: "#9C27B0", // Purple - For navigation lights and equipment
    // Add more colors for additional ship-related elements as needed
  };

  // Check if the data prop is undefined, empty object, or an empty array
  // if (!data || (typeof data === "object" && Object.keys(data).length === 0))
  if (!data || !Array.isArray(data) || data.length === 0) {
    // Return only title and subTitle when data is not available
    return (
      <div>
        <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
          <p style={{ fontSize: 24 }}>{props.title} </p>
          <p style={{ fontSize: 16 }}> {props.subTitle}</p>
        </div>
        <div>No data available for the chart.</div>
      </div>
    );
  }

  const config = {
    appendPadding: 10,
    data: data,
    angleField: "No of vessels",
    colorField: "Port",
    radius: 0.75,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name}\n{percentage}",
    },
    color: Object.values(colorPalette), // <-- Add this line to set custom colors
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
  };

  return (
    <Row
      style={{
        display: "flex",
        justifyContent: "center",
        background: "white",
        padding: 20,
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: 10,
      }}
    >
      <Col span={22}>
        <div style={{ letterSpacing: 1, paddingBottom: 20 }}>
          <p style={{ fontSize: 24 }}>{props.title} </p>
          <p style={{ fontSize: 16 }}> {props.subTitle}</p>
        </div>
        <div>
          <Pie {...config} />
        </div>
      </Col>
    </Row>
  );
};

export default PieChart3D;
