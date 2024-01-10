import axios from "axios";
import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import ReactMapGL, { Source, Layer } from "react-map-gl";
import dayjs from "dayjs";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";

const DensityHeatMap = dynamic(
  // () => import("../../../src/components/heatmap/FishingDesnityHeatMap"),
  () => import("../../../src/components/LeafletMap/map"),

  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const Heatmap = () => {
  const [harbor, setHarbor] = useState("");
  const [season, setSeason] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(24, "month"),
    dayjs(),
  ]);
  // const [filteredData, setFilteredData] = useState("");
  const [filteredData, setFilteredData] = useState(() => {
    // Retrieve data from local storage when the component is initialized
    const storedData = localStorage.getItem("filteredData");
    return storedData ? JSON.parse(storedData) : "";
  });

  useEffect(() => {
    handleApiChange();
  }, [harbor, vesselType, season, dateRange]);

  const handleApiChange = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fv_con?date_from=${dateFrom}&&date_to=${dateTo}&&season=${season}&&harbor=${harbor}&&type=${vesselType}`
      );
      if (response.status === 200) {

        const transformedData = response.data.map((feature) => {
          const coordinates = feature.geometry.coordinates;
          const intensity = feature.properties.intensity;

          return {
            lat: coordinates[1],
            lng: coordinates[0],
            count: intensity,
          };
        });

        setFilteredData(transformedData);
      }
    } catch (error) {
    }
  };

  const customData = {
    type: "FeatureCollection",
    features: [...filteredData],
  };

  return (
    <div>
      {/* <Row className="p-4"> */}
      <div>
        {/* <div>
          <Link href="/">
            <BsArrowLeft size={30} />
            back to
            <span
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#0659ED",
                paddingLeft: 5,
              }}
            >
              Dashboard
            </span>
          </Link>
        </div>
        <div className="flex justify-end items-center p-6">
          <div className="px-2">
            <div>
              <p className="font-bold">Select a Date </p>
            </div>
            <RangePicker
              onChange={(value) => setDateRange(value)}
              defaultValue={dateRange}
            />
          </div>
        </div> */}

        {/* <div className="px-2">
          <label className="px-2">Harbor</label>
          <Select
            placeholder="View all"
            style={{
              width: 150,
            }}
            onChange={(value) => setHarbor(value)}
            options={[{ value: "", label: "View all" }].concat(harbor_list.map((item) => ({ value: item, lable: item })))}
          />
        </div> */}
        {/* <div className="px-2">
          <label className="px-2">Vessel type</label>
          <Select
            placeholder="View all"
            style={{
              width: 150,
            }}
            onChange={(value) => setVesselType(value)}
            options={[{value: "", label: "View all"}].concat(type_list.map((item) => ({value: item, lable: item})))}
          />
        </div>
        <div className="px-2">
          <label className="px-2">Season</label>
          <Select
            placeholder="Select Season"
            style={{
              width: 150,
            }}
            onChange={(value) => setSeason(value)}
            options={[
              {
                value: "",
                label: "View all",
              },
              {
                value: "Summer",
                label: "Summer",
              },
              {
                value: "Winter",
                label: "Winter",
              },
            ]}
          />
        </div> */}
        {/* <div className="px-2">
          <RangePicker
            onChange={(value) => setDateRange(value)}
            defaultValue={dateRange}
          />
        </div> */}
      </div>
      {/* <div style={{ height: "70vh" }}>
        <ReactMapGL
          initialViewState={{
            latitude: 23.756779,
            longitude: 63.300738,
            zoom: 6,
            bearing: 0,
          }}
          width="100%"
          height="100%"
          mapboxAccessToken="pk.eyJ1IjoiYWhtZWRtdXN0YWZhMTIzNCIsImEiOiJjbGQ0N2Z3aDEwOHdjM29tZGptcWdhZjUxIn0.DQxoDg5UgKUAWDeavSrseQ"
          // onViewportChange={(nextViewport) => setViewport(nextViewport)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          <Source id="heatmap" type="geojson" data={customData} />
          <Layer
            id="heat"
            source="heatmap"
            type="heatmap"
            paint={{
              "heatmap-opacity": 0.8,
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(0, 0, 255, 0)",
                0.1,
                "royalblue",
                0.3,
                "cyan",
                0.5,
                "lime",
                0.7,
                "yellow",
                1,
                "rgb(204, 85, 0)",
              ],
              "heatmap-radius": 20,
              "heatmap-weight": ["get", "intensity"],
            }}
          />
        </ReactMapGL>
      </div> */}
      {/* <div id="map" style={{ height: "550px" }}></div> */}

      <Visualpageheader
        setDateRange={(value) => setDateRange(value)}
        dateRange={dateRange}
      />

      <DensityHeatMap
        title="Fishing Desnity Heat Map"
        heatmapData={filteredData}
        //  data={filteredData}
      />
    </div>
  );
};

export default Heatmap;
export async function getServerSideProps(context) {
  return {
    props: {
      title: `Heat Map`,
    },
  };
}
