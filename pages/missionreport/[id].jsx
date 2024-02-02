import {
  Col,
  Descriptions,
  Row,
  Tooltip,
} from "antd";
import React from "react";
import Heading from "../../src/components/title/Heading";
import axios from "axios";
import dayjs from "dayjs";
import {  decimalToDMS } from "../../src/helper/position";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";



function MissDetails({ data }) {
  const missionDetailsDataColumns = [
    {
      title: "MMSI",
      dataIndex: "mrd_mmsi",
          ellipsis: false,
      width: 250,
    },
    {
      title: "Longitude",
      dataIndex: "mrd_long",
          ellipsis: false,
      width: 250,
      render: (text, record) => {
        if (record.mrd_position) {
          var val = record.mrd_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {longitude}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Latitude",
      dataIndex: "mrd_lat",
          ellipsis: false,
      width: 250,
      render: (text, record) => {
        if (record.mrd_position) {
          var val = record.mrd_position.coordinates[1];
          const latitude = decimalToDMS(val, 0);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {latitude}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Course",
      dataIndex: "mrd_course",
          ellipsis: false,
      width: 250,
    },

    {
      title: "Speed",
      dataIndex: "mrd_speed",
          ellipsis: false,
      width: 250,
    },
    {
      title: "Vessel Name",
      dataIndex: "mrd_vessel_name",
          ellipsis: false,
      width: 250,
    },

    {
      title: "NPOC",
      dataIndex: "mrd_npoc",
          ellipsis: false,
      width: 250,
    },

    {
      title: "LPOC",
      dataIndex: "mrd_lpoc",
          ellipsis: false,
      width: 250,
    },

    {
      title: "Activity Description",
      dataIndex: "mrd_act_desc",
          ellipsis: false,
      width: 250,
    },

    {
      title: "AIS Status",
      dataIndex: "mrd_ais_status",
          ellipsis: false,
      width: 250,
    },

    {
      title: "Call Details",
      dataIndex: "mrd_call_details",
          ellipsis: false,
      width: 250,
    },

    {
      title: "Response",
      dataIndex: "mrd_response",
          ellipsis: false,
      width: 250,
    },

    {
      title: "Remarks",
      dataIndex: "mrd_remarks",
          ellipsis: false,
      width: 250,
    },

    {
      title: "Vessel Type",
      dataIndex: "mrd_vessel_type",
    },

    {
      title: "Date Time",
      dataIndex: "mrd_dtg",
          ellipsis: false,
      width: 250,
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
  ];

  const items = [
    {
      label: "Platform ID",
      children: data?.mr_pf_id || "",
    },
    {
      label: "Date Time ",
      children: dayjs(data?.mr_dtg).format("YYYY-MM-DD HH:mm:ss") || "",
    },
    {
      label: "Registered ON",
      children: dayjs(data?.mr_rdt).format("YYYY-MM-DD HH:mm:ss") || "",
    },
  ];

  const tableItems = [
    {
      title: "Mission Details",

      columns: missionDetailsDataColumns,
      data: data?.missionreportdetails,
    },
  ];

  return (
    <div>
      <PageHeader showSearchBox={false} title="Mission Report " />
      <div className=" mt-4 flex">
        <Heading
          className="whitespace-nowrap ml-5 "
          level={5}
          text="Macro Data"
        />
      </div>
      <section className="mb-10">
        {/* <Descriptions
          size="middle"
          className="mt-5 ml-4 mr-4 descriptionTable"
          bordered={true}
          column={{ xs: 1, sm: 2, md: 3, lg: 3 }}
        >
          {items.map((item, index) => (
            <Descriptions.Item key={index} label={item.label}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions> */}
        <Descriptions
          size="small"
          className="p-2"
          bordered={true}
          colon={true}
          borderColor="transparent"
          column={{ xs: 1, sm: 2, md: 2, lg: 2 }}
        >
          {items.map((item, index) => (
            <Descriptions.Item
              key={index}
              className="flex-container justify-between "
              span={index === items.length - 1 ? 1 : undefined}
            >
              <Row className="flex">
                <Col span={8} className="flex justify-start ">
                  <div className="descriptionLabel ">{item.label}</div>
                </Col>
                <Col span={14} className="flex justify-end">
                  <div className="descriptionChildren ">{item.children}</div>
                </Col>
              </Row>
              {/* </div> */}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </section>
      {tableItems.map((item, index) => {
        return (
          <TableItemRenderer
            key={index}
            title={item.title}
            columns={item.columns}
            data={item.data}
            
            pagination={true}
          />
        );
      })}
    </div>
  );
}

export default MissDetails;
export async function getServerSideProps(context) {
  const { id } = context.query;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep/${id}`
    );
    if (response.status === 200) {
      return {
        props: {
          data: response.data,
          title: `Intel Report Details (${id})`,
        },
      };
    }
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }
}
