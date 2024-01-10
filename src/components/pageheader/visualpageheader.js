import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Row, Select } from "antd";
import { DatePicker } from "antd";
import Link from "next/link";
import moment from "moment";
import { BsArrowLeft } from "react-icons/bs";
import dayjs from "dayjs";
import { harbor_list } from "../../helper/dropdown";
import { RxArrowLeft } from "react-icons/rx";
import { useRouter } from "next/router.js";

const { RangePicker } = DatePicker;


function Visualpageheader(props) {
  const { setDateRange , dateRange , showButton} = props
   const router = useRouter();
   const handleBack = () => {
     router.push("/");
   };
  return (
    <>
      {/* <Row>
        <RxArrowLeft
          onClick={handleBack}
          cursor={"pointer"}
          className="ml-14"
          fontSize={25}
        />
        <span
          onClick={handleBack}
          className=" ml-2 text-sm font-medium"
          style={{ cursor: "pointer" }}
        >
          Back
        </span>
      </Row>
      <Row>
        <Col span={24} className="flex justify-end items-center p-6">
          <div className="px-2">
            <div>
              <p className="font-bold">Select a Date </p>
            </div>
            <RangePicker
              onChange={(value) => setDateRange(value)}
              defaultValue={dateRange}
            />
          </div>
        </Col>
      </Row> */}

      <Row className="flex items-center mt-14">
        <RxArrowLeft
          onClick={handleBack}
          cursor={"pointer"}
          className="ml-14"
          fontSize={25}
        />
        <span
          onClick={handleBack}
          className=" ml-2 text-sm font-medium"
          style={{ cursor: "pointer" }}
        >
          Back
        </span>
      </Row>

      <div
        className="flex justify-end ... mx-14 mb-8 mt-4"
        // class="grid grid-cols-1 md:grid-cols-6"
      >
        {showButton && (
          <>
            {" "}
            <div>
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
            <div>
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
                  // onChange={handleChartChange}
                  // value={currentChart}
                >
                  <Option value="bar">Bar Graph</Option>
                  <Option value="sunBurst">Sunburst Chart</Option>
                  {/* <Option value="stackBar">Stack Bar Graph</Option> */}
                </Select>
              </div>
            </div>
          </>
        )}
        <div className="">
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
      </div>
    </>
  );
}

export default Visualpageheader;
