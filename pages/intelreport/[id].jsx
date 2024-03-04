import {
  Button,
  Col,
  Descriptions,
  Image,
  InputNumber,
  Row,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import Heading from "../../src/components/title/Heading";
import axios from "axios";
import dayjs from "dayjs";
import { IntelColumns } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";
import dynamic from "next/dynamic";
import FilledButton from "../../src/components/button/FilledButton";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchIntelReportID } from "../../src/redux/thunks/intelReportData";
import { showToastError, showToastSuccess } from "../../src/helper/MyToast";
import { hasPermission } from "../../src/helper/permission";

const JettyDataTable = dynamic(
  () => import("../../src/components/table/JettyDataTable"),
  {
    ssr: false,
  }
);
function IntelDetails() {
  const router = useRouter();
  const { ir_key } = router.query; // Extract ir_key from query parameters
  const [data, setData] = useState(null);
  const changePermission = hasPermission('change_intelreport');

  const fetchIntelReportID = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport/${ir_key}`
      );
      if (response.status === 200)
        setData(response.data);
    } catch (error) {
      showToastError("Intel report not found");
    }
  }

  useEffect(() => {
    if (!data) {
      fetchIntelReportID();
    }
  }, []);

  const [jettyData, setJettyData] = useState();

  useEffect(() => {
    if (data && data.intelreportdetails) {
      const newIntelDetail = data.intelreportdetails.map((item) => ({
        ...item,
        ird_detected_from: dayjs(item.ird_detected_from),
        ird_detected_to: dayjs(item.ird_detected_to),
      }));
      setJettyData(newIntelDetail);
    }
  }, [data]);

  const handleEditSave = () => {
    jettyData.map((item) => {
      const newItem = {
        ...item,
        ird_detected_from: item.ird_detected_from.toISOString(),
        ird_detected_to: item.ird_detected_to.toISOString(),
        ird_boat_picture: item.ird_boat_picture ? item.ird_boat_picture : "",
      }
      if (typeof (item.ird_boat_picture) === 'string') {
        delete newItem["ird_boat_picture"];
      }
      try {
        axios.put(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport_details/${item.ird_key}`,
          newItem, // Make sure this is the correct format for your API
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
      } catch (error) {
        showToastError(error.message);
      }
    });

    const id_list = jettyData.map((item) => item.ird_key)

    data.intelreportdetails.map((item) => {
      if (!id_list.includes(item.ird_key)) {
        try {
          axios.delete(
            `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport_details/${item.ird_key}`
          )
        } catch (error) {
          showToastError(error.message);
        }
      }
    })
    router.push("/intelreport");
    showToastSuccess(`Data Saved Successfully`);
  };

  // Map vesselcolumns to extract label and children
  const items = [
    {
      label: "Platform ID",
      children: data?.ir_pf_id || "",
    },
    {
      label: "Reporter Name",
      children: data?.ir_reporter_name || "",
    },
    {
      label: "Reporting Time ",
      children:
        dayjs(data?.ir_reporting_time).format("YYYY-MM-DD HH:mm:ss") || "",
    },
    {
      label: "Jetty",
      children: data?.ir_jetty || "",
    },
    {
      label: "Total Boats",
      children: data?.ir_total_boats || "",
    },
  ];

  return (
    <div>
      <PageHeader showSearchBox={false} title="Intel Report " />
      <div className="flex justify-end">
        {changePermission &&
          <FilledButton
            style={{ marginLeft: "auto" }}
            text="Save Intel Data"
            className="rounded-full border-lightgreen bg-lightgreen text-white mr-4"
            onClick={handleEditSave}
          />
        }
      </div>
      <div className="mt-4 flex">
        <Heading
          className="whitespace-nowrap ml-5 "
          level={5}
          text="Macro Data"
        />
      </div>
      <section className="mb-10">
        <Descriptions
          size="small"
          className="p-2"
          bordered={true}
          colon={true}
          borderColor="transparent"
          column={{ xs: 1, sm: 2, md: 2, lg: 3 }}
        >
          {items.map((item, index) => (
            <Descriptions.Item
              key={index}
              className="flex-container justify-between "
              span={index === items.length - 1 ? 1 : undefined}
            >
              <Row className="flex">
                <Col span={10} className="flex justify-start ">
                  <div className="descriptionLabel ">{item.label}</div>
                </Col>
                <Col span={14} className="flex justify-end">
                  <div className="descriptionChildren mr-5 ">
                    {item.children}
                  </div>
                </Col>
              </Row>
              {/* </div> */}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </section>
      <JettyDataTable
        isLoading={false}
        jettyData={jettyData}
        setJettyData={setJettyData}
        showButtons={changePermission}
      />
    </div>
  );
}

export default IntelDetails;
