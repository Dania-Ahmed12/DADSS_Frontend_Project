import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { Col, Row, Select } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import { Checkbox } from "antd";
import { BsArrowLeft } from "react-icons/bs";
import dayjs from "dayjs";
import axios from "axios";
import { portListMerchantOverstay } from "../../../src/helper/dropdown";

const { RangePicker } = DatePicker;

const Historgram = dynamic(
  // () => import("../../../src/components/piechart/PieChart3D"),
  () => import("../../../src/components/barchart/BasicBar"),

  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function OverStay() {
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [port, setPort] = useState("");
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(12, "month"),
    dayjs(),
  ]);

  useEffect(() => {
    fetchData();
  }, [port, dateRange]);

  const fetchData = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARINE_DATA}/stay_count?date_from=${dateFrom}&&date_to=${dateTo}&&port=${port}`
      );
      const data = response.data; // Use response.data instead of response.json()
 

      // Transform data into an array of objects with 'days' and 'count' properties
      const transformedData = Object.entries(data).map(([date, value]) => ({
        date: date,
        value: value,
        name: date,
      }));
      setFilteredData(transformedData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
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

      <div className="grid grid-cols-5 grid-rows-1 gap-4 p-4 mx-5 ">
        <div className="col-start-5 row-start-1">
          {" "}
          <div className="px-2">
            <div>
              <p className="font-bold">Select a Date </p>
            </div>
            <RangePicker
              onChange={(value) => setDateRange(value)}
              defaultValue={dateRange}
            />
          </div>
        </div>
        <div className="col-start-4 row-start-1">
          {" "}
          <div className="px-2">
            <p className="font-bold">Harbours</p>

            <Select
              placeholder="View all"
              style={{
                width: 150,
              }}
              onChange={(value) => setPort(value)}
              options={[{ value: "KARACHI", label: "KARACHI" }].concat(
                portListMerchantOverstay.map((item) => ({
                  value: item,
                  lable: item,
                }))
              )}
            />
          </div>
        </div>
      </div>

      <Row>
        <Col span={24}>
          {loading ? (
            <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
          ) : (
            // <PieChart3D title="Merchant Vessel Overstay" data={filteredData} />
            <Historgram title="Merchant Vessel Overstay" data={filteredData} />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default OverStay;
