import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import { Checkbox, Col, Row, Select } from "antd";
import { DatePicker } from "antd";
import "leaflet/dist/leaflet.css";
import geoJSONData from "../../../src/components/cholorpleth/data";
import Data from "../../../src/components/calendar/calendarData";

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

const Chloropleth = dynamic(
  () => import("../../../src/components/cholorpleth/chloroplethMap"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const CalendarWeekly = dynamic(
  () => import("../../../src/components/calendar/calendarWeeklyMap"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const CalendarMonthly = dynamic(
  () => import("../../../src/components/calendar/calendarMontlhyMap"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const CalendarDaily = dynamic(
  () => import("../../../src/components/calendar/calendarDailyMap"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const PNMSAaircraft = ({ currentChart }) => {
  const mapStyles = {
    height: "600px",
    width: "100%",
    // Add any other styling props you want to customize
  };
  useEffect(() => {
    handleApiChange();
  }, []);

  const [airCraftData, setAirCraftData] = useState();
  const [loading, setLoading] = useState(true);

  const handleApiChange = async () => {
    const response = [
      { air: "Aircarft 1", number: 56 },
      { air: "Aircarft 2", number: 82 },
      { air: "Aircarft 3", number: 15 },
      { air: "Aircarft 4", number: 33 },
      { air: "Aircarft 5", number: 71 },
      { air: "Aircarft 6", number: 29 },
      { air: "Aircarft 7", number: 91 },
      { air: "Aircarft 8", number: 47 },
      { air: "Aircarft 9", number: 64 },
      { air: "Aircarft 10", number: 88 },
    ];



    // Format the data for the bar chart
    const formattedData = response.map(({ air, number }) => ({
      date: air, // x-axis: air
      value: number, // y-axis: number
      name: air, // labels
    }));

    setAirCraftData(formattedData);
    setLoading(false);
  };
  return (
    <div>
      <div>
        {!airCraftData ? (
          loading ? (
            <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
          ) : null
        ) : currentChart === "bar" ? (
          <BasicBar
            isGroup={false}
            title={"Deployment/ Employment of MSA Assets at Sea"}
            subTitle={"Monthly Flying Hours of PMSA Defenders"}
            data={airCraftData}
          />
        ) : currentChart === "chloropethGraph" ? (
          <Chloropleth
            data={geoJSONData}
            // style={{height:"600px" , width:"100%"}}
            mapStyles={mapStyles}
            title={"Deployment/ Employment of MSA Assets at Sea"}
            subTitle={"Monthly Flying Hours of PMSA Defenders"}
          />
        ) : currentChart === "calenderGrph" ? (
          <CalendarWeekly
            datas={Data}
            title={"Deployment/ Employment of MSA Assets at Sea"}
            subTitle={"Weekly Calendar"}
          />
        ) : currentChart === "monthlyCalendar" ? (
          <CalendarMonthly
            datas={Data}
            title={"Deployment/ Employment of MSA Assets at Sea"}
            subTitle={"Monthly Calendar"}
          />
        ) : currentChart === "dailyCalendar" ? (
          <CalendarDaily
            datas={Data}
            title={"Deployment/ Employment of MSA Assets at Sea"}
            subTitle={"DailyCalendar"}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PNMSAaircraft;
