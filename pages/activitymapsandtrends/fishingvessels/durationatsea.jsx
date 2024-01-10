import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { Col, Row } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import dayjs from "dayjs";
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

function DurationSea() {
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(12, "month"),
    dayjs(),
  ]);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/trip_duration?date_from=${dateFrom}&&date_to=${dateTo}`
      );
      const data = await response.json();


      // Convert the API data to the format expected by the PieChart3D component
      const transformedData = [
        {
          Port: "between 15 and 30 days",
          "No of vessels": data["between 15 and 30 days"],
        },
        {
          Port: "greater than 30 days",
          "No of vessels": data["greater than 30 days"],
        },
        {
          Port: "less than 15 days",
          "No of vessels": data["less than 15 days"],
        },
      ];
      setFilteredData(transformedData);


      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };



  return (
    <div>
      <Visualpageheader
        setDateRange={(value) => setDateRange(value)}
        dateRange={dateRange}
        showButton={false}
      />
      <Row>
        <Col span={24}>
          {loading ? (
            <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
          ) : (
            <PieChart3D
              title={"Fishing Vessel - Duration at Sea"}
              data={filteredData}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default DurationSea;
