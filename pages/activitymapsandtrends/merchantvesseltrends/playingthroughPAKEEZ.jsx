import React, { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import Heading from "../../../src/components/title/Heading";
import { Col, Row, Select, Switch } from "antd";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import axios from "axios";
import dayjs from "dayjs";
import { type_list } from "../../../src/helper/dropdown";
import { DatePicker } from "antd";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
const { RangePicker } = DatePicker;
const PieChart3D = dynamic(
  () => import("../../../src/components/piechart/PieChart3D"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function PlayingThroughPAKEEZ() {
  const [harbor, setHarbor] = useState("");
  const [season, setSeason] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(12, "month"),
    dayjs(),
  ]);
  const [filteredData, setFilteredData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleApiChange();
  }, [harbor, vesselType, season, dateRange]);

  const handleApiChange = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARINE_DATA}/ship_counts?date_from=${dateFrom}&&date_to=${dateTo}`
      );
      const data = response.data; // Use response.data instead of response.json()
  

      // Convert the API data to the format expected by the PieChart3D component
      const transformedData = Object.keys(data).map((key) => ({
        "No of vessels": data[key],
        Port: key,
      }));
      setFilteredData(transformedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <Visualpageheader
        setDateRange={(value) => setDateRange(value)}
        dateRange={dateRange}
        showButton={false}
      />
      <div>
        <PieChart3D
          title="MVs Plying through Pak EEZ "
          subTitle=" Data Source (AIS)"
          data={filteredData}
        />
      </div>
    </>
  );
}

export default PlayingThroughPAKEEZ;
export async function getServerSideProps(context) {
  return {
    props: {
      title: `PlyingThroughPAKEEZ`,
    },
  };
}
