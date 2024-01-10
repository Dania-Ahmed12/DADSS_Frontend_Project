import React, { useEffect, useRef } from "react";
import * as d3 from "d3"; // Import D3
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";

const MapContainers = dynamic(
  () => import("../../../src/components/LeafletMap/map"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const ChloroplethMap = ({ data }) => {
  const mapRef = useRef(null);

  const style = (feature) => {
    const value = feature.properties.value; // Adjust this to access the data value
    return {
      fillColor: getColor(value),
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const getColor = (value) => {
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);
    return colorScale(value);
  };

  const onEachFeature = (feature, layer) => {
    layer.bindTooltip(
      `Region: ${feature.properties.name}\nValue: ${feature.properties.value}`
    );
  };

  return (
    <>
      <MapContainers
        center={[22.759320454807195, 62.9907962356869]}
        zoom={6}
        // style={style}
        geojsonData={data}
        // onEachFeature={onEachFeature}
      ></MapContainers>
      {/* Tooltip element */}
      <div className="tooltip"></div>
    </>
  );
};

export default ChloroplethMap;
