import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { BsArrowLeft } from "react-icons/bs";
import { Col, Row, Select } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { harbor_list, type_list } from "../../../src/helper/dropdown";
import Visualpageheader from "../../../src/components/pageheader/visualpageheader";
const { RangePicker } = DatePicker;
const MultiBiDirectionalBar = dynamic(
  () => import("../../../src/components/barchart/MultiBiDirectionalBar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const Sunburst = dynamic(
  () => import("../../../src/components/sunburstChart/sunBurst"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const StackBar = dynamic(
  () => import("../../../src/components/barchart/stackbar"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function EnteringLeavingHarbour() {
  const [harbor, setHarbor] = useState("");
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(12, "month"),
    dayjs(),
  ]);
  const [filteredData, setFilteredData] = useState("");
  const [currentChart, setCurrentChart] = useState("bar");
  const [sunburstApi, setSunburstApi] = useState("");

  const handleChartChange = (chartType) => {
    setCurrentChart(chartType);
  };

  useEffect(() => {
    handleApiChange();
  }, [harbor, dateRange]);

  const handleApiChange = async () => {
    const dateFrom = dateRange ? dayjs(dateRange[0]).format("YYYY-MM-DD") : "";
    const dateTo = dateRange ? dayjs(dateRange[1]).format("YYYY-MM-DD") : "";
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/leave_enter?date_from=${dateFrom}&&date_to=${dateTo}&&boat_location=${harbor}`
      );
      //for sunburst using this api
      const apiResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fv_leave_enter?date_from=${dateFrom}&&date_to=${dateTo}&&boat_location=${harbor}`
      );
      if (response.status === 200 || apiResponse.status === 200) {
        setFilteredData(response.data);


        function transformData(apiResponse) {
          const root = {
            name: "Root",
            children: [],
          };

          apiResponse.data.forEach((item) => {
            const locationNames = Object.keys(item).filter(
              (key) => key !== "date"
            );

            locationNames.forEach((locationName) => {
              // Check if the location node exists, create if not
              let locationNode = root.children.find(
                (node) => node.name === locationName
              );
              if (!locationNode) {
                locationNode = {
                  name: locationName,
                  children: [],
                };
                root.children.push(locationNode);
              }

              const rawDate = item.date;
              const [month, year] = rawDate.split(", ");

              if (month && year) {
                // Check if the year node exists, create if not
                let yearNode = locationNode.children.find(
                  (node) => node.name === year
                );
                if (!yearNode) {
                  yearNode = {
                    name: year,
                    children: [],
                  };
                  locationNode.children.push(yearNode);
                }

                // Check if the month node exists, create if not
                let monthNode = yearNode.children.find(
                  (node) => node.name === month
                );
                if (!monthNode) {
                  monthNode = {
                    name: month,
                    children: [],
                    value: item[locationName].arrivals,
                    // value: item[locationName].departures,
                  };
                  yearNode.children.push(monthNode);
                }
              }
            });
          });
          return root;
        }
        const transformedData = transformData(apiResponse);
        setSunburstApi(transformedData);
      }
    } catch (error) {
    }
  };

  return (
    <div>
      {/* <div>
        <Link href="/dashboard">
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
      </div> */}
      <Visualpageheader/>

      {/* <Row className="p-4 flex items-center">
        <Col span={12}></Col>
        <Col span={4} className="flex justify-end items-center">
          <div className="px-2 flex items-end">
            <label className="px-2">Visuals</label>
            <Select
              placeholder="Select Chart"
              style={{
                width: 150,
              }}
              onChange={handleChartChange}
              value={currentChart}
            >
              <Option value="bar">Bar Graph</Option>
              <Option value="sunBurst">Sunburst Chart</Option>
              <Option value="stackBar">Stack Bar Graph</Option>
            </Select>
          </div>
        </Col>
        <Col span={4} className="flex justify-end items-center">
          <div className="w-1/2">
            <div className="flex items-center justify-end space-x-2 py-2 px-4">
              <div className="flex justify-end items-center py-2 px-4">
                <div className="px-2">
                  <label>Harbor</label>
                  <Select
                    placeholder="View all"
                    style={{
                      width: 150,
                    }}
                    onChange={(value) => setHarbor(value)}
                    options={[{ value: "", label: "View all" }].concat(
                      harbor_list.map((item) => ({
                        value: item,
                        lable: item,
                      }))
                    )}
                  />
                </div>
                <div className="px-2">
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
        </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={4} className="flex justify-end items-center">
          <div className="px-2">
            <RangePicker
              onChange={(value) => setDateRange(value)}
              defaultValue={dateRange}
            />
          </div>
        </Col>
      </Row> */}
      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="col-start-5 row-start-1">
          {" "}
          <div className="px-2">
            <div>
              <p className="font-bold">Harbour</p>
            </div>
            <Select
              placeholder="View all"
              style={{
                width: 150,
              }}
              onChange={(value) => setHarbor(value)}
              options={[{ value: "", label: "View all" }].concat(
                harbor_list.map((item) => ({
                  value: item,
                  lable: item,
                }))
              )}
            />
          </div>
        </div>
        <div className="col-start-6 row-start-1">
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
            <div>
              <p className="font-bold">Visuals</p>
            </div>
            <Select
              placeholder="Select Chart"
              style={{
                width: 150,
              }}
              onChange={handleChartChange}
              value={currentChart}
            >
              <Option value="bar">Bar Graph</Option>
              <Option value="sunBurst">Sunburst Chart</Option>
              {/* <Option value="stackBar">Stack Bar Graph</Option> */}
            </Select>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {currentChart === "bar" ? (
          <MultiBiDirectionalBar
            title={"Fishing Boats Leaving and Entering Harbour"}
            data={filteredData ? filteredData : [{}]}
          />
        ) : currentChart === "sunBurst" ? (
          <Sunburst
            data={sunburstApi}
            title={"Fishing Boats Leaving and Entering Harbour"}
          />
        ) : (
          <StackBar
            // data={data}
            title={"Fishing Boats Leaving and Entering Harbour"}
          />
        )}
      </div>
    </div>
  );
}

export default EnteringLeavingHarbour;
export async function getServerSideProps(context) {
  return {
    props: {
      title: `Entering and Leaving Harbor`,
    },
  };
}
