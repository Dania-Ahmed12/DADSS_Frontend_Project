import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useRef } from "react";
import { Col, Row } from "antd";

const MapContainerComponent = ({
  geojsonData,
  heatmapData,
  gradient,
  data,
  center,
  zoom,
  title, 
  subTitle
}) => {
  const mapRef = useRef(null);
  //console.log(data);

  useEffect(() => {
    // Initialize the map
    // const map = L.map(mapRef.current).setView([0, 0], 2);
    const map = L.map(mapRef.current, {
      zoomControl: true,
      center: [24.5, 65.325],
      zoom: 4,
      attributionControl: true,
      scrollWheelZoom: true,
    });

    // Add a tile layer
    const tileLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 9,
        scrollWheelZoom: true,
        attributionControl: true,
      }
    ).addTo(map);

    // Function to add the appropriate tile layer based on online/offline status
    const addTileLayer = () => {
      // Check if the browser is online
      if (window.navigator.onLine) {
        // Online: Use the online tile layer
        tileLayer.setUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
      } else {
        // Offline: Use the offline tile layer
        tileLayer.setUrl("/my-offline-tiles/{z}/{x}/{y}.png");
      }
    };
    // Initial call to add the tile layer based on the current online/offline status
    addTileLayer();

    // Listen for changes in online/offline status
    window.addEventListener("online", addTileLayer);
    window.addEventListener("offline", addTileLayer);

    // Add GeoJSON layer if provided
    if (geojsonData) {
      L.geoJSON(geojsonData).addTo(map);
    }

    // Add heatmap layer if provided
    if (heatmapData) {
      const heat = L.heatLayer(heatmapData, {
        radius: 12,
        gradient: gradient || {
          0.1: "darkblue",
          0.2: "blue",
          0.4: "cyan",
          0.6: "lime",
          0.8: "yellow",
          1.0: "red",
        },
        minOpacity: 0.57,
      });

      heat.addTo(map);
    }

    // Add this logging statement
    if (data) {
      data.forEach((marker, index) => {
        //console.log(`Processing marker at index ${index}:`, marker);
        const { lat, lng, label } = marker;
        // Check if lat and lng are defined before creating the marker
        if (lat !== undefined && lng !== undefined) {
          L.marker([lat, lng]).bindPopup(label).addTo(map);
        } else {
          console.error(
            `Invalid LatLng object at index ${index}: (lat: ${lat}, lng: ${lng})`
          );
        }
      });
    }

    // Cleanup function to remove the map when the component unmounts
    return () => {
      map.remove();
    };
  }, [geojsonData, heatmapData, gradient, data, center, zoom]);

  return (
    // <div ref={mapRef} style={{ height: "500px", width: "100%" }} />
    <Row
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "white",
        // padding: "20px",
        padding:"10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: 10,
      }}
    >
      <Col span={24}>
        <p style={{ fontSize: 24 }}>{title}</p>
        <p style={{ paddingBottom: 30 }}>{subTitle}</p>
        {/* <Line {...config} style={{ height: "55vh" }} /> */}
        <div ref={mapRef} style={{ height: "500px", width: "100%" }} />
      </Col>
    </Row>
  );
};

export default MapContainerComponent;
