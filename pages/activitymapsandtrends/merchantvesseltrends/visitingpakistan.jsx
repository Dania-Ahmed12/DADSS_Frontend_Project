import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { Col, Row, Select } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import dayjs from "dayjs";
import axios from "axios";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";

const { RangePicker } = DatePicker;
const BasicBar = dynamic(
  () => import("../../../src/components/barchart/BasicBar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function VisitingPakistan() {
  //store the vessel type
  const [vesselType, setVesselType] = useState("");
  // State to store filtered data
  const [filteredData, setFilteredData] = useState([]);
  // New state to track data loading status
  const [loading, setLoading] = useState(true);
  // State to manage date range for the DatePicker
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(3, "month"), // Initial start date: 12 months ago from today
    dayjs(), // Initial end date: today
  ]);

  const handleChange = (value) => {
  };

  // Fetch data whenever vesselType or dateRange changes
  useEffect(() => {
    handleApiChange();
  }, [vesselType, dateRange]);

  // Function to fetch and handle data from the API
  const handleApiChange = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    if (dateFrom && dateTo) {
      try {
        setLoading(true); // Start loading state
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARINE_DATA}/ship_counts_week?date_from=${dateFrom}&&date_to=${dateTo}`
        );
        if (response.status === 200) {
    

          const transformedData = response.data.flatMap((item) => {
            const startDate = item["Week Start"];
            const endDate = item["Week End"];

            return Object.entries(item.Counts).map(([name, value]) => ({
              name: name, // Use the port name as the "name"
              date: `${startDate} - ${endDate}`, // Combine start and end dates as the "date"
              value: value, // Use the count value as the "value"
            }));
          });

          setFilteredData(transformedData);
        }
      } catch (error) {
      } finally {
        setLoading(false); // Stop loading state
      }
    } else {
      setFilteredData([]);
      setLoading(false); // Stop loading state
    }
  };
  return (
    <div>
      <Visualpageheader
        setDateRange={(value) => setDateRange(value)}
        dateRange={dateRange}
        showButton={false}
      />
      {loading ? (
        <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
      ) : (
        <BasicBar
          isGroup={true}
          title={"Mechant Vessels (MV's) Visiting Pakistan"}
          subTitle={"Data Source (AIS)"}
          data={filteredData}
        />
      )}
    </div>
  );
}

export default VisitingPakistan;

export async function getServerSideProps(context) {
  return {
    props: {
      title: `Visiting Pakistan`,
    },
  };
}
