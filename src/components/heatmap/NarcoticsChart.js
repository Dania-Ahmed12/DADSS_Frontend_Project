import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import styled from "styled-components";
import { Scatter } from "react-chartjs-2";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

import { LoadingOutlined } from "@ant-design/icons";

const DensityHeatMap = dynamic(
  () => import("../../../src/components/LeafletMap/map"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const MyChart = () => {
  const data = {
    datasets: [
      {
        label: "Hashish",
        data: [
          {
            x: 44.5,
            y: 33.2,
          },
        ],
        backgroundColor: "#59A0CB",
        // borderColor: "rgba(255, 99, 132, 1)",
        pointStyle: "circle",
        pointRadius: 10,
      },
      {
        label: "Brown Crystal",
        data: [
          {
            x: 45,
            y: 34,
          },
        ],
        backgroundColor: "#E6E13F",
        // borderColor: "red",
        pointStyle: "circle",
        pointRadius: 10,
      },
      {
        label: "Cocain",
        data: [
          {
            x: 60,
            y: 30,
          },
        ],
        backgroundColor: "#596CCB",
        // borderColor: "red",
        pointStyle: "circle",
        pointRadius: 10,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        min: 0,
        max: 100,
      },
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  const scatterData = [
    { lat: 24.8607, lng: 67.0011, label: "Hashish" },
    {
      lat: 26.005539511863745,
      lng: 63.049291499900676,
      label: " Brown Crystal",
    },
    { lat: 25.14036726496694, lng: 62.355666891015886, label: "Cocain" },
    // const scatterData = [
    //   { label: "Hashish", coordinates: { lat: 24.8607, lng: 67.0011 } },
    //   { label: "Brown Crystal", coordinates: { lat: 45, lng: 34 } },
    //   { label: "Cocain", coordinates: { lat: 60, lng: 30 } },
    // ];
  ];
  // Custom marker icon
  const customIcon = new L.Icon({
    iconUrl: "/images/point-filled.svg",
    iconSize: [25, 41], // Adjust based on your icon size
    // iconAnchor: [12, 41],
    // popupAnchor: [1, -34],
    // shadowSize: [41, 41],
  });

  return (
    // <StyledDiv>
    //   {/* <Scatter chart={Chart} data={data} options={options} /> */}
    //   <DensityHeatMap
    //     data={scatterData}
    //     center={[24.8607, 67.0011]}
    //     zoom={8}
    //   >
    //     {/* Render markers on the map */}
    //     {scatterData.map((point, index) => (
    //       <Marker
    //         key={index}
    //         position={[point.lat, point.lng]}
    //         icon={customIcon}
    //       >
    //         <Popup>{point.label}</Popup>
    //       </Marker>
    //     ))}
    //   </DensityHeatMap>
    // </StyledDiv>
    <StyledDiv>
      <DensityHeatMap data={scatterData} center={[24.8607, 67.0011]} zoom={8}>
        {/* Render markers on the map */}
        {scatterData.map((point, index) => (
          <Marker
            key={index}
            position={[point.lat, point.lng]}
            icon={customIcon}
          >
            <Popup>{point.label}</Popup>
          </Marker>
        ))}
      </DensityHeatMap>
    </StyledDiv>
  );
};

export default MyChart;
const StyledDiv = styled.div`
  background-image: url("/images/map.png");
  /* background-position: center; */
  background-size: cover;
  background-repeat: no-repeat;
  /* height: 100vh; */
`;
