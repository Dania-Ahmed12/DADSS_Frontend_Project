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
  return (
    <div>
  
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
